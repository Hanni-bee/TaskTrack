<?php

echo "🔄 Running TaskTrack Migration...\n\n";

try {
    // Run the migration
    $output = shell_exec('php artisan migrate 2>&1');
    
    if (strpos($output, 'Migrated') !== false || strpos($output, 'Nothing to migrate') !== false) {
        echo "✅ Migration completed successfully!\n\n";
        
        echo "📋 What's been added:\n";
        echo "   - Category field (work, personal, health, finance, education, shopping, travel, general)\n";
        echo "   - Priority field (low, medium, high)\n";
        echo "   - Tags field (JSON array for custom tags)\n\n";
        
        echo "🎉 Your TaskTrack app now supports:\n";
        echo "   - Task categorization with color-coded badges\n";
        echo "   - Priority levels with visual indicators\n";
        echo "   - Custom tags for better organization\n";
        echo "   - Enhanced filtering and sorting\n";
        echo "   - Beautiful animations and improved UI\n\n";
        
        echo "🚀 Ready to use the new features!\n";
        
    } else {
        echo "❌ Migration failed:\n";
        echo $output;
    }
    
} catch (Exception $e) {
    echo "❌ Error running migration: " . $e->getMessage() . "\n";
}
