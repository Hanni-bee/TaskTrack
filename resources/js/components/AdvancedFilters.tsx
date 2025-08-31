import React, { useState } from 'react';
import { Task } from '../types';

interface AdvancedFiltersProps {
  tasks: Task[];
  onFilterChange: (filteredTasks: Task[]) => void;
  onSearchChange: (query: string) => void;
}

export function AdvancedFilters({ tasks, onFilterChange, onSearchChange }: AdvancedFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const smartFilters = [
    {
      id: 'overdue',
      label: 'Overdue',
      icon: '⚠️',
      color: 'bg-red-500',
      filter: (task: Task) => task.due_at && new Date(task.due_at) < new Date()
    },
    {
      id: 'today',
      label: 'Due Today',
      icon: '📅',
      color: 'bg-orange-500',
      filter: (task: Task) => {
        if (!task.due_at) return false;
        const today = new Date().toDateString();
        return new Date(task.due_at).toDateString() === today;
      }
    },
    {
      id: 'this-week',
      label: 'This Week',
      icon: '📆',
      color: 'bg-blue-500',
      filter: (task: Task) => {
        if (!task.due_at) return false;
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return new Date(task.due_at) <= weekFromNow;
      }
    },
    {
      id: 'high-priority',
      label: 'High Priority',
      icon: '🔥',
      color: 'bg-purple-500',
      filter: (task: Task) => task.priority === 'high'
    },
    {
      id: 'no-category',
      label: 'Uncategorized',
      icon: '📝',
      color: 'bg-gray-500',
      filter: (task: Task) => !task.category
    },
    {
      id: 'has-reminder',
      label: 'Has Reminder',
      icon: '🔔',
      color: 'bg-green-500',
      filter: (task: Task) => !!task.reminder_at
    }
  ];

  const categories = ['work', 'personal', 'health', 'finance', 'other'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['pending', 'in_progress', 'done'];

  const applyFilters = (newFilters: string[], newSearch: string) => {
    let filtered = [...tasks];

    // Apply search
    if (newSearch.trim()) {
      const query = newSearch.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.category?.toLowerCase().includes(query) ||
        task.notes?.toLowerCase().includes(query)
      );
    }

    // Apply smart filters
    newFilters.forEach(filterId => {
      const smartFilter = smartFilters.find(f => f.id === filterId);
      if (smartFilter) {
        filtered = filtered.filter(smartFilter.filter);
      }
    });

    onFilterChange(filtered);
  };

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    applyFilters(newFilters, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearchChange(query);
    applyFilters(activeFilters, query);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    onSearchChange('');
    onFilterChange(tasks);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search tasks, categories, notes... (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="input-modern pl-10 w-full"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-slate-400 hover:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Smart Filters */}
      <div className="flex flex-wrap gap-2">
        {smartFilters.map(filter => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeFilters.includes(filter.id)
                ? `${filter.color} text-white shadow-lg scale-105`
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <span>{filter.icon}</span>
            {filter.label}
            {activeFilters.includes(filter.id) && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Advanced Filters
        </button>

        {(activeFilters.length > 0 || searchQuery) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All ({activeFilters.length + (searchQuery ? 1 : 0)})
          </button>
        )}
      </div>

      {/* Advanced Filter Options */}
      {showAdvanced && (
        <div className="glass p-4 rounded-xl space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
              <select className="input-modern w-full">
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Priority</label>
              <select className="input-modern w-full">
                <option value="">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
              <select className="input-modern w-full">
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Due After</label>
              <input type="date" className="input-modern w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Due Before</label>
              <input type="date" className="input-modern w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(activeFilters.length > 0 || searchQuery) && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Active filters:</span>
          {searchQuery && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg">
              Search: "{searchQuery}"
            </span>
          )}
          {activeFilters.map(filterId => {
            const filter = smartFilters.find(f => f.id === filterId);
            return filter ? (
              <span key={filterId} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg">
                {filter.label}
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
