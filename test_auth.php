<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Test database connection and user creation
try {
    // Test database connection
    echo "Testing database connection...\n";
    $user = User::first();
    echo "Database connection successful!\n";
    
    // Test user creation
    echo "Testing user creation...\n";
    $testUser = User::create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);
    echo "User created successfully with ID: " . $testUser->id . "\n";
    
    // Test user retrieval
    $foundUser = User::where('email', 'test@example.com')->first();
    if ($foundUser) {
        echo "User retrieval successful!\n";
        echo "User name: " . $foundUser->name . "\n";
        echo "User email: " . $foundUser->email . "\n";
    }
    
    echo "All tests passed!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
