export type TaskCategoryType =
  | 'general_homework'
  | 'written_exam'
  | 'oral_exam'
  | 'project'
  | 'activity_assignment'
  | 'reading'
  | 'research'
  | 'presentation';

export interface TaskCategory {
  categoryType: TaskCategoryType;
  displayName: string;
  description: string;
  iconName: string;
  colorClass: string;
  pointMultiplier: number;
}

export const TASK_CATEGORIES: readonly TaskCategory[] = [
  {
    categoryType: 'general_homework',
    displayName: 'Genel Ödev',
    description: 'Günlük ders çalışması ve alıştırmalar',
    iconName: 'BookOpen',
    colorClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    pointMultiplier: 1.0
  },
  {
    categoryType: 'written_exam',
    displayName: 'Yazılı',
    description: 'Yazılı sınav hazırlığı',
    iconName: 'FileText',
    colorClass: 'bg-red-50 text-red-700 border border-red-200',
    pointMultiplier: 2.0
  },
  {
    categoryType: 'oral_exam',
    displayName: 'Sözlü',
    description: 'Sözlü sınav hazırlığı',
    iconName: 'Mic',
    colorClass: 'bg-purple-50 text-purple-700 border border-purple-200',
    pointMultiplier: 1.5
  },
  {
    categoryType: 'project',
    displayName: 'Proje',
    description: 'Uzun süreli proje çalışması',
    iconName: 'Briefcase',
    colorClass: 'bg-orange-50 text-orange-700 border border-orange-200',
    pointMultiplier: 2.5
  },
  {
    categoryType: 'activity_assignment',
    displayName: 'Etkinlik',
    description: 'Etkinlik ve uygulamalı çalışmalar',
    iconName: 'Palette',
    colorClass: 'bg-green-50 text-green-700 border border-green-200',
    pointMultiplier: 1.2
  },
  {
    categoryType: 'reading',
    displayName: 'Okuma',
    description: 'Kitap okuma ve özet hazırlama',
    iconName: 'Book',
    colorClass: 'bg-teal-50 text-teal-700 border border-teal-200',
    pointMultiplier: 1.0
  },
  {
    categoryType: 'research',
    displayName: 'Araştırma',
    description: 'Konu araştırması ve rapor hazırlama',
    iconName: 'Search',
    colorClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    pointMultiplier: 1.8
  },
  {
    categoryType: 'presentation',
    displayName: 'Sunum',
    description: 'Sunum hazırlama ve sunma',
    iconName: 'Presentation',
    colorClass: 'bg-pink-50 text-pink-700 border border-pink-200',
    pointMultiplier: 2.0
  }
] as const;
