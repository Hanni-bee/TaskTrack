import { useState, useRef } from 'react';
import { Task, DragItem } from '../types';

export function useDragAndDrop(_tasks: Task[], onReorder: (dragIndex: number, hoverIndex: number) => void) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const draggedOverItem = useRef<number | null>(null);

  const handleDragStart = (e: any, task: Task, index: number) => {
    const dragItem: DragItem = {
      id: task.id,
      index,
      type: 'task'
    };
    
    setDraggedItem(dragItem);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    
    // Add visual feedback
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: any) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItem(null);
    draggedOverItem.current = null;
  };

  const handleDragOver = (e: any, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItem && draggedItem.index !== index) {
      draggedOverItem.current = index;
    }
  };

  const handleDragEnter = (e: any, index: number) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem.index !== index) {
      // Add visual feedback for drop zone
      e.currentTarget.classList.add('border-blue-500', 'border-2', 'border-dashed');
    }
  };

  const handleDragLeave = (e: any) => {
    // Remove visual feedback
    e.currentTarget.classList.remove('border-blue-500', 'border-2', 'border-dashed');
  };

  const handleDrop = (e: any, dropIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'border-2', 'border-dashed');
    
    if (draggedItem && draggedItem.index !== dropIndex) {
      onReorder(draggedItem.index, dropIndex);
    }
    
    setDraggedItem(null);
    draggedOverItem.current = null;
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    isDragging: draggedItem !== null
  };
}
