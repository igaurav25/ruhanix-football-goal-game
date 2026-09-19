<?php
// CORS Headers - App ko connect karne dene ke liye
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database configuration
$host = "localhost";
$db_name = "ruhanixfootball_game"; // Tumhara exact database naam
$username = "root";
$password = ""; // XAMPP ka default password blank hota hai

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["status" => "error", "message" => "Database connection failed!"]);
    exit();
}

// App se aane wala data (JSON)
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    
    // User ko email se dhundo
    $query = "SELECT id, name, email, password, current_level, xp FROM users WHERE email = :email LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Password check karo (Database wale encrypted password se mila kar)
        if(password_verify($data->password, $row['password'])) {
            
            // Login Success! Player ka data bhej do
            $user_arr = array(
                "id" => $row['id'],
                "name" => $row['name'],
                "email" => $row['email'],
                "current_level" => $row['current_level'],
                "xp" => $row['xp']
            );
            
            echo json_encode([
                "status" => "success", 
                "message" => "Login successful!", 
                "data" => $user_arr
            ]);
        } else {
            // Password galat hai
            echo json_encode(["status" => "error", "message" => "Password galat hai bhai!"]);
        }
    } else {
        // Email nahi mili
        echo json_encode(["status" => "error", "message" => "Is email se koi account nahi mila! Pehle signup karo."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Email aur password dono daalna zaroori hai!"]);
}
?>