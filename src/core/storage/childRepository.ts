import { createChild, type Child } from '../models/child';
import { loadAppData, saveAppData } from './storage-engine';

export function addChild(childName: string, childGrade: number): Child | null {
  const data = loadAppData();
  const newChild = createChild(childName, childGrade);

  data.children.push(newChild);

  const saveSucceeded = saveAppData(data);
  if (!saveSucceeded) {
    return null;
  }

  return newChild;
}

export function updateChild(childId: string, childName: string, childGrade: number): boolean {
  const data = loadAppData();
  const childIndex = data.children.findIndex((child) => child.id === childId);

  if (childIndex === -1) {
    return false;
  }

  data.children[childIndex] = {
    ...data.children[childIndex],
    name: childName.trim(),
    grade: childGrade
  };

  return saveAppData(data);
}

export function deleteChild(childId: string): boolean {
  const data = loadAppData();

  // Why: Remove child and all their tasks (child-centric model)
  data.children = data.children.filter((child) => child.id !== childId);
  data.tasks = data.tasks.filter((task) => task.childId !== childId);

  // Why: Clear last selected child if it was the deleted one
  if (data.settings.lastSelectedChildId === childId) {
    data.settings.lastSelectedChildId = null;
  }

  return saveAppData(data);
}

export function getChildren(): Child[] {
  const data = loadAppData();
  // Why: Sort by createdAt so first added child appears first
  return [...data.children].sort((a, b) => a.createdAt - b.createdAt);
}

export function getChildById(childId: string): Child | null {
  const data = loadAppData();
  return data.children.find((child) => child.id === childId) || null;
}
