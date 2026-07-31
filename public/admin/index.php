<?php
session_start();

// Configuration
// Default password is 'admin123'. You can change this to any secure password you want.
$password_hash = '$2y$12$wNfXUP28k04AzuupwZ3im.cwyBhMIWsOw74kiiZA.rvDpS9eTORPC'; 

$json_file = '../data/gallery.json';
$image_upload_dir = '../images/gallery/';
$video_upload_dir = '../videos/';

// Ensure directories exist
if (!is_dir(dirname($json_file))) {
    mkdir(dirname($json_file), 0755, true);
}
if (!is_dir($image_upload_dir)) {
    mkdir($image_upload_dir, 0755, true);
}
if (!is_dir($video_upload_dir)) {
    mkdir($video_upload_dir, 0755, true);
}

// Authentication Handlers
if (isset($_POST['login'])) {
    $input_password = $_POST['password'] ?? '';
    if (password_verify($input_password, $password_hash)) {
        $_SESSION['trg_admin'] = true;
        header('Location: index.php');
        exit;
    } else {
        $error = "Password salah!";
    }
}

if (isset($_GET['logout'])) {
    unset($_SESSION['trg_admin']);
    header('Location: index.php');
    exit;
}

$is_logged_in = isset($_SESSION['trg_admin']) && $_SESSION['trg_admin'] === true;

