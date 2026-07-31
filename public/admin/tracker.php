<?php
// PT. Trans Ringo Groupmix - Dynamic Visitor Analytics Tracker
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$visitors_file = '../data/visitors.json';

// Ensure data folder exists
if (!is_dir(dirname($visitors_file))) {
    mkdir(dirname($visitors_file), 0755, true);
}

// Load current data
$data = [];
if (file_exists($visitors_file)) {
    $content = file_get_contents($visitors_file);
    $decoded = json_decode($content, true);
    if (is_array($decoded)) {
        $data = $decoded;
    }
}

// Get client details
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip_hash = md5($ip); // Hash IP for privacy compliance
$today = date('Y-m-d');

if (!isset($data['days'])) {
    $data['days'] = [];
}
if (!isset($data['total_views'])) {
    $data['total_views'] = 0;
}
if (!isset($data['total_uniques'])) {
    $data['total_uniques'] = 0;
}
if (!isset($data['ips'])) {
    $data['ips'] = [];
}

// Increment total views
$data['total_views']++;

// Check if day exists
if (!isset($data['days'][$today])) {
    $data['days'][$today] = [
        'views' => 0,
        'uniques' => 0,
        'unique_ips' => []
    ];
}

$data['days'][$today]['views']++;

// Check unique visitor for today
if (!in_array($ip_hash, $data['days'][$today]['unique_ips'])) {
    $data['days'][$today]['unique_ips'][] = $ip_hash;
    $data['days'][$today]['uniques']++;
    
    // Check global unique
    if (!in_array($ip_hash, $data['ips'])) {
        $data['ips'][] = $ip_hash;
        $data['total_uniques']++;
    }
}

// Clean up old unique IPs list from days to save space (keep only count)
foreach ($data['days'] as $day => $stats) {
    if ($day !== $today && isset($stats['unique_ips'])) {
        unset($data['days'][$day]['unique_ips']);
    }
}

// Keep only the last 30 days of data in detailed log to avoid file bloat
if (count($data['days']) > 30) {
    krsort($data['days']);
    $data['days'] = array_slice($data['days'], 0, 30, true);
    ksort($data['days']);
}

// Save back to file
file_put_contents($visitors_file, json_encode($data, JSON_PRETTY_PRINT));
@chmod($visitors_file, 0644);

echo json_encode(['status' => 'success']);
