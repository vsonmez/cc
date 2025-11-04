import {
  BookOpen,
  FileText,
  Mic,
  Briefcase,
  Palette,
  Book,
  Search,
  Presentation
} from 'lucide-react';
import { TASK_CATEGORIES, type TaskCategoryType } from '../../../core/models/task-category';

interface TaskCategoryBadgeProps {
  categoryType: TaskCategoryType;
  showMultiplier?: boolean;
  className?: string;
}

// Why: Icon map enables O(1) lookup and tree-shaking of unused lucide-react icons
const ICON_MAP = {
  BookOpen,
  FileText,
  Mic,
  Briefcase,
  Palette,
  Book,
  Search,
  Presentation
} as const;

export function TaskCategoryBadge({
  categoryType,
  showMultiplier = false,
  className = ''
}: TaskCategoryBadgeProps) {
  const taskCategory = TASK_CATEGORIES.find((category) => category.categoryType === categoryType);

  // Why: Early return prevents rendering invalid category badges
  if (!taskCategory) {
    return null;
  }

  const IconComponent = ICON_MAP[taskCategory.iconName as keyof typeof ICON_MAP];

  // Why: Fallback to default icon prevents crashes when icon name is invalid
  const DisplayIcon = IconComponent || BookOpen;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${taskCategory.colorClass} ${className}`}
    >
      <DisplayIcon className="w-4 h-4 shrink-0" />
      <span className="truncate">{taskCategory.displayName}</span>
      {showMultiplier && (
        <span className="font-semibold text-xs">({taskCategory.pointMultiplier}x)</span>
      )}
    </span>
  );
}
