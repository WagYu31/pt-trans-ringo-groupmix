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

    // Load Visitor Analytics
    $visitors_file = '../data/visitors.json';
    $analytics = [
        'total_views' => 0,
        'total_uniques' => 0,
        'today_views' => 0,
        'today_uniques' => 0,
        'yesterday_uniques' => 0,
        'chart_data' => []
    ];

    // Pre-populate the last 30 days with default zero values
    for ($i = 29; $i >= 0; $i--) {
        $day_str = date('Y-m-d', strtotime("-$i days"));
        $label = date('d M', strtotime($day_str));
        $analytics['chart_data'][$day_str] = [
            'date' => $day_str,
            'label' => $label,
            'views' => 0,
            'uniques' => 0
        ];
    }

    if (file_exists($visitors_file)) {
        $v_content = file_get_contents($visitors_file);
        $v_decoded = json_decode($v_content, true);
        if (is_array($v_decoded)) {
            $analytics['total_views'] = $v_decoded['total_views'] ?? 0;
            $analytics['total_uniques'] = $v_decoded['total_uniques'] ?? 0;
            
            $today_str = date('Y-m-d');
            $yesterday_str = date('Y-m-d', strtotime('-1 day'));
            
            if (isset($v_decoded['days'][$today_str])) {
                $analytics['today_views'] = $v_decoded['days'][$today_str]['views'] ?? 0;
                $analytics['today_uniques'] = $v_decoded['days'][$today_str]['uniques'] ?? 0;
            }
            if (isset($v_decoded['days'][$yesterday_str])) {
                $analytics['yesterday_uniques'] = $v_decoded['days'][$yesterday_str]['uniques'] ?? 0;
            }
            
            // Overwrite views/uniques from actual data
            foreach ($analytics['chart_data'] as $day_key => $chart_item) {
                if (isset($v_decoded['days'][$day_key])) {
                    $analytics['chart_data'][$day_key]['views'] = $v_decoded['days'][$day_key]['views'] ?? 0;
                    $analytics['chart_data'][$day_key]['uniques'] = $v_decoded['days'][$day_key]['uniques'] ?? 0;
                }
            }
        }
    }

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
            padding: 14px 46px 14px 46px; /* 46px left (icon), 46px right (eye toggle) */
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

        .password-toggle-btn {
            position: absolute;
            right: 16px;
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            z-index: 6;
        }

        .password-toggle-btn:hover {
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
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #ffffff;
        }
        
        .header-title-section h1 span.gradient-text {
            background: linear-gradient(135deg, var(--red-500) 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .header-title-section p {
            color: var(--gray-400);
            font-size: 14px;
            margin-top: 6px;
        }

        /* Dashboard Grid Layout */
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
        }

        @media (min-width: 992px) {
            .dashboard-grid {
                grid-template-columns: 380px 1fr;
            }
        }

        .form-select {
            width: 100%;
            padding: 12px 16px;
            background: rgba(3, 7, 18, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #ffffff;
            font-size: 15px;
            outline: none;
            cursor: pointer;
            transition: all 0.3s ease;
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 16px;
            padding-right: 40px;
        }

        .form-select option {
            background: #111827;
            color: #ffffff;
        }

        .form-textarea {
            width: 100%;
            height: 100px;
            padding: 12px 16px;
            background: rgba(3, 7, 18, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #ffffff;
            font-size: 15px;
            outline: none;
            resize: none;
            transition: all 0.3s ease;
        }

        .form-select:focus, .form-textarea:focus {
            border-color: var(--gold-500);
            background: rgba(3, 7, 18, 0.8);
            box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.12), inset 0 2px 4px rgba(0,0,0,0.2);
        }

        /* Beautiful Custom Upload Zone */
        .file-upload-wrapper {
            position: relative;
            width: 100%;
        }

        .file-upload-input {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            z-index: 2;
        }

        .file-upload-label-zone {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
            background: rgba(3, 7, 18, 0.4);
            border: 2px dashed rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .file-upload-label-zone svg {
            color: #6b7280;
            margin-bottom: 8px;
            transition: color 0.3s;
        }

        .file-upload-wrapper:hover .file-upload-label-zone {
            border-color: var(--gold-500);
            background: rgba(212, 163, 115, 0.05);
        }

        .file-upload-wrapper:hover .file-upload-label-zone svg {
            color: var(--gold-500);
        }

        .upload-zone-text {
            font-size: 14px;
            color: #d1d5db;
            margin-bottom: 4px;
            transition: color 0.3s;
        }

        .upload-zone-sub {
            font-size: 11px;
            color: #6b7280;
        }

        /* List Items Styling */
        .items-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 28px;
        }

        .items-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
        }

        @media (min-width: 600px) {
            .items-grid {
                grid-template-columns: 1fr 1fr;
            }
        }

        @media (min-width: 1400px) {
            .items-grid {
                grid-template-columns: 1fr 1fr 1fr;
            }
        }

        .item-card {
            background: rgba(17, 24, 39, 0.55);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .item-card:hover {
            transform: translateY(-4px);
            border-color: rgba(212, 163, 115, 0.25);
            box-shadow: 0 15px 35px rgba(212, 163, 115, 0.08), 0 20px 40px rgba(0, 0, 0, 0.35);
        }

        .item-preview {
            width: 100%;
            height: 170px;
            position: relative;
            background: #000;
            overflow: hidden;
        }

        .item-preview img, .item-preview video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .item-card:hover .item-preview img, .item-card:hover .item-preview video {
            transform: scale(1.05);
        }

        .item-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            font-size: 10px;
            font-weight: 800;
            padding: 5px 12px;
            border-radius: 100px;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 3;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            background: rgba(31, 41, 55, 0.7); /* Default */
        }
        
        /* Category-specific styling */
        .item-badge.badge-produksi {
            background: rgba(44, 147, 92, 0.75);
            border-color: rgba(44, 147, 92, 0.4);
        }
        .item-badge.badge-armada {
            background: rgba(32, 109, 181, 0.75);
            border-color: rgba(32, 109, 181, 0.4);
        }
        .item-badge.badge-proyek {
            background: rgba(212, 163, 115, 0.75);
            border-color: rgba(212, 163, 115, 0.4);
        }
        .item-badge.badge-kegiatan {
            background: rgba(124, 58, 237, 0.75);
            border-color: rgba(124, 58, 237, 0.4);
        }
        .item-badge.badge-alat_berat {
            background: rgba(219, 86, 101, 0.75);
            border-color: rgba(219, 86, 101, 0.4);
        }

        .item-info {
            padding: 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .item-title {
            font-size: 17px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .item-desc {
            font-size: 13px;
            color: var(--gray-400);
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 20px;
            flex-grow: 1;
        }

        .item-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid rgba(255,255,255,0.06);
            padding-top: 14px;
            margin-top: auto;
        }

        .reorder-btns {
            display: flex;
            gap: 8px;
        }

        .btn-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.06);
            color: #9ca3af;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-icon:hover {
            background: rgba(212, 163, 115, 0.15);
            border-color: rgba(212, 163, 115, 0.25);
            color: var(--gold-400);
            transform: translateY(-1px);
        }

        .btn-icon:active {
            transform: translateY(0);
        }

        .btn-trash {
            background: rgba(219, 86, 101, 0.12);
            border-color: rgba(219, 86, 101, 0.15);
            color: #ff8b97;
        }

        .btn-trash:hover {
            background: var(--red-500);
            border-color: var(--red-500);
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(219, 86, 101, 0.3);
        }

        .upload-helper-text {
            font-size: 11px;
            color: var(--gray-400);
            margin-top: 6px;
            line-height: 1.4;
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
        /* Period Selector CSS */
        .period-selector-group {
            display: inline-flex;
            background: rgba(3, 7, 18, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            padding: 4px;
        }

        .period-pill {
            background: none;
            border: none;
            color: #9ca3af;
            font-size: 13px;
            font-weight: 600;
            padding: 6px 16px;
            border-radius: 7px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
        }

        .period-pill:hover {
            color: #ffffff;
        }

        .period-pill.active {
            background: rgba(255, 255, 255, 0.06);
            color: var(--gold-400);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Stat Columns CSS */
        .analytics-stats-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        @media (min-width: 768px) {
            .analytics-stats-row {
                grid-template-columns: repeat(4, 1fr);
            }
        }

        .stat-col {
            display: flex;
            flex-direction: column;
            text-align: left;
            padding: 10px 0;
            position: relative;
            transition: all 0.3s ease;
        }

        .stat-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 26px;
            font-weight: 800;
            color: #6b7280;
            transition: color 0.3s;
        }

        .stat-col.active .stat-value {
            color: #ffffff;
        }

        .stat-col.active::after {
            content: '';
            position: absolute;
            bottom: -26px; /* Align to the border-bottom */
            left: 0;
            width: 100%;
            height: 3px;
            background-color: var(--gold-500);
            box-shadow: 0 0 10px rgba(212, 163, 115, 0.4);
            border-radius: 10px;
        }
        
        /* Chart circle style */
        .chart-dot {
            fill: #030712;
            stroke: var(--gold-400);
            stroke-width: 2px;
            cursor: pointer;
            transition: r 0.2s, stroke-width 0.2s, fill 0.2s;
        }
        .chart-dot:hover {
            r: 6.5px !important;
            stroke-width: 3px !important;
            fill: var(--gold-400);
        }
    </style>
    <script>
        function togglePasswordVisibility() {
            var passwordInput = document.getElementById('password');
            var eyeOpen = document.getElementById('eye-open');
            var eyeClosed = document.getElementById('eye-closed');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                passwordInput.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        }

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

        // Injected PHP Data (only when logged in)
        <?php if ($is_logged_in): ?>
        const rawAnalyticsData = <?php echo json_encode(array_values($analytics['chart_data'])); ?>;
        const totalViewsAllTime = <?php echo $analytics['total_views']; ?>;
        const totalUniquesAllTime = <?php echo $analytics['total_uniques']; ?>;
        <?php else: ?>
        const rawAnalyticsData = [];
        const totalViewsAllTime = 0;
        const totalUniquesAllTime = 0;
        <?php endif; ?>

        let currentPeriod = '30days';

        document.addEventListener('DOMContentLoaded', () => {
            if (!document.getElementById('analytics-svg')) return; // Ensure we are logged in and elements exist
            
            // Set updated time
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            const updatedTextEl = document.getElementById('analytics-updated-text');
            if (updatedTextEl) {
                updatedTextEl.innerText = `Landing page traffic • Terakhir diperbarui ${timeStr}`;
            }
            
            calculateStats();
            renderChart();
        });

        function calculateStats() {
            // All Time
            const valAlltimeEl = document.getElementById('val-alltime');
            if (valAlltimeEl) valAlltimeEl.innerText = totalUniquesAllTime.toLocaleString();

            // 30 Days
            const sum30 = rawAnalyticsData.reduce((acc, curr) => acc + curr.uniques, 0);
            const val30daysEl = document.getElementById('val-30days');
            if (val30daysEl) val30daysEl.innerText = sum30.toLocaleString();

            // 7 Days
            const last7 = rawAnalyticsData.slice(23, 30);
            const sum7 = last7.reduce((acc, curr) => acc + curr.uniques, 0);
            const val7daysEl = document.getElementById('val-7days');
            if (val7daysEl) val7daysEl.innerText = sum7.toLocaleString();

            // Today
            const todayData = rawAnalyticsData[29];
            const sumToday = todayData ? todayData.uniques : 0;
            const valTodayEl = document.getElementById('val-today');
            if (valTodayEl) valTodayEl.innerText = sumToday.toLocaleString();
        }

        function switchPeriod(period) {
            currentPeriod = period;
            
            // Toggle pills active class
            document.querySelectorAll('.period-pill').forEach(btn => btn.classList.remove('active'));
            // Toggle stat cols active class
            document.querySelectorAll('.stat-col').forEach(col => col.classList.remove('active'));

            if (period === 'today') {
                const todayPill = document.querySelector('.period-pill[onclick*="today"]');
                if (todayPill) todayPill.classList.add('active');
                const todayCol = document.getElementById('stat-col-today');
                if (todayCol) todayCol.classList.add('active');
            } else if (period === '7days') {
                const last7Pill = document.querySelector('.period-pill[onclick*="7days"]');
                if (last7Pill) last7Pill.classList.add('active');
                const last7Col = document.getElementById('stat-col-7days');
                if (last7Col) last7Col.classList.add('active');
            } else {
                const last30Pill = document.querySelector('.period-pill[onclick*="30days"]');
                if (last30Pill) last30Pill.classList.add('active');
                const last30Col = document.getElementById('stat-col-30days');
                if (last30Col) last30Col.classList.add('active');
            }

            renderChart();
        }

        function renderChart() {
            let dataPoints = [];
            
            if (currentPeriod === 'today') {
                const todayStats = rawAnalyticsData[29] || { views: 0, uniques: 0 };
                dataPoints = getTodayDistribution(todayStats.views, todayStats.uniques);
            } else if (currentPeriod === '7days') {
                dataPoints = rawAnalyticsData.slice(23, 30).map(item => ({
                    label: item.label,
                    views: item.views,
                    uniques: item.uniques
                }));
            } else {
                dataPoints = rawAnalyticsData.map(item => ({
                    label: item.label,
                    views: item.views,
                    uniques: item.uniques
                }));
            }

            const svg = document.getElementById('analytics-svg');
            if (!svg) return;
            
            const gridGroup = document.getElementById('grid-lines');
            const pathLine = document.getElementById('chart-line');
            const pathArea = document.getElementById('chart-area');
            const pointsGroup = document.getElementById('chart-points');

            // Clear previous points and grid lines
            if (gridGroup) gridGroup.innerHTML = '';
            if (pointsGroup) pointsGroup.innerHTML = '';

            const width = 760;
            const height = 180; // Baseline
            const topMargin = 20;

            // Find max views in selected range to scale Y axis
            let maxVal = Math.max(...dataPoints.map(p => p.views), 1);
            
            // Round maxVal up to multiple of 5 or 10 for clean grid labels
            if (maxVal > 10) {
                maxVal = Math.ceil(maxVal / 10) * 10;
            } else if (maxVal > 1) {
                maxVal = Math.ceil(maxVal / 2) * 2;
            }

            // Update Y-Axis labels
            const y100 = document.getElementById('y-val-100');
            const y75 = document.getElementById('y-val-75');
            const y50 = document.getElementById('y-val-50');
            const y25 = document.getElementById('y-val-25');
            
            if (y100) y100.innerText = maxVal.toLocaleString();
            if (y75) y75.innerText = Math.round(maxVal * 0.75).toLocaleString();
            if (y50) y50.innerText = Math.round(maxVal * 0.5).toLocaleString();
            if (y25) y25.innerText = Math.round(maxVal * 0.25).toLocaleString();

            // Render horizontal grid lines
            const gridSteps = [20, 60, 100, 140, 180];
            gridSteps.forEach(yVal => {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', '0');
                line.setAttribute('y1', yVal.toString());
                line.setAttribute('x2', width.toString());
                line.setAttribute('y2', yVal.toString());
                line.setAttribute('stroke', 'rgba(255,255,255,0.05)');
                line.setAttribute('stroke-width', '1');
                if (gridGroup) gridGroup.appendChild(line);
            });

            // Generate coordinates
            const pointsCount = dataPoints.length;
            const stepX = width / (pointsCount - 1);
            
            let coords = [];
            dataPoints.forEach((p, idx) => {
                const x = idx * stepX;
                const scaleY = (maxVal > 0) ? (p.views / maxVal) : 0;
                const y = height - (scaleY * (height - topMargin));
                coords.push({ x, y, data: p });
            });

            // Build line & area path strings
            let linePathStr = '';
            let areaPathStr = '';

            if (coords.length > 0) {
                linePathStr = `M ${coords[0].x} ${coords[0].y}`;
                areaPathStr = `M ${coords[0].x} ${height} L ${coords[0].x} ${coords[0].y}`;

                for (let i = 1; i < coords.length; i++) {
                    linePathStr += ` L ${coords[i].x} ${coords[i].y}`;
                    areaPathStr += ` L ${coords[i].x} ${coords[i].y}`;
                }

                areaPathStr += ` L ${coords[coords.length - 1].x} ${height} Z`;
            }

            if (pathLine) pathLine.setAttribute('d', linePathStr);
            if (pathArea) pathArea.setAttribute('d', areaPathStr);

            // Render interactive points (only render dots if 7 days or today to avoid clutter)
            const shouldRenderDots = (currentPeriod === '7days' || currentPeriod === 'today');
            coords.forEach((coord, idx) => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', coord.x.toString());
                circle.setAttribute('cy', coord.y.toString());
                circle.setAttribute('r', shouldRenderDots ? '4' : '3');
                circle.setAttribute('class', 'chart-dot');
                if (!shouldRenderDots) {
                    circle.style.opacity = '0'; // Hidden but still hoverable
                    circle.setAttribute('r', '8'); // Large hover target
                }
                
                // Mouse event listeners for tooltip
                circle.addEventListener('mouseenter', (e) => {
                    showTooltip(e, coord.x, coord.y, coord.data);
                });
                circle.addEventListener('mouseleave', () => {
                    hideTooltip();
                });
                
                if (pointsGroup) pointsGroup.appendChild(circle);
            });
        }

        function getTodayDistribution(views, uniques) {
            const hours = ['04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
            const distribution = [0.05, 0.15, 0.35, 0.25, 0.15, 0.05];
            
            return hours.map((hour, idx) => {
                return {
                    label: hour,
                    views: Math.round(views * distribution[idx]),
                    uniques: Math.round(uniques * distribution[idx])
                };
            });
        }

        function showTooltip(e, x, y, data) {
            const tooltip = document.getElementById('chart-tooltip-box');
            const guideLine = document.getElementById('guide-line');
            
            if (!tooltip) return;
            
            document.getElementById('tooltip-date').innerText = data.label;
            document.getElementById('tooltip-views').innerText = `● ${data.views.toLocaleString()} Tayangan`;
            document.getElementById('tooltip-uniques').innerText = `● ${data.uniques.toLocaleString()} Pengunjung`;
            
            // Set tooltip position
            tooltip.style.left = `${x + 40}px`; // Offset left labels
            tooltip.style.top = `${y}px`;
            tooltip.style.display = 'block';

            // Show and position guide line
            if (guideLine) {
                guideLine.setAttribute('x1', x.toString());
                guideLine.setAttribute('x2', x.toString());
                guideLine.style.display = 'block';
            }
        }

        function hideTooltip() {
            const tooltip = document.getElementById('chart-tooltip-box');
            const guideLine = document.getElementById('guide-line');
            if (tooltip) tooltip.style.display = 'none';
            if (guideLine) guideLine.style.display = 'none';
        }

        function updateFileName(input, targetId) {
            var fileNameSpan = document.getElementById(targetId);
            if (input.files && input.files[0]) {
                fileNameSpan.innerText = input.files[0].name;
                fileNameSpan.style.color = '#ffffff';
                fileNameSpan.style.fontWeight = 'bold';
            } else {
                if (targetId === 'image-file-name') {
                    fileNameSpan.innerText = "Pilih File Gambar";
                } else {
                    fileNameSpan.innerText = "Pilih File Video";
                }
                fileNameSpan.style.color = '#9ca3af';
                fileNameSpan.style.fontWeight = 'normal';
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
                                <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility()">
                                    <!-- Eye icon (Open) -->
                                    <svg id="eye-open" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <!-- Eye icon (Closed) -->
                                    <svg id="eye-closed" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                </button>
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
                <h1>Dashboard Galeri <span class="gradient-text">TRGMIX</span></h1>
                <p>Kelola konten foto, video, dan urutan slider halaman utama secara live.</p>
            </div>
            <a href="index.php?logout=1" class="btn btn-secondary" style="width: auto; display: inline-flex; align-items: center; gap: 8px;">
                <span>Logout Portal</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            </a>
        </div>

        <?php if (!empty($message)): ?>
            <div class="alert alert-<?php echo $message_type; ?>"><?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>

        <!-- Analytics Panel -->
        <div class="glass-card" style="margin-bottom: 40px; padding: 35px; position: relative; overflow: visible;">
            <!-- Top Header & Tabs -->
            <div class="analytics-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                        Website Visitors
                        <span style="font-size: 10px; background: rgba(44, 147, 92, 0.12); border: 1px solid rgba(44, 147, 92, 0.25); color: #8be1b0; padding: 4px 10px; border-radius: 100px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 4px; margin-left: 8px; vertical-align: middle;">
                            <span style="width: 5px; height: 5px; background-color: #2c935c; border-radius: 50%; display: inline-block;"></span> LIVE
                        </span>
                    </h2>
                    <p style="color: var(--gray-400); font-size: 13px; margin: 6px 0 0 0;" id="analytics-updated-text">Landing page traffic</p>
                </div>
                
                <!-- Period Selector Pills -->
                <div class="period-selector-group">
                    <button type="button" class="period-pill" onclick="switchPeriod('today')">Today</button>
                    <button type="button" class="period-pill" onclick="switchPeriod('7days')">7 days</button>
                    <button type="button" class="period-pill active" onclick="switchPeriod('30days')">30 days</button>
                </div>
            </div>

            <!-- Stat Columns -->
            <div class="analytics-stats-row" style="margin-bottom: 35px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 25px;">
                <div class="stat-col" id="stat-col-today" onclick="switchPeriod('today')" style="cursor: pointer;">
                    <span class="stat-label">Today</span>
                    <div class="stat-value" id="val-today">0</div>
                </div>
                <div class="stat-col" id="stat-col-7days" onclick="switchPeriod('7days')" style="cursor: pointer;">
                    <span class="stat-label">Last 7 days</span>
                    <div class="stat-value" id="val-7days">0</div>
                </div>
                <div class="stat-col active" id="stat-col-30days" onclick="switchPeriod('30days')" style="cursor: pointer;">
                    <span class="stat-label">Last 30 days</span>
                    <div class="stat-value" id="val-30days">0</div>
                </div>
                <div class="stat-col">
                    <span class="stat-label">All time</span>
                    <div class="stat-value" id="val-alltime">0</div>
                </div>
            </div>

            <!-- SVG Chart Container -->
            <div class="chart-canvas-wrapper" style="position: relative; width: 100%; height: 240px; margin-top: 15px;">
                <!-- Y-Axis Labels -->
                <div class="y-axis-labels" style="position: absolute; left: 0; top: 0; bottom: 30px; width: 40px; display: flex; flex-direction: column; justify-content: space-between; font-size: 11px; color: #6b7280; text-align: right; padding-right: 10px; font-weight: 500;">
                    <span id="y-val-100">80</span>
                    <span id="y-val-75">60</span>
                    <span id="y-val-50">40</span>
                    <span id="y-val-25">20</span>
                    <span>0</span>
                </div>
                
                <!-- SVG Element -->
                <div style="margin-left: 45px; height: 100%; position: relative;">
                    <svg id="analytics-svg" viewBox="0 0 760 180" width="100%" height="150" style="overflow: visible;">
                        <defs>
                            <!-- Area Gradient -->
                            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="var(--gold-400)" stop-opacity="0.18" />
                                <stop offset="100%" stop-color="var(--gold-400)" stop-opacity="0.00" />
                            </linearGradient>
                            <!-- Line Gradient -->
                            <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stop-color="#d4a373" />
                                <stop offset="50%" stop-color="#e9c46a" />
                                <stop offset="100%" stop-color="#f4a261" />
                            </linearGradient>
                        </defs>
                        
                        <!-- Grid Lines -->
                        <g id="grid-lines"></g>
                        
                        <!-- Shaded Area Path -->
                        <path id="chart-area" d="" fill="url(#area-grad)"></path>
                        
                        <!-- Stroke Path -->
                        <path id="chart-line" d="" fill="none" stroke="url(#line-grad)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"></path>
                        
                        <!-- Interaction points (invisible/hoverable circles) -->
                        <g id="chart-points"></g>
                        
                        <!-- Interactive Vertical Guide Line -->
                        <line id="guide-line" x1="0" y1="20" x2="0" y2="180" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" stroke-dasharray="4 4" style="display: none;"></line>
                    </svg>
                    
                    <!-- Dynamic Tooltip -->
                    <div id="chart-tooltip-box" style="position: absolute; display: none; background: #111827; border: 1px solid rgba(255,255,255,0.12); color: #ffffff; padding: 10px 14px; border-radius: 8px; font-size: 11px; z-index: 20; box-shadow: 0 10px 25px rgba(0,0,0,0.5); pointer-events: none; transform: translate(-50%, -100%); margin-top: -10px; transition: left 0.1s ease, top 0.1s ease;">
                        <div id="tooltip-date" style="font-weight: 700; color: var(--gold-400); margin-bottom: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Date</div>
                        <div id="tooltip-views" style="display: flex; align-items: center; gap: 4px; font-weight: 500;">0 Views</div>
                        <div id="tooltip-uniques" style="display: flex; align-items: center; gap: 4px; font-weight: 500; margin-top: 2px;">0 Users</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
            
            <!-- Left Side: Add Form -->
            <div class="glass-card" style="height: fit-content;">
                <h2 class="form-section-title" style="margin-bottom: 24px; font-weight: 800; font-size: 20px; color: #ffffff;">➕ Tambah Konten</h2>
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
                        <div class="file-upload-wrapper">
                            <label for="image_file" class="file-upload-label-zone">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <span class="upload-zone-text" id="image-file-name">Pilih File Gambar</span>
                                <span class="upload-zone-sub">PNG, JPG atau WEBP (Maks. 10MB)</span>
                            </label>
                            <input type="file" id="image_file" name="image_file" accept="image/*" class="file-upload-input" onchange="updateFileName(this, 'image-file-name')" required>
                        </div>
                    </div>

                    <div class="form-group" id="video-upload-field" style="display: none;">
                        <label class="form-label" for="video_file">Unggah File Video (MP4)</label>
                        <div class="file-upload-wrapper">
                            <label for="video_file" class="file-upload-label-zone">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                                    <line x1="7" y1="2" x2="7" y2="22"></line>
                                    <line x1="17" y1="2" x2="17" y2="22"></line>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <line x1="2" y1="7" x2="7" y2="7"></line>
                                    <line x1="2" y1="17" x2="7" y2="17"></line>
                                    <line x1="17" y1="17" x2="22" y2="17"></line>
                                    <line x1="17" y1="7" x2="22" y2="7"></line>
                                </svg>
                                <span class="upload-zone-text" id="video-file-name">Pilih File Video</span>
                                <span class="upload-zone-sub">Format MP4 (Maks. 20MB)</span>
                            </label>
                            <input type="file" id="video_file" name="video_file" accept="video/mp4" class="file-upload-input" onchange="updateFileName(this, 'video-file-name')">
                        </div>
                    </div>

                    <button type="submit" class="btn-primary-glow" style="margin-top: 10px;">Simpan & Tayangkan ➔</button>
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
                                    <span class="item-badge badge-<?php echo str_replace(' ', '_', strtolower($item['category'])); ?>">
                                        <?php echo htmlspecialchars($item['category']); ?>
                                    </span>
                                    <?php if (isset($item['type']) && $item['type'] === 'video'): ?>
                                        <video src="<?php echo htmlspecialchars($item['videoSrc']); ?>" muted playsinline></video>
                                        <span style="position: absolute; bottom: 12px; right: 12px; background: rgba(3, 7, 18, 0.75); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; pointer-events: none; display: flex; align-items: center; gap: 4px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                            </svg>
                                            VIDEO
                                        </span>
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
                                                <button type="submit" class="btn-icon" title="Geser ke Atas" <?php echo ($index === 0) ? 'disabled style="opacity: 0.25; cursor: default; pointer-events: none;"' : ''; ?>>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                        <polyline points="18 15 12 9 6 15"></polyline>
                                                    </svg>
                                                </button>
                                            </form>
                                            <form action="index.php" method="POST" style="display:inline;">
                                                <input type="hidden" name="action" value="move">
                                                <input type="hidden" name="direction" value="down">
                                                <input type="hidden" name="id" value="<?php echo $item['id']; ?>">
                                                <button type="submit" class="btn-icon" title="Geser ke Bawah" <?php echo ($index === count($gallery) - 1) ? 'disabled style="opacity: 0.25; cursor: default; pointer-events: none;"' : ''; ?>>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                        <polyline points="6 9 12 15 18 9"></polyline>
                                                    </svg>
                                                </button>
                                            </form>
                                        </div>

                                        <!-- Delete Control -->
                                        <form action="index.php" method="POST" style="display:inline;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus dokumentasi ini? File di disk server juga akan ikut dihapus permanen.');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $item['id']; ?>">
                                            <button type="submit" class="btn-icon btn-trash" title="Hapus Permanen">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
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
