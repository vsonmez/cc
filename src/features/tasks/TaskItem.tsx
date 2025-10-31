import type { Task } from '../../core/models/task';
import { Checkbox } from '../../ui/components/Checkbox';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isCompleted = task.completed;

  const taskStyles = isCompleted ? 'opacity-60 line-through' : '';

  // Format due date
  const formatDueDate = (dueDate: string): string => {
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) return 'Bugün';
    if (daysDiff === 1) return 'Yarın';
    if (daysDiff === -1) return 'Dün';

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('tr-TR', options);
  };

  // Get due date color based on urgency
  const getDueDateColor = (dueDate: string): string => {
    if (isCompleted) return 'text-gray-400';

    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return 'text-red-600'; // Overdue
    if (daysDiff === 0) return 'text-orange-600'; // Today
    if (daysDiff === 1) return 'text-yellow-600'; // Tomorrow
    return 'text-gray-500'; // Future
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <Checkbox checked={isCompleted} onChange={() => onToggle(task.id)} />

      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-gray-900 ${taskStyles}`}>{task.subject}</h3>
        {task.description && (
          <p className={`text-sm text-gray-600 mt-1 whitespace-pre-wrap ${taskStyles}`}>
            {task.description}
          </p>
        )}
        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${getDueDateColor(task.dueDate)}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDueDate(task.dueDate)}</span>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-600 transition-colors"
        aria-label="Görevi sil"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
