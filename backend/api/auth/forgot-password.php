<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$host = "localhost";
$db_name = "ruhanixfootball_game"; // Agar database ka naam kuch aur hai toh yahan change kar lena
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["status" => "error", "message" => "Database connection failed!"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->new_password)) {
    
    // Check karo ki email database mein exist karti hai ya nahi
    $check_query = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(":email", $data->email);
    $check_stmt->execute();

    if($check_stmt->rowCount() > 0) {
        // Naye password ko encrypt karo
        $new_password_hash = password_hash($data->new_password, PASSWORD_BCRYPT);

        // Password update kar do
        $update_query = "UPDATE users SET password = :password WHERE email = :email";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bindParam(":password", $new_password_hash);
        $update_stmt->bindParam(":email", $data->email);

        if($update_stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Password successfully change ho gaya! Ab naye password se login karo."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Password update karne mein error aayi."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Yeh email database mein registered nahi hai!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Email aur Naya Password dono dalna zaroori hai!"]);
}
?>