import { useState, useMemo } from 'react';
import { Task } from '../types';

export function useTaskFilters() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | Task['status']>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_at' | 'title'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filterTasks = (tasks: Task[]) => {
    return useMemo(() => {
      let filtered = tasks;

      // Apply search query filter
      if (query) {
        filtered = filtered.filter(task => 
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
        );
      }

      // Apply status filter
      if (filter !== 'all') {
        filtered = filtered.filter(task => task.status === filter);
      }

      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        let aValue: string | Date | undefined;
        let bValue: string | Date | undefined;

        if (sortBy === 'title') {
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
        } else if (sortBy === 'due_at') {
          aValue = a.due_at;
          bValue = b.due_at;
        } else {
          aValue = a.created_at;
          bValue = b.created_at;
        }

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        // Compare values
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      return filtered;
    }, [tasks, query, filter, sortBy, sortOrder]);
  };

  return {
    filterTasks,
    query,
    setQuery,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
  };
}
