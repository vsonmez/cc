import { useState } from 'react'
import { Modal } from '../../ui/components/Modal'
import { Input } from '../../ui/components/Input'
import { Textarea } from '../../ui/components/Textarea'
import { Button } from '../../ui/components/Button'
import { validateTask } from '../../core/models/task'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (taskSubject: string, taskDescription: string, taskDueDate: string) => void
}

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [taskSubject, setTaskSubject] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDueDate, setTaskDueDate] = useState(getTodayDateString())
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const validationError = validateTask(taskSubject, taskDescription, taskDueDate)

    if (validationError) {
      setError(validationError)
      return
    }

    onAdd(taskSubject, taskDescription, taskDueDate)
    handleClose()
  }

  const handleClose = () => {
    // Why: Reset form state when modal closes
    setTaskSubject('')
    setTaskDescription('')
    setTaskDueDate(getTodayDateString())
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Yeni Ödev">
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

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={handleClose} variant="secondary" className="flex-1">
            İptal
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Ekle
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// Why: Helper to get today's date in YYYY-MM-DD format for date input default
function getTodayDateString(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
