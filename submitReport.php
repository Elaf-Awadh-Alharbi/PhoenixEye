<?php
// ===============================
//  CORS headers for React (Vite)
// ===============================
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "status"  => "error",
        "message" => "Method not allowed. Use POST."
    ]);
    exit();
}

// ===============================
//  Read JSON body
// ===============================
$rawBody = file_get_contents("php://input");
$data    = json_decode($rawBody, true);

if (
    !$data ||
    !isset($data["title"]) ||
    !isset($data["description"]) ||
    !isset($data["location"])
) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Missing required fields (title, description, location)."
    ]);
    exit();
}

// Optional latitude & longitude
$latitude  = isset($data["latitude"])  && $data["latitude"]  !== "" ? (float)$data["latitude"]  : null;
$longitude = isset($data["longitude"]) && $data["longitude"] !== "" ? (float)$data["longitude"] : null;

// ===============================
//  MySQL connection (XAMPP)
// ===============================

// Turn off mysqli warnings so they don't break JSON
mysqli_report(MYSQLI_REPORT_OFF);

$dbHost = "localhost";
$dbUser = "root";
$dbPass = "Qa1234567890";   // ⬅️ use your real MySQL password
$dbName = "phoenixeye";

$conn = @new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_errno) {
    http_response_code(500);
    echo json_encode([
        "status"   => "error",
        "message"  => "Database connection failed.",
        "db_error" => $conn->connect_error
    ]);
    exit();
}

// ===============================
//  Insert the report
// ===============================
$stmt = $conn->prepare(
    "INSERT INTO reports (title, description, location, latitude, longitude)
     VALUES (?, ?, ?, ?, ?)"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "status"   => "error",
        "message"  => "Failed to prepare statement.",
        "db_error" => $conn->error
    ]);
    $conn->close();
    exit();
}

$stmt->bind_param(
    "sssdd",
    $data["title"],
    $data["description"],
    $data["location"],
    $latitude,
    $longitude
);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "id"     => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status"   => "error",
        "message"  => "Failed to save report.",
        "db_error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