// Read JSON Data Helper
function read_gallery($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

// Write JSON Data Helper
function write_gallery($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// Action Handlers
if ($is_logged_in) {
    $gallery = read_gallery($json_file);
    $message = '';
    $message_type = 'success';

    // POST Actions
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
        $action = $_POST['action'];

        // 1. ADD ITEM
        if ($action === 'add') {
            $title = strip_tags($_POST['title'] ?? '');
            $desc = strip_tags($_POST['desc'] ?? '');
            $category = $_POST['category'] ?? 'produksi';
            $type = $_POST['type'] ?? 'image';
            
            $new_item = [
                'id' => uniqid('live_'),
                'title' => $title,
                'desc' => $desc,
                'category' => $category,
                'type' => $type
            ];

            $upload_ok = true;

            // Handle Image Upload
            if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['image_file']['name'], PATHINFO_EXTENSION);
                $allowed = ['jpg', 'jpeg', 'png', 'webp'];
                if (in_array(strtolower($ext), $allowed)) {
                    $filename = 'uploaded_' . time() . '_' . rand(100, 999) . '.' . $ext;
                    $dest = $image_upload_dir . $filename;
                    if (move_uploaded_file($_FILES['image_file']['tmp_name'], $dest)) {
                        $new_item['src'] = '/images/gallery/' . $filename;
                    } else {
                        $upload_ok = false;
                        $message = "Gagal memindahkan file gambar.";
                    }
                } else {
                    $upload_ok = false;
                    $message = "Format gambar tidak didukung! Gunakan JPG, PNG, atau WEBP.";
                }
            } else {
                $upload_ok = false;
                $message = "File gambar wajib diunggah.";
            }

            // Handle Video Upload (if type is video)
            if ($type === 'video' && $upload_ok) {
                if (isset($_FILES['video_file']) && $_FILES['video_file']['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES['video_file']['name'], PATHINFO_EXTENSION);
                    $allowed = ['mp4', 'webm', 'ogg'];
                    if (in_array(strtolower($ext), $allowed)) {
                        $filename = 'uploaded_' . time() . '_' . rand(100, 999) . '.' . $ext;
                        $dest = $video_upload_dir . $filename;
                        if (move_uploaded_file($_FILES['video_file']['tmp_name'], $dest)) {
                            $new_item['videoSrc'] = '/videos/' . $filename;
                        } else {
                            $upload_ok = false;
                            $message = "Gagal memindahkan file video.";
                        }
                    } else {
                        $upload_ok = false;
                        $message = "Format video tidak didukung! Gunakan MP4.";
                    }
                } else {
                    $upload_ok = false;
                    $message = "File video wajib diunggah untuk tipe video.";
                }
            }

            if ($upload_ok) {
                // Insert at the beginning of the array so new items appear first
                array_unshift($gallery, $new_item);
                write_gallery($json_file, $gallery);
                $message = "Item galeri berhasil ditambahkan!";
            } else {
                $message_type = 'error';
            }
        }

        // 2. DELETE ITEM
        if ($action === 'delete') {
            $id = $_POST['id'] ?? '';
            $updated_gallery = [];
            foreach ($gallery as $item) {
                if ($item['id'] === $id) {
                    // Delete associated files from disk
                    if (isset($item['src']) && strpos($item['src'], '/images/gallery/uploaded_') === 0) {
                        $local_path = '..' . $item['src'];
                        if (file_exists($local_path)) {
                            unlink($local_path);
                        }
                    }
                    if (isset($item['videoSrc']) && strpos($item['videoSrc'], '/videos/uploaded_') === 0) {
                        $local_path = '..' . $item['videoSrc'];
                        if (file_exists($local_path)) {
                            unlink($local_path);
                        }
                    }
                } else {
                    $updated_gallery[] = $item;
                }
            }
            $gallery = $updated_gallery;
            write_gallery($json_file, $gallery);
            $message = "Item galeri berhasil dihapus!";
        }

        // 3. REORDER (MOVE UP / DOWN)
        if ($action === 'move') {
            $id = $_POST['id'] ?? '';
            $direction = $_POST['direction'] ?? '';
            $index = -1;
            
            for ($i = 0; $i < count($gallery); $i++) {
                if ($gallery[$i]['id'] === $id) {
                    $index = $i;
                    break;
                }
            }

            if ($index !== -1) {
                if ($direction === 'up' && $index > 0) {
                    // Swap with previous
                    $temp = $gallery[$index - 1];
                    $gallery[$index - 1] = $gallery[$index];
                    $gallery[$index] = $temp;
                    write_gallery($json_file, $gallery);
                    $message = "Posisi berhasil digeser ke atas!";
                } elseif ($direction === 'down' && $index < count($gallery) - 1) {
                    // Swap with next
                    $temp = $gallery[$index + 1];
                    $gallery[$index + 1] = $gallery[$index];
                    $gallery[$index] = $temp;
                    write_gallery($json_file, $gallery);
                    $message = "Posisi berhasil digeser ke bawah!";
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard — PT. Trans Ringo Groupmix</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --navy-900: #0a1128;
            --navy-800: #101f42;
            --navy-700: #1c2d5a;
            --gold-500: #d4a373;
            --gold-400: #e9c46a;
            --red-500: #db5665;
            --green-500: #2c935c;
            --gray-100: #f8f9fa;
            --gray-300: #dee2e6;
            --gray-400: #ced4da;
            --gray-800: #343a40;
            --text-light: #ffffff;
            --text-dark: #212529;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', sans-serif;
        }

        body {
            background-color: var(--navy-900);
            color: var(--text-light);
            min-height: 100vh;
        }

        /* Ambient Glow Backgrounds */
        .glow-bg {
            position: fixed;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            filter: blur(150px);
            opacity: 0.15;
            z-index: -1;
            pointer-events: none;
        }
        .glow-red {
            background: var(--red-500);
            top: -10%;
            left: -10%;
        }
        .glow-blue {
            background: #206db5;
            bottom: -10%;
            right: -10%;
        }

        /* Container & Glassmorphism Card */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .glass-card {
            background: rgba(28, 45, 90, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }

        /* Split Login Layout */
        .login-wrapper-split {
            display: flex;
            min-height: 100vh;
            width: 100%;
            background-color: #030712;
            overflow: hidden;
        }

        .login-cover {
            display: none;
            flex: 1.2;
            position: relative;
            overflow: hidden;
            padding: 80px;
            flex-direction: column;
            justify-content: flex-end;
        }

        @media (min-width: 1024px) {
            .login-cover {
                display: flex;
            }
        }

        .login-cover-img {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            filter: brightness(0.9) contrast(1.05); /* Lighter and clearer */
            transform: scale(1.02);
            transition: transform 15s ease;
        }

        .login-cover:hover .login-cover-img {
            transform: scale(1.08);
        }

        .login-cover-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(10, 17, 40, 0.5) 0%, rgba(3, 7, 18, 0.75) 100%);
        }

        .login-cover-content {
            position: relative;
            z-index: 2;
            max-width: 550px;
            background: rgba(10, 17, 40, 0.82); /* Darker glass background for white text readability */
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            text-align: left;
        }

        .brand-label {
            font-size: 12px;
            font-weight: 700;
            color: var(--gold-400);
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 16px;
            display: inline-block;
            border-bottom: 2px solid var(--gold-500);
            padding-bottom: 6px;
        }

        .cover-heading {
            font-size: 40px;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 18px;
            color: #ffffff;
            letter-spacing: -0.5px;
        }

        .cover-subheading {
            font-size: 15px;
            color: #9ca3af;
            line-height: 1.6;
        }

        .login-form-pane {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            background: radial-gradient(circle at 70% 30%, #111827 0%, #030712 100%);
            position: relative;
        }

        .floating-glow-orb {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            filter: blur(120px);
            opacity: 0.12;
            pointer-events: none;
        }
        .orb-1 {
            background: var(--red-500);
            top: 20%;
            right: 10%;
        }
        .orb-2 {
            background: #206db5;
            bottom: 15%;
            left: 20%;
        }

        .login-glass-container {
            width: 100%;
            max-width: 420px;
            background: rgba(17, 24, 39, 0.6);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 28px;
            padding: 45px 35px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
            position: relative;
            z-index: 2;
        }

        .login-card-inner {
            text-align: center;
        }

        .brand-logo-container {
            width: 160px;
            height: 60px;
            margin: 0 auto 24px auto;
            border-radius: 12px;
            padding: 3px;
            background: #000000; /* Flat black background to seamlessly match the logo background */
            border: 1px solid rgba(255, 255, 255, 0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .brand-logo-container img {
            width: 100%;
            height: 100%;
            object-fit: contain; /* Shrinks full logo to fit inside instead of cutting off */
            border-radius: 8px;
        }

        .brand-title {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
            color: #ffffff;
        }
        .brand-title span.red { color: var(--red-500); }
        .brand-title span.blue { color: #3b82f6; }
        .brand-title span.gold { color: var(--gold-400); }

        .brand-subtitle {
            color: #9ca3af;
            font-size: 14px;
            margin-bottom: 30px;
            line-height: 1.5;
        }

        .form-group {
            margin-bottom: 24px;
            text-align: left;
            position: relative;
        }

        .form-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #9ca3af;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
        }

        .input-icon {
            position: absolute;
            left: 16px;
            color: #6b7280;
            pointer-events: none;
            transition: color 0.3s;
            z-index: 5;
        }

        .form-input {
            width: 100%;
            padding: 14px 16px 14px 46px;
            background: rgba(3, 7, 18, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #ffffff;
            font-size: 16px;
            outline: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .form-input:focus {
            border-color: var(--gold-500);
            background: rgba(3, 7, 18, 0.8);
            box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.15), inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .form-input:focus + .input-icon {
            color: var(--gold-500);
        }

        .btn-primary-glow {
            background: linear-gradient(135deg, var(--gold-500) 0%, #b88655 100%);
            color: var(--navy-900);
            width: 100%;
            padding: 14px 24px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(212, 163, 115, 0.25);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary-glow:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(212, 163, 115, 0.45);
            opacity: 0.95;
        }

        .btn-primary-glow:active {
            transform: translateY(0);
        }

        .login-footer {
            margin-top: 35px;
            font-size: 12px;
            color: #6b7280;
            letter-spacing: 0.5px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--gold-500), #a37547);
            color: var(--navy-900);
            width: 100%;
        }

        .btn-primary:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }

        .btn-danger {
            background: var(--red-500);
            color: var(--text-light);
        }
        .btn-danger:hover {
            background: #c34c5a;
        }

        .btn-secondary {
            background: rgba(255,255,255,0.1);
            color: var(--text-light);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-secondary:hover {
            background: rgba(255,255,255,0.15);
        }

        .alert {
            padding: 14px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
        }

        .alert-error {
            background: rgba(219, 86, 101, 0.2);
            border: 1px solid var(--red-500);
            color: #ff8b97;
        }

        .alert-success {
            background: rgba(44, 147, 92, 0.2);
            border: 1px solid var(--green-500);
            color: #8be1b0;
        }

        /* Dashboard Header Layout */
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 40px;
            flex-wrap: wrap;
            gap: 20px;
        }

        .header-title-section h1 {
            font-size: 28px;
            font-weight: 700;
        }
        .header-title-section p {
            color: var(--gray-400);
            font-size: 14px;
            margin-top: 4px;
        }

        /* Dashboard Grid Layout */
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
        }

        @media (min-width: 900px) {
            .dashboard-grid {
                grid-template-columns: 1fr 2fr;
            }
        }

        .form-select {
            width: 100%;
            padding: 12px 16px;
            background: rgba(10, 17, 40, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            color: var(--text-light);
            font-size: 16px;
            outline: none;
            cursor: pointer;
        }

        .form-select option {
            background: var(--navy-800);
            color: var(--text-light);
        }

        .form-textarea {
            width: 100%;
            height: 100px;
            padding: 12px 16px;
            background: rgba(10, 17, 40, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            color: var(--text-light);
            font-size: 16px;
            outline: none;
            resize: none;
        }

        /* List Items Styling */
        .items-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .items-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        @media (min-width: 600px) {
            .items-grid {
                grid-template-columns: 1fr 1fr;
            }
        }

        .item-card {
            background: rgba(16, 31, 66, 0.6);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .item-preview {
            width: 100%;
            height: 160px;
            position: relative;
            background: #000;
        }

        .item-preview img, .item-preview video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .item-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: var(--gold-500);
            color: var(--navy-900);
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 100px;
            text-transform: uppercase;
        }

        .item-info {
            padding: 16px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .item-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .item-desc {
            font-size: 13px;
            color: var(--gray-400);
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 16px;
            flex-grow: 1;
        }

        .item-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid rgba(255,255,255,0.08);
            padding-top: 12px;
            margin-top: auto;
        }

        .reorder-btns {
            display: flex;
            gap: 6px;
        }

        .btn-icon {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.05);
            color: var(--text-light);
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .btn-icon:hover {
            background: rgba(255,255,255,0.15);
            color: var(--gold-400);
        }

        .btn-trash {
            background: rgba(219, 86, 101, 0.15);
            border-color: rgba(219, 86, 101, 0.2);
            color: #ff8b97;
        }

        .btn-trash:hover {
            background: var(--red-500);
            color: var(--text-light);
        }

        .upload-helper-text {
            font-size: 12px;
            color: var(--gray-400);
            margin-top: 6px;
        }

        /* Collapsible Form on Mobile */
        .form-section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
    </style>
    <script>
        function toggleVideoField() {
            var type = document.getElementById('type-select').value;
            var videoField = document.getElementById('video-upload-field');
            var imgLabel = document.getElementById('img-upload-label');
            
            if (type === 'video') {
                videoField.style.display = 'block';
                document.getElementById('video_file').required = true;
                imgLabel.innerText = "Unggah Thumbnail Gambar (JPG/PNG)";
            } else {
                videoField.style.display = 'none';
                document.getElementById('video_file').required = false;
                imgLabel.innerText = "Unggah File Gambar (JPG/PNG/WEBP)";
            }
        }
    </script>
</head>
<body>

<div class="glow-bg glow-red"></div>
<div class="glow-bg glow-blue"></div>

<?php if (!$is_logged_in): ?>
    <!-- LOGIN VIEW -->
    <div class="login-wrapper-split">
        <!-- Left Side: Cover Section -->
        <div class="login-cover">
            <div class="login-cover-img" style="background-image: url('/images/batching-plant.jpeg');"></div>
            <div class="login-cover-overlay"></div>
            <div class="cover-top-brand">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                <span>PT. TRANS RINGO GROUPMIX</span>
            </div>
            <div class="login-cover-content">
                <div class="brand-label">Sistem Operasional</div>
                <h1 class="cover-heading"><span class="gradient-text">Portal Administrasi</span><br>Galeri Dokumentasi</h1>
                <p class="cover-subheading">Akses terpusat untuk mengelola, menyusun, dan mempublikasikan seluruh dokumentasi operasional Batching Plant dan kesiapan alat berat secara langsung.</p>
            </div>
        </div>
        <!-- Right Side: Form Section -->
        <div class="login-form-pane">
            <div class="floating-glow-orb orb-1"></div>
            <div class="floating-glow-orb orb-2"></div>
            
            <div class="login-glass-container">
                <div class="login-card-inner">
                    <div class="brand-logo-container">
                        <img src="/images/logo.jpeg" alt="TRGMIX Logo">
                    </div>
                    <h2 class="brand-title">
                        <span class="red">TRG</span><span class="blue">MIX</span> Portal
                    </h2>
                    <p class="brand-subtitle">Masukkan password otentikasi untuk mengelola galeri utama website.</p>

                    <?php if (isset($error)): ?>
                        <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
                    <?php endif; ?>

                    <form action="index.php" method="POST">
                        <input type="hidden" name="login" value="1">
                        <div class="form-group">
                            <label class="form-label" for="password">Password Portal</label>
                            <div class="input-wrapper">
                                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <input class="form-input" type="password" id="password" name="password" placeholder="Masukkan password" required autofocus>
                            </div>
                        </div>
                        <button type="submit" class="btn-primary-glow">Masuk Dashboard ➔</button>
                    </form>
                    <div class="login-footer">
                        &copy; <?php echo date('Y'); ?> PT. Trans Ringo Groupmix.
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php else: ?>
    <!-- DASHBOARD VIEW -->
    <div class="container">
        
        <!-- Header -->
        <div class="header">
            <div class="header-title-section">
                <h1>Dashboard Galeri TRGMIX</h1>
                <p>Kelola konten foto, video, dan urutan slider halaman utama secara live.</p>
            </div>
            <a href="index.php?logout=1" class="btn btn-secondary" style="width: auto;">Logout Portal 🚪</a>
        </div>

        <?php if (!empty($message)): ?>
            <div class="alert alert-<?php echo $message_type; ?>"><?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
            
            <!-- Left Side: Add Form -->
            <div class="glass-card" style="height: fit-content;">
                <h2 class="form-section-title">➕ Tambah Konten Baru</h2>
                <form action="index.php" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="add">
                    
                    <div class="form-group">
                        <label class="form-label" for="title">Judul Kegiatan / Proyek</label>
                        <input class="form-input" type="text" id="title" name="title" placeholder="Contoh: Pengecoran Dak Lantai 2" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="desc">Deskripsi Kegiatan</label>
                        <textarea class="form-textarea" id="desc" name="desc" placeholder="Penjelasan singkat mengenai dokumentasi ini..." required></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="category">Kategori Kegiatan</label>
                        <select class="form-select" id="category" name="category">
                            <option value="produksi">Produksi (Batching Plant)</option>
                            <option value="armada">Armada (Truk Mixer)</option>
                            <option value="proyek">Proyek (Casting/Cor)</option>
                            <option value="kegiatan">Kegiatan Harian</option>
                            <option value="alat berat">Alat Berat</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="type-select">Tipe Media</label>
                        <select class="form-select" id="type-select" name="type" onchange="toggleVideoField()">
                            <option value="image">Gambar / Foto (JPG/PNG/WEBP)</option>
                            <option value="video">Video (MP4)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" id="img-upload-label" for="image_file">Unggah File Gambar (JPG/PNG/WEBP)</label>
                        <input type="file" id="image_file" name="image_file" accept="image/*" required>
                        <div class="upload-helper-text">Rekomendasi rasio gambar lanskap (4:3 atau 16:9).</div>
                    </div>

                    <div class="form-group" id="video-upload-field" style="display: none;">
                        <label class="form-label" for="video_file">Unggah File Video (MP4)</label>
                        <input type="file" id="video_file" name="video_file" accept="video/mp4">
                        <div class="upload-helper-text">Rekomendasi ukuran file video di bawah 20MB untuk loading cepat.</div>
                    </div>

                    <button type="submit" class="btn btn-primary" style="margin-top: 10px;">Simpan & Tayangkan</button>
                </form>
            </div>

            <!-- Right Side: Items List -->
            <div class="glass-card">
                <div class="items-title-row">
                    <h2>📋 Daftar Galeri Saat Ini</h2>
                    <span style="font-size: 14px; color: var(--gray-400); font-weight: 600; background: rgba(255,255,255,0.08); padding: 4px 12px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.05)">
                        Total: <?php echo count($gallery); ?> Item
                    </span>
                </div>

                <?php if (empty($gallery)): ?>
                    <p style="text-align: center; color: var(--gray-400); padding: 40px 0;">Belum ada dokumentasi di galeri. Silakan tambahkan menggunakan form di sebelah kiri.</p>
                <?php else: ?>
                    <div class="items-grid">
                        <?php foreach ($gallery as $index => $item): ?>
                            <div class="item-card">
                                <div class="item-preview">
                                    <span class="item-badge"><?php echo htmlspecialchars($item['category']); ?></span>
                                    <?php if (isset($item['type']) && $item['type'] === 'video'): ?>
                                        <video src="<?php echo htmlspecialchars($item['videoSrc']); ?>" muted playsinline></video>
                                        <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; pointer-events: none;">▶ VIDEO</span>
                                    <?php else: ?>
                                        <img src="<?php echo htmlspecialchars($item['src']); ?>" alt="<?php echo htmlspecialchars($item['title']); ?>">
                                    <?php endif; ?>
                                </div>
                                <div class="item-info">
                                    <h3 class="item-title"><?php echo htmlspecialchars($item['title']); ?></h3>
                                    <p class="item-desc"><?php echo htmlspecialchars($item['desc']); ?></p>
                                    
                                    <div class="item-actions">
                                        <!-- Reorder Controls -->
                                        <div class="reorder-btns">
                                            <form action="index.php" method="POST" style="display:inline;">
                                                <input type="hidden" name="action" value="move">
                                                <input type="hidden" name="direction" value="up">
                                                <input type="hidden" name="id" value="<?php echo $item['id']; ?>">
                                                <button type="submit" class="btn-icon" title="Geser Kiri / Atas" <?php echo ($index === 0) ? 'disabled style="opacity: 0.3; cursor: default;"' : ''; ?>>▲</button>
                                            </form>
                                            <form action="index.php" method="POST" style="display:inline;">
                                                <input type="hidden" name="action" value="move">
                                                <input type="hidden" name="direction" value="down">
                                                <input type="hidden" name="id" value="<?php echo $item['id']; ?>">
                                                <button type="submit" class="btn-icon" title="Geser Kanan / Bawah" <?php echo ($index === count($gallery) - 1) ? 'disabled style="opacity: 0.3; cursor: default;"' : ''; ?>>▼</button>
                                            </form>
                                        </div>

                                        <!-- Delete Control -->
                                        <form action="index.php" method="POST" style="display:inline;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus dokumentasi ini? File di disk server juga akan ikut dihapus permanen.');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $item['id']; ?>">
                                            <button type="submit" class="btn-icon btn-trash" title="Hapus Permanen">🗑️</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

        </div>

    </div>
<?php endif; ?>

</body>
</html>
