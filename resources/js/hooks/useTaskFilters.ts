import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilter, TaskSortBy, SortOrder } from '../types';
import { getLocalStorage, setLocalStorage, sortTasks } from '../utils';

export function useTaskFilters() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<TaskSortBy>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Load filters from localStorage
  useEffect(() => {
    const savedFilter = getLocalStorage<TaskFilter>('taskFilter', 'all');
    const savedCategoryFilter = getLocalStorage<string>('taskCategoryFilter', 'all');
    const savedPriorityFilter = getLocalStorage<string>('taskPriorityFilter', 'all');
    const savedSortBy = getLocalStorage<TaskSortBy>('taskSortBy', 'created_at');
    const savedSortOrder = getLocalStorage<SortOrder>('taskSortOrder', 'desc');
    
    setFilter(savedFilter);
    setCategoryFilter(savedCategoryFilter);
    setPriorityFilter(savedPriorityFilter);
    setSortBy(savedSortBy);
    setSortOrder(savedSortOrder);
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    setLocalStorage('taskFilter', filter);
  }, [filter]);

  useEffect(() => {
    setLocalStorage('taskCategoryFilter', categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    setLocalStorage('taskPriorityFilter', priorityFilter);
  }, [priorityFilter]);

  useEffect(() => {
    setLocalStorage('taskSortBy', sortBy);
  }, [sortBy]);

  useEffect(() => {
    setLocalStorage('taskSortOrder', sortOrder);
  }, [sortOrder]);

  const filterTasks = useCallback((tasks: Task[]) => {
    let filtered = tasks.filter(task => {
      // Text search
      const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(query.toLowerCase())) ||
                          (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));

      // Status filter
      const matchesStatus = filter === 'all' || task.status === filter;

      // Category filter
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

      // Priority filter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesQuery && matchesStatus && matchesCategory && matchesPriority;
    });

    return sortTasks(filtered, sortBy, sortOrder);
  }, [query, filter, categoryFilter, priorityFilter, sortBy, sortOrder]);

  const clearFilters = useCallback(() => {
    setQuery('');
    setFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setSortBy('created_at');
    setSortOrder('desc');
  }, []);

  return {
    query,
    setQuery,
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterTasks,
    clearFilters,
  };
}
