<?php
// ruhanix_backend/api/user/updateProfile.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"));

// Yahan humne 'name' bhi add kar diya hai check karne ke liye
if(!empty($data->user_id) && isset($data->name) && isset($data->avatar) && isset($data->jersey_color) && isset($data->country) && isset($data->state)) {
    
    try {
        // Query mein name update karne ka logic add kiya gaya hai
        $query = "UPDATE users 
                  SET name = :name,
                      avatar = :avatar, 
                      jersey_color = :jersey_color, 
                      country = :country, 
                      state = :state 
                  WHERE id = :user_id";
                  
        $stmt = $conn->prepare($query);
        
        // Data ko bind karna
        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":avatar", $data->avatar);
        $stmt->bindParam(":jersey_color", $data->jersey_color);
        $stmt->bindParam(":country", $data->country);
        $stmt->bindParam(":state", $data->state);
        $stmt->bindParam(":user_id", $data->user_id);
        
        if($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Profile updated successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Unable to update profile."]);
        }
    } catch (Exception $e) {
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data. Need user_id, name, avatar, jersey_color, country, and state."]);
}
?>