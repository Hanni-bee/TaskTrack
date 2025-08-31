<?php
try {
    // Try to connect as root without a password
    $pdo = new PDO("mysql:host=127.0.0.1", "root", "");
    echo "Connected to MySQL as root\n";
    
    // Check if the database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE 'tasktrack'");
    if ($stmt->rowCount() > 0) {
        echo "Database 'tasktrack' exists\n";
    } else {
        echo "Database 'tasktrack' does not exist\n";
    }
    
    // Check if the user exists
    $stmt = $pdo->query("SELECT User, Host FROM mysql.user WHERE User = 'tasktrack'");
    if ($stmt->rowCount() > 0) {
        echo "User 'tasktrack' exists with the following hosts:\n";
        while ($row = $stmt->fetch()) {
            echo "  - " . $row['User'] . "@" . $row['Host'] . "\n";
        }
    } else {
        echo "User 'tasktrack' does not exist\n";
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
?>
