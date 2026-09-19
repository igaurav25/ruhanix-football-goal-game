<?php
// ruhanix_backend/api/user/getHistory.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../../config/db.php';

// URL se user_id check karna
if(isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    try {
        // Matches aur Results table se data nikalna (Latest match sabse upar aayega)
        $query = "SELECT m.difficulty, m.start_time, r.goals, r.misses, r.accuracy, r.final_score 
                  FROM matches m 
                  JOIN results r ON m.id = r.match_id 
                  WHERE m.user_id = :user_id 
                  ORDER BY m.start_time DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        $history_data = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($history_data, $row);
        }

        http_response_code(200);
        echo json_encode([
            "status" => "success", 
            "total_matches" => $stmt->rowCount(),
            "data" => $history_data
        ]);

    } catch (Exception $e) {
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => "Could not fetch history."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "user_id is required in URL."]);
}
?>