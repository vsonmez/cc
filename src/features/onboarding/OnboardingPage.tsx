import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../ui/components/Input'
import { Select } from '../../ui/components/Select'
import { Button } from '../../ui/components/Button'
import { useChildren } from '../../ui/hooks/useChildren'
import { validateChild } from '../../core/models/child'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { addChild } = useChildren()

  const [name, setName] = useState('')
  const [grade, setGrade] = useState(1)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const validationError = validateChild(name, grade)

    if (validationError) {
      setError(validationError)
      return
    }

    const newChild = addChild(name, grade)

    if (!newChild) {
      setError('Çocuk eklenirken bir hata oluştu')
      return
    }

    // Why: Navigate to main tasks page after successful onboarding
    navigate('/')
  }

  const gradeOptions = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: `${index + 1}. Sınıf`
  }))

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hoş Geldiniz! 🎒
          </h1>
          <p className="text-gray-600">
            Çocuğunuzun ödevlerini kolayca takip edin
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Çocuğunuzun Adı"
            value={name}
            onChange={setName}
            placeholder="örn: Ahmet"
            required
            maxLength={50}
          />

          <Select
            label="Sınıfı"
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

          <Button onClick={handleSubmit} className="w-full">
            Başla
          </Button>
        </div>
      </div>
    </div>
  )
}
