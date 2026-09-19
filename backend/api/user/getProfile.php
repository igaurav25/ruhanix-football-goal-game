<?php
// ruhanix_backend/api/user/getProfile.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../../config/db.php';

if(isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    try {
        // Naye columns add kiye (avatar, jersey_color, country, state, current_level, xp)
        $query = "SELECT u.id, u.name, u.email, u.avatar, u.jersey_color, u.country, u.state, u.current_level, u.xp, 
                         IFNULL(l.highest_score, 0) as highest_score, 
                         IFNULL(l.best_accuracy, 0) as best_accuracy 
                  FROM users u 
                  LEFT JOIN leaderboard l ON u.id = l.user_id 
                  WHERE u.id = :user_id";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $user_data = $stmt->fetch(PDO::FETCH_ASSOC);

            // Total matches count
            $match_query = "SELECT COUNT(id) as total_matches FROM matches WHERE user_id = :user_id";
            $match_stmt = $conn->prepare($match_query);
            $match_stmt->bindParam(":user_id", $user_id);
            $match_stmt->execute();
            $match_data = $match_stmt->fetch(PDO::FETCH_ASSOC);

            $user_data['total_matches'] = $match_data['total_matches'];

            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $user_data]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User not found."]);
        }
    } catch (Exception $e) {
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => "Could not fetch profile."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "user_id is required in URL."]);
}
?>