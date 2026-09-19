<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$db_name = "ruhanixfootball_game"; 
$username = "root";
$password = ""; 

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Fetch all users
    $users_stmt = $conn->prepare("SELECT id, name, email, current_level, xp, created_at FROM users");
    $users_stmt->execute();
    $users = $users_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Fetch match reports (history)
    $reports_stmt = $conn->prepare("SELECT * FROM match_history ORDER BY id DESC");
    $reports_stmt->execute();
    $reports = $reports_stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success", 
        "users" => $users,
        "reports" => $reports
    ]);

} catch(PDOException $exception) {
    echo json_encode(["status" => "error", "message" => $exception->getMessage()]);
}
?>