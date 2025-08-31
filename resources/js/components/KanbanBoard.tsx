import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

interface KanbanBoardProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const statusConfig = {
  pending: {
    title: 'To Do',
    color: 'bg-slate-500',
    icon: '📋'
  },
  in_progress: {
    title: 'In Progress',
    color: 'bg-blue-500',
    icon: '⚡'
  },
  done: {
    title: 'Completed',
    color: 'bg-green-500',
    icon: '✅'
  }
};

export function KanbanBoard({ tasks, onToggleStatus, onEdit, onDelete, onReorder }: KanbanBoardProps) {
  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    isDragging
  } = useDragAndDrop(tasks, onReorder);

  const tasksByStatus = {
    pending: tasks.filter(task => task.status === 'pending'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    done: tasks.filter(task => task.status === 'done')
  };

  const handleStatusDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onToggleStatus(taskId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
        const config = statusConfig[status];
        const statusTasks = tasksByStatus[status];
        
        return (
          <div
            key={status}
            className="flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleStatusDrop(e, status)}
          >
            {/* Column Header */}
            <div className={`${config.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.icon}</span>
                  <h3 className="font-semibold">{config.title}</h3>
                </div>
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm font-medium">
                  {statusTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 p-4 space-y-3 min-h-[200px] overflow-y-auto">
              {statusTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-2">
                    <span className="text-2xl opacity-50">{config.icon}</span>
                  </div>
                  <p className="text-sm">No tasks</p>
                </div>
              ) : (
                statusTasks.map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      handleDragStart(e, task, index);
                      e.dataTransfer.setData('taskId', task.id);
                    }}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`cursor-move transition-all duration-200 ${
                      isDragging ? 'hover:scale-105' : ''
                    }`}
                  >
                    <TaskCard
                      task={task}
                      onToggleStatus={onToggleStatus}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      index={index}
                      isKanban={true}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Drop Zone Indicator */}
            <div className="h-2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 transition-opacity duration-200 drag-over:opacity-100" />
          </div>
        );
      })}
    </div>
  );
}
