import { useEffect, useState } from 'react';
import axios from 'axios';
import { Task, TaskForm as TaskFormType } from '../types';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (taskData: TaskFormType) => {
        const response = await axios.post('/api/tasks', taskData);
        setTasks([...tasks, response.data]);
    };

    const updateTask = async (id: number, taskData: TaskFormType) => {
        const response = await axios.put(`/api/tasks/${id}`, taskData);
        setTasks(tasks.map(task => (task.id === id ? response.data : task)));
    };

    const toggleTaskStatus = async (id: number) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            const newStatus = task.status === 'done' ? 'pending' : 'done';
            await axios.put(`/api/tasks/${id}`, { status: newStatus });
            setTasks(tasks.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
        }
    };

    const deleteTask = async (id: number) => {
        await axios.delete(`/api/tasks/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return { tasks, loading, addTask, updateTask, toggleTaskStatus, deleteTask };
}
