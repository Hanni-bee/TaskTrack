import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Create a normalized key combination string
      const keys = [];
      if (event.ctrlKey) keys.push('ctrl');
      if (event.shiftKey) keys.push('shift');
      if (event.altKey) keys.push('alt');
      if (event.metaKey) keys.push('meta');
      
      // Add the main key (convert to lowercase for consistency)
      const mainKey = event.key.toLowerCase();
      keys.push(mainKey);
      
      // Create the combination string
      const combination = keys.join('+');
      
      // Check if this combination matches any of our shortcuts
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
