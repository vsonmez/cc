import { useState, useEffect } from 'react';
import { Modal } from '../../ui/components/Modal';
import { Input } from '../../ui/components/Input';
import { Textarea } from '../../ui/components/Textarea';
import { Button } from '../../ui/components/Button';
import { validateTask } from '../../core/models/task';
import type { Task } from '../../core/models/task';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, taskSubject: string, taskDescription: string, taskDueDate: string) => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, onUpdate, task }: EditTaskModalProps) {
  const [taskSubject, setTaskSubject] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [error, setError] = useState('');

  // Why: Populate form fields when task changes or modal opens
  useEffect(() => {
    if (!task) {
      return;
    }

    setTaskSubject(task.subject);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate);
    setError('');
  }, [task, isOpen]);

  const handleSubmit = () => {
    // Why: Guard clause - cannot update without a task
    if (!task) {
      return;
    }

    const validationError = validateTask(taskSubject, taskDescription, taskDueDate);

    if (validationError) {
      setError(validationError);
      return;
    }

    onUpdate(task.id, taskSubject, taskDescription, taskDueDate);
    handleClose();
  };

  const handleClose = () => {
    // Why: Reset form state when modal closes
    setTaskSubject('');
    setTaskDescription('');
    setTaskDueDate('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ödevi Düzenle">
      <div className="space-y-4">
        <Input
          label="Ders Adı"
          value={taskSubject}
          onChange={setTaskSubject}
          placeholder="örn: Matematik"
          required
          maxLength={30}
        />

        <Textarea
          label="Açıklama"
          value={taskDescription}
          onChange={setTaskDescription}
          placeholder="örn: Sayfa 45-47, problemleri çöz"
          maxLength={200}
          rows={3}
        />

        <Input
          label="Teslim Tarihi"
          value={taskDueDate}
          onChange={setTaskDueDate}
          type="date"
          required
        />

        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

        <div className="flex gap-2 pt-2">
          <Button onClick={handleClose} variant="secondary" className="flex-1">
            İptal
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Güncelle
          </Button>
        </div>
      </div>
    </Modal>
  );
}
