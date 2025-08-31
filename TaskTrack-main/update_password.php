<?php
try {
    // Connect as root without a password
    $pdo = new PDO("mysql:host=127.0.0.1", "root", "");
    echo "Connected to MySQL as root\n";
    
    // Generate a random password
    $password = bin2hex(random_bytes(12));
    echo "Generated password: $password\n";
    
    // Update the password for the 'tasktrack' user
    $pdo->exec("ALTER USER 'tasktrack'@'localhost' IDENTIFIED BY '$password'");
    $pdo->exec("ALTER USER 'tasktrack'@'127.0.0.1' IDENTIFIED BY '$password'");
    $pdo->exec("FLUSH PRIVILEGES");
    
    echo "Password updated successfully\n";
    
    // Save the password to a file for reference
    file_put_contents('.env.password', $password);
    echo "Password saved to .env.password file\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
