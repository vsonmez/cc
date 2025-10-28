import { useAppData } from './useAppData'
import {
  getChildren,
  getChildById,
  addChild as addChildToStorage,
  updateChild as updateChildInStorage,
  deleteChild as deleteChildFromStorage
} from '../../core/storage/repository'
import type { Child } from '../../core/models/child'

export function useChildren() {
  const { refreshData } = useAppData()

  const children = getChildren()

  const addChild = (childName: string, childGrade: number): Child | null => {
    const newChild = addChildToStorage(childName, childGrade)
    if (newChild) {
      refreshData()
    }
    return newChild
  }

  const updateChild = (childId: string, childName: string, childGrade: number): boolean => {
    const success = updateChildInStorage(childId, childName, childGrade)
    if (success) {
      refreshData()
    }
    return success
  }

  const deleteChild = (childId: string): boolean => {
    const success = deleteChildFromStorage(childId)
    if (success) {
      refreshData()
    }
    return success
  }

  const getChild = (childId: string): Child | null => {
    return getChildById(childId)
  }

  return {
    children,
    addChild,
    updateChild,
    deleteChild,
    getChild
  }
}
