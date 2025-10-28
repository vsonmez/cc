import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildren } from '../../ui/hooks/useChildren';
import { useTasks } from '../../ui/hooks/useTasks';
import { useSettings } from '../../ui/hooks/useSettings';
import { Button } from '../../ui/components/Button';
import { Select } from '../../ui/components/Select';
import { TaskList } from './TaskList';
import { AddTaskModal } from './AddTaskModal';

export function TasksPage() {
  const navigate = useNavigate();
  const { children } = useChildren();
  const { settings, updateSettings } = useSettings();

  // Why: Use last selected child from settings, or first child if none selected
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { tasks, addTask, toggleTask, deleteTask } = useTasks(selectedChildId);

  // Why: Initialize selected child on mount
  useEffect(() => {
    const hasNoChildren = children.length === 0;

    if (hasNoChildren) {
      navigate('/onboarding');
      return;
    }

    const lastSelectedChild = settings.lastSelectedChildId;
    const lastSelectedChildExists = children.some((child) => child.id === lastSelectedChild);

    if (lastSelectedChild && lastSelectedChildExists) {
      setSelectedChildId(lastSelectedChild);
    } else {
      setSelectedChildId(children[0].id);
    }
  }, [children, settings.lastSelectedChildId, navigate]);

  const handleChildChange = (childId: string | number) => {
    const newChildId = String(childId);
    setSelectedChildId(newChildId);
    updateSettings({ lastSelectedChildId: newChildId });
  };

  const handleAddTask = (taskSubject: string, taskDescription: string, taskDueDate: string) => {
    addTask(selectedChildId, taskSubject, taskDescription, taskDueDate);
  };

  const selectedChild = children.find((child) => child.id === selectedChildId);

  const childOptions = children.map((child) => ({
    value: child.id,
    label: `${child.name} (${child.grade}. Sınıf)`
  }));

  const hasMultipleChildren = children.length > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/settings')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {hasMultipleChildren && selectedChildId && (
              <div className="flex-1 max-w-xs mx-4">
                <Select
                  label=""
                  value={selectedChildId}
                  onChange={handleChildChange}
                  options={childOptions}
                />
              </div>
            )}

            {!hasMultipleChildren && selectedChild && (
              <h1 className="text-xl font-semibold text-gray-900">{selectedChild.name}</h1>
            )}

            <div className="w-6" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ödevler</h2>
          <p className="text-gray-600 text-sm mt-1">{getTodayFormatted()}</p>
        </div>

        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      </div>

      {/* Floating add button */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setIsAddModalOpen(true)} className="shadow-lg px-6 py-3 text-lg">
          + Ödev Ekle
        </Button>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}

// Why: Format today's date in Turkish locale for header display
function getTodayFormatted(): string {
  const today = new Date();
  return today.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
