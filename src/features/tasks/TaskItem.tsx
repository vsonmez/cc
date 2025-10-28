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
