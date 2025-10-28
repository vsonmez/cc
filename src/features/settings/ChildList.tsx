import type { Child } from '../../core/models/child';
import { Button } from '../../ui/components/Button';

interface ChildListProps {
  children: Child[];
  onDelete: (childId: string, childName: string) => void;
}

export function ChildList({ children, onDelete }: ChildListProps) {
  const hasChildren = children.length > 0;

  if (!hasChildren) {
    return <p className="text-gray-500 text-sm">Henüz çocuk eklenmemiş</p>;
  }

  return (
    <div className="space-y-3">
      {children.map((child) => (
        <div
          key={child.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div>
            <h3 className="font-medium text-gray-900">{child.name}</h3>
            <p className="text-sm text-gray-600">{child.grade}. Sınıf</p>
          </div>

          <Button onClick={() => onDelete(child.id, child.name)} variant="danger">
            Sil
          </Button>
        </div>
      ))}
    </div>
  );
}
