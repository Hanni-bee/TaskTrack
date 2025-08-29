<?php
$loginUrl = 'http://127.0.0.1:8000/api/login'; // Adjust the URL if necessary
$data = [
    'email' => 'user@example.com', // Replace with a valid email
    'password' => 'password', // Replace with the correct password
];

$options = [
    'http' => [
        'header' => [
            "Content-Type: application/json",
            "Accept: application/json"
        ],
        'method' => 'POST',
        'content' => json_encode($data),
    ],
];

$context = stream_context_create($options);
$response = file_get_contents($loginUrl, false, $context);
if ($response === FALSE) {
    die('Error occurred while logging in.');
}

echo "Login response: " . $response . "\n";
