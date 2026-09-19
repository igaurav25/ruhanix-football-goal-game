<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$host = "localhost";
$db_name = "ruhanixfootball_game"; 
$username = "root";
$password = ""; 

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["status" => "error", "message" => $exception->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && isset($data->goals) && !empty($data->result)) {
    $query = "INSERT INTO match_history (email, goals_scored, match_result) VALUES (:email, :goals, :result)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":goals", $data->goals);
    $stmt->bindParam(":result", $data->result);

    if($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Match record saved!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save record."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Incomplete data!"]);
}
?>