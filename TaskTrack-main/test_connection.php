<?php
// Load Laravel's autoload file
require_once 'vendor/autoload.php';

// Load the .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Get database configuration from environment variables
$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
$database = $_ENV['DB_DATABASE'] ?? 'tasktrack';
$username = $_ENV['DB_USERNAME'] ?? 'tasktrack';
$password = $_ENV['DB_PASSWORD'] ?? 'tasktrack';

try {
    // Try to establish a connection
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    echo "Connection successful!\n";
    echo "Host: $host\n";
    echo "Database: $database\n";
    echo "Username: $username\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
?>
