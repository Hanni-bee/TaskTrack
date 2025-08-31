import { useEffect, useState } from 'react';
import { apiRequest } from '../utils';
import { Task, TaskForm as TaskFormType } from '../types';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const response = await apiRequest<Task[]>('/api/tasks');
            setTasks(response);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (taskData: TaskFormType) => {
        const response = await apiRequest<Task>('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
        setTasks([...tasks, response]);
    };

    const updateTask = async (id: number, taskData: TaskFormType) => {
        const response = await apiRequest<Task>(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
        setTasks(tasks.map(task => (task.id === id ? response : task)));
    };

    const toggleTaskStatus = async (id: number) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            const newStatus = task.status === 'done' ? 'pending' : 'done';
            const response = await apiRequest<Task>(`/api/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            setTasks(tasks.map(t => (t.id === id ? response : t)));
        }
    };

    const deleteTask = async (id: number) => {
        await apiRequest(`/api/tasks/${id}`, { method: 'DELETE' });
        setTasks(tasks.filter(task => task.id !== id));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return { tasks, loading, addTask, updateTask, toggleTaskStatus, deleteTask };
}
