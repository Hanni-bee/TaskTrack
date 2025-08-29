<?php
// Read the generated password from the .env.password file
$password = file_get_contents('.env.password');
echo "Generated password: $password\n";

// Read the current .env file
$envContent = file_get_contents('.env');

// Update the DB_PASSWORD line with the new password
$envContent = preg_replace('/DB_PASSWORD=.*/', "DB_PASSWORD=$password", $envContent);

// Write the updated content back to the .env file
file_put_contents('.env', $envContent);

echo "Updated .env file with new password\n";
?>
