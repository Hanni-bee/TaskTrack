import React, { useState } from 'react';
import { TaskForm as TaskFormType } from '../types';

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration?: number; // in minutes
  tags: string[];
  icon: string;
}

const defaultTemplates: TaskTemplate[] = [
  {
    id: 'daily-standup',
    name: 'Daily Standup',
    description: 'Attend daily team standup meeting',
    category: 'work',
    priority: 'medium',
    estimatedDuration: 30,
    tags: ['meeting', 'recurring'],
    icon: '👥'
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Review pull requests and provide feedback',
    category: 'work',
    priority: 'high',
    estimatedDuration: 60,
    tags: ['development', 'review'],
    icon: '🔍'
  },
  {
    id: 'workout',
    name: 'Workout Session',
    description: 'Complete daily exercise routine',
    category: 'health',
    priority: 'medium',
    estimatedDuration: 45,
    tags: ['fitness', 'health'],
    icon: '💪'
  },
  {
    id: 'meal-prep',
    name: 'Meal Preparation',
    description: 'Prepare healthy meals for the week',
    category: 'personal',
    priority: 'low',
    estimatedDuration: 120,
    tags: ['cooking', 'health'],
    icon: '🍳'
  },
  {
    id: 'budget-review',
    name: 'Budget Review',
    description: 'Review monthly expenses and budget allocation',
    category: 'finance',
    priority: 'medium',
    estimatedDuration: 30,
    tags: ['money', 'planning'],
    icon: '💰'
  },
  {
    id: 'learning',
    name: 'Learning Session',
    description: 'Dedicated time for skill development',
    category: 'personal',
    priority: 'medium',
    estimatedDuration: 60,
    tags: ['education', 'growth'],
    icon: '📚'
  }
];

interface TaskTemplatesProps {
  onSelectTemplate: (template: Partial<TaskFormType>) => void;
  onClose: () => void;
}

export function TaskTemplates({ onSelectTemplate, onClose }: TaskTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customTemplates, setCustomTemplates] = useState<TaskTemplate[]>(() => {
    const saved = localStorage.getItem('task-templates');
    return saved ? JSON.parse(saved) : [];
  });

  const allTemplates = [...defaultTemplates, ...customTemplates];
  
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(allTemplates.map(t => t.category)))];

  const handleSelectTemplate = (template: TaskTemplate) => {
    const taskData: Partial<TaskFormType> = {
      title: template.name,
      description: template.description,
      category: template.category,
      priority: template.priority,
      status: 'pending'
    };
    
    onSelectTemplate(taskData);
    onClose();
  };

  const saveCustomTemplate = (template: Omit<TaskTemplate, 'id'>) => {
    const newTemplate: TaskTemplate = {
      ...template,
      id: `custom-${Date.now()}`
    };
    
    const updated = [...customTemplates, newTemplate];
    setCustomTemplates(updated);
    localStorage.setItem('task-templates', JSON.stringify(updated));
  };

  const deleteCustomTemplate = (id: string) => {
    const updated = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updated);
    localStorage.setItem('task-templates', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Task Templates</h2>
          <p className="text-slate-400">Quick start with pre-configured tasks</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-modern w-full"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-modern w-full sm:w-40"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="glass p-4 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-xl">
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      template.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      template.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {template.priority}
                    </span>
                    <span className="text-slate-400">{template.category}</span>
                  </div>
                </div>
              </div>
              
              {template.id.startsWith('custom-') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCustomTemplate(template.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-sm text-slate-300 mb-3 line-clamp-2">
              {template.description}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                {template.estimatedDuration && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    {template.estimatedDuration}m
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {template.tags.length > 2 && (
                  <span className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                    +{template.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-slate-200 mb-2">No templates found</h3>
          <p className="text-slate-400">Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="btn-secondary"
        >
          Create Custom Task Instead
        </button>
      </div>
    </div>
  );
}
