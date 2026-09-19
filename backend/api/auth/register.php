<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database configuration
$host = "localhost";
$db_name = "ruhanixfootball_game"; 
$username = "root";
$password = ""; 

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    // Yahan humne update kiya hai taaki exact error pata chale
    echo json_encode(["status" => "error", "message" => "DB Error: " . $exception->getMessage()]);
    exit();
}

// App se aane wala data 
$data = json_decode(file_get_contents("php://input"));

// Check karna ki saari details aayi hain ya nahi
if(!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    
    // Check karna ki is email se pehle koi account toh nahi hai
    $check_query = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(":email", $data->email);
    $check_stmt->execute();

    if($check_stmt->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "Bhai, is email se pehle hi account bana hua hai!"]);
    } else {
        // Naye khiladi ko database mein daalna
        $query = "INSERT INTO users (name, email, password, current_level, xp) VALUES (:name, :email, :password, 1, 0)";
        $stmt = $conn->prepare($query);

        // Password ko encrypt karna
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":password", $password_hash);

        if($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Account successfully ban gaya!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Account banane mein problem aayi."]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "Name, Email aur Password teeno zaroori hain!"]);
}
?>