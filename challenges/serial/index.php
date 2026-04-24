<?php
include 'FileHandler.php';

// Set the cookie if it doesn't exist
if (!isset($_COOKIE['user_session'])) {
    $user = new stdClass();
    $user->username = "guest";
    $user->role = "user";
    setcookie('user_session', base64_encode(serialize($user)), time() + 3600);
}

// Deserialization happens here
if (isset($_COOKIE['user_session'])) {
    $data = base64_decode($_COOKIE['user_session']);
    $user = unserialize($data);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Web Serial CTF</title>
    <style>
        body { font-family: sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { background-color: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        h1 { color: #333; }
        p { color: #666; }
        .source-link { margin-top: 1rem; display: block; color: #007bff; text-decoration: none; }
        .source-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome, <?php echo htmlspecialchars($user->username ?? 'Guest'); ?>!</h1>
        <p>Your role is: <?php echo htmlspecialchars($user->role ?? 'Unknown'); ?></p>
        <p>This is a simple profile page. Explore and find the flag!</p>
        <a href="?source=1" class="source-link">View Source Code</a>
        
        <?php
if (isset($_GET['source'])) {
    echo "<h2>Source Code</h2>";
    echo "<h3>index.php</h3>";
    highlight_file(__FILE__);
    echo "<h3>FileHandler.php</h3>";
    highlight_file('FileHandler.php');
}
?>
    </div>
</body>
</html>
