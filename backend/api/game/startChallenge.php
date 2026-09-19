<?php
// ruhanix_backend/api/game/startChallenge.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"));

// Check karenge ki user_id aur difficulty level bheja gaya hai ya nahi
if(!empty($data->user_id) && !empty($data->difficulty)) {
    
    // Matches table mein naya game record insert karna
    $query = "INSERT INTO matches (user_id, difficulty, status) VALUES (:user_id, :difficulty, 'Started')";
    $stmt = $conn->prepare($query);
    
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":difficulty", $data->difficulty);
    
    if($stmt->execute()) {
        // Jo match abhi start hua hai, uski ID nikalna (baad mein score save karne ke kaam aayegi)
        $match_id = $conn->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "status" => "success", 
            "message" => "Challenge started successfully.",
            "match_id" => $match_id
        ]);
    } else {
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => "Unable to start challenge."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data. user_id and difficulty are required."]);
}
?>