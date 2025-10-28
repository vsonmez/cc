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

  const addChild = (name: string, grade: number): Child | null => {
    const newChild = addChildToStorage(name, grade)
    if (newChild) {
      refreshData()
    }
    return newChild
  }

  const updateChild = (childId: string, name: string, grade: number): boolean => {
    const success = updateChildInStorage(childId, name, grade)
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
