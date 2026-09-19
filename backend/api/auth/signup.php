<?php
// ruhanix_backend/api/auth/signup.php

// 1. CORS Headers: Yeh line isliye hai taaki humari React Native app bina kisi block ke is API ko access kar sake
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 2. Database Connection File ko link karna (Jo humne pehle banayi thi)
include_once '../../config/db.php';

// 3. Frontend (App) se jo JSON data aayega, usko read karna
$data = json_decode(file_get_contents("php://input"));

// 4. Check karna ki Name, Email, aur Password khali toh nahi hai
if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    
    // 5. Check karna ki Email pehle se database mein toh nahi hai
    $check_query = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(":email", $data->email);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        // Agar email pehle se maujood hai
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Email already registered."]);
    } else {
        // 6. Naya user database mein insert karna
        $query = "INSERT INTO users (name, email, password) VALUES (:name, :email, :password)";
        $stmt = $conn->prepare($query);
        
        // Data ko clean karna (Security ke liye taaki koi hack na kar sake)
        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        
        // Password ko sidha save nahi karte, usko Hash (encrypt) karte hain
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        
        // Values ko query ke sath jodna
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $password_hash);
        
        // Query ko run karna
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "User registered successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Unable to register user."]);
        }
    }
} else {
    // Agar koi field khali chhut gayi ho
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data. Please provide name, email and password."]);
}
?>