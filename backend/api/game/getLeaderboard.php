<?php
// ruhanix_backend/api/game/getLeaderboard.php

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

// Database connection
include_once '../../config/db.php';

try {
    // Leaderboard se top 10 players nikalne ki query
    $query = "SELECT u.name, u.profile_pic, l.highest_score, l.best_accuracy 
              FROM leaderboard l 
              JOIN users u ON l.user_id = u.id 
              ORDER BY l.highest_score DESC 
              LIMIT 10";
              
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    // Data ko array mein store karna
    $leaderboard_data = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($leaderboard_data, $row);
    }
    
    // Response bhejna
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data" => $leaderboard_data
    ]);

} catch (Exception $e) {
    http_response_code(503);
    echo json_encode(["status" => "error", "message" => "Could not fetch leaderboard."]);
}
?>