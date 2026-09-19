<?php
// ruhanix_backend/config/db.php

$host = "localhost";
$db_name = "ruhanix_football_db";
$username = "root"; // XAMPP ka default username
$password = "";     // XAMPP ka default password blank hota hai

try {
    // Database se connect karne ka code (PDO use kar rahe hain security ke liye)
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    
    // Error aane par hume properly dikhaye
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch(PDOException $exception) {
    // Agar connection fail ho jaye toh error bataye
    echo "Connection error: " . $exception->getMessage();
}
?>