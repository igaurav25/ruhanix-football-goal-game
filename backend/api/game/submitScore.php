<?php
// ruhanix_backend/api/game/submitScore.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->match_id) && !empty($data->user_id) && isset($data->goals) && isset($data->misses) && isset($data->time_taken)) {
    
    $total_shots = $data->goals + $data->misses;
    $accuracy = ($total_shots > 0) ? ($data->goals / $total_shots) * 100 : 0;
    
    $final_score = ($data->goals * 10) - ($data->misses * 2);
    if($final_score < 0) $final_score = 0;

    // XP calculation: Har score par utni hi XP milegi
    $xp_gained = $final_score; 

    try {
        $conn->beginTransaction();

        // 1. Update Match
        $update_match = "UPDATE matches SET status = 'Completed' WHERE id = :match_id";
        $stmt_match = $conn->prepare($update_match);
        $stmt_match->bindParam(":match_id", $data->match_id);
        $stmt_match->execute();

        // 2. Save Result
        $insert_result = "INSERT INTO results (match_id, user_id, goals, misses, accuracy, final_score, time_taken) 
                          VALUES (:match_id, :user_id, :goals, :misses, :accuracy, :final_score, :time_taken)";
        $stmt_result = $conn->prepare($insert_result);
        $stmt_result->bindParam(":match_id", $data->match_id);
        $stmt_result->bindParam(":user_id", $data->user_id);
        $stmt_result->bindParam(":goals", $data->goals);
        $stmt_result->bindParam(":misses", $data->misses);
        $stmt_result->bindParam(":accuracy", $accuracy);
        $stmt_result->bindParam(":final_score", $final_score);
        $stmt_result->bindParam(":time_taken", $data->time_taken);
        $stmt_result->execute();

        // 3. Update User XP and Level (Infinite Level Logic)
        $xp_query = "SELECT xp FROM users WHERE id = :user_id";
        $stmt_xp = $conn->prepare($xp_query);
        $stmt_xp->bindParam(":user_id", $data->user_id);
        $stmt_xp->execute();
        $user_row = $stmt_xp->fetch(PDO::FETCH_ASSOC);
        
        $new_xp = $user_row['xp'] + $xp_gained;
        // Har 100 XP par Level up (Floor division + 1)
        $new_level = floor($new_xp / 100) + 1; 

        $update_user = "UPDATE users SET xp = :new_xp, current_level = :new_level WHERE id = :user_id";
        $stmt_user_upd = $conn->prepare($update_user);
        $stmt_user_upd->bindParam(":new_xp", $new_xp);
        $stmt_user_upd->bindParam(":new_level", $new_level);
        $stmt_user_upd->bindParam(":user_id", $data->user_id);
        $stmt_user_upd->execute();

        // 4. Update Leaderboard
        $check_leaderboard = "SELECT highest_score FROM leaderboard WHERE user_id = :user_id";
        $stmt_check = $conn->prepare($check_leaderboard);
        $stmt_check->bindParam(":user_id", $data->user_id);
        $stmt_check->execute();

        if($stmt_check->rowCount() > 0) {
            $row = $stmt_check->fetch(PDO::FETCH_ASSOC);
            if($final_score > $row['highest_score']) {
                $update_leaderboard = "UPDATE leaderboard SET highest_score = :final_score, best_accuracy = :accuracy WHERE user_id = :user_id";
                $stmt_upd = $conn->prepare($update_leaderboard);
                $stmt_upd->bindParam(":final_score", $final_score);
                $stmt_upd->bindParam(":accuracy", $accuracy);
                $stmt_upd->bindParam(":user_id", $data->user_id);
                $stmt_upd->execute();
            }
        } else {
            $insert_leaderboard = "INSERT INTO leaderboard (user_id, highest_score, best_accuracy) VALUES (:user_id, :final_score, :accuracy)";
            $stmt_ins = $conn->prepare($insert_leaderboard);
            $stmt_ins->bindParam(":user_id", $data->user_id);
            $stmt_ins->bindParam(":final_score", $final_score);
            $stmt_ins->bindParam(":accuracy", $accuracy);
            $stmt_ins->execute();
        }

        $conn->commit();

        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Score submitted successfully.",
            "stats" => [
                "accuracy" => round($accuracy, 2) . "%",
                "final_score" => $final_score,
                "xp_gained" => $xp_gained,
                "current_level" => $new_level
            ]
        ]);

    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => "Failed to submit score: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data."]);
}
?>