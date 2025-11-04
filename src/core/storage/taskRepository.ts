import { createTask, type Task } from '../models/task';
import type { TaskCategoryType } from '../models/task-category';
import { loadAppData, saveAppData } from './storage-engine';

export function addTask(
  childId: string,
  taskSubject: string,
  taskDescription: string,
  taskDueDate: string,
  taskCategory: TaskCategoryType = 'general_homework'
): Task | null {
  const data = loadAppData();

  // Why: Guard clause - ensure child exists before adding task
  const childExists = data.children.some((child) => child.id === childId);
  if (!childExists) {
    return null;
  }

  const newTask = createTask(childId, taskSubject, taskDescription, taskDueDate, taskCategory);
  data.tasks.push(newTask);

  const saveSucceeded = saveAppData(data);
  if (!saveSucceeded) {
    return null;
  }

  return newTask;
}

export function updateTask(
  taskId: string,
  taskSubject: string,
  taskDescription: string,
  taskDueDate: string,
  taskCategory: TaskCategoryType
): boolean {
  const data = loadAppData();
  const taskIndex = data.tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return false;
  }

  data.tasks[taskIndex] = {
    ...data.tasks[taskIndex],
    subject: taskSubject.trim(),
    description: taskDescription.trim(),
    dueDate: taskDueDate,
    taskCategory
  };

  return saveAppData(data);
}

export function deleteTask(taskId: string): boolean {
  const data = loadAppData();
  data.tasks = data.tasks.filter((task) => task.id !== taskId);
  return saveAppData(data);
}

export function toggleTaskCompletion(taskId: string): boolean {
  const data = loadAppData();
  const taskIndex = data.tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return false;
  }

  data.tasks[taskIndex].completed = !data.tasks[taskIndex].completed;

  return saveAppData(data);
}

export function getTasksByChild(childId: string): Task[] {
  const data = loadAppData();
  const childTasks = data.tasks.filter((task) => task.childId === childId);

  // Why: Sort incomplete tasks first, then by due date (nearest first), then by creation time
  return childTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    if (a.dueDate !== b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }

    return b.createdAt - a.createdAt;
  });
}

export function getTasksByDate(childId: string, date: string): Task[] {
  const data = loadAppData();
  return data.tasks.filter((task) => task.childId === childId && task.dueDate === date);
}

export function getAllTasks(): Task[] {
  const data = loadAppData();
  return [...data.tasks];
}
