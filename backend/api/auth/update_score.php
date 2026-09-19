<?php
// CORS Headers - App ko connect karne dene ke liye
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
    echo json_encode(["status" => "error", "message" => "DB Error: " . $exception->getMessage()]);
    exit();
}

// App se aane wala data (JSON)
$data = json_decode(file_get_contents("php://input"));

// Check karna ki email aur naya kamaya hua XP aaya hai ya nahi
if(!empty($data->email) && isset($data->xp_earned)) {
    
    // Pehle player ka purana XP aur Level nikaalo
    $query = "SELECT xp, current_level FROM users WHERE email = :email LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Naya XP jod do
        $new_xp = $row['xp'] + $data->xp_earned;
        $new_level = $row['current_level'];

        // LEVEL UP LOGIC: Agar XP 100 ya usse zyada ho gaya, toh player ka Level badha do!
        if($new_xp >= ($new_level * 100)) {
            $new_level++; 
        }

        // Database mein naya XP aur Level save karo
        $update_query = "UPDATE users SET xp = :xp, current_level = :level WHERE email = :email";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bindParam(":xp", $new_xp);
        $update_stmt->bindParam(":level", $new_level);
        $update_stmt->bindParam(":email", $data->email);

        if($update_stmt->execute()) {
            echo json_encode([
                "status" => "success", 
                "message" => "Score successfully save ho gaya!", 
                "new_xp" => $new_xp,
                "new_level" => $new_level
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Score save karne mein problem aayi."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Is email se koi player nahi mila."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Email aur XP bhejna zaroori hai!"]);
}
?>