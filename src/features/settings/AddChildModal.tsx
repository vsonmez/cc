import { useState } from 'react'
import { Modal } from '../../ui/components/Modal'
import { Input } from '../../ui/components/Input'
import { Select } from '../../ui/components/Select'
import { Button } from '../../ui/components/Button'
import { validateChild } from '../../core/models/child'

interface AddChildModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, grade: number) => void
}

export function AddChildModal({ isOpen, onClose, onAdd }: AddChildModalProps) {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(1)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const validationError = validateChild(name, grade)

    if (validationError) {
      setError(validationError)
      return
    }

    onAdd(name, grade)
    handleClose()
  }

  const handleClose = () => {
    // Why: Reset form state when modal closes
    setName('')
    setGrade(1)
    setError('')
    onClose()
  }

  const gradeOptions = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: `${index + 1}. Sınıf`
  }))

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Yeni Çocuk Ekle">
      <div className="space-y-4">
        <Input
          label="İsim"
          value={name}
          onChange={setName}
          placeholder="örn: Zeynep"
          required
          maxLength={50}
        />

        <Select
          label="Sınıf"
          value={grade}
          onChange={(value) => setGrade(value as number)}
          options={gradeOptions}
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
