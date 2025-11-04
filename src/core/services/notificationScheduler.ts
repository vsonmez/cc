import { loadAppData } from '../storage/storage-engine';
import type { Task } from '../models/Task';

export class NotificationScheduler {
  private intervalId: number | null = null;
  private reminderTime: string = '18:00';

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    const data = loadAppData();
    this.reminderTime = data.settings.reminderTime;
  }

  start() {
    // Why: Check every minute if it's time to send notifications
    this.intervalId = window.setInterval(() => {
      this.checkAndSendNotifications();
    }, 60000); // Check every 1 minute

    // Check immediately on start
    this.checkAndSendNotifications();
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private checkAndSendNotifications() {
    const data = loadAppData();

    if (!data.settings.reminderEnabled) {
      return;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Why: Only send notification at the exact reminder time
    if (currentTime !== this.reminderTime) {
      return;
    }

    // Why: Check if we already sent notification today
    const lastNotificationDate = localStorage.getItem('last-notification-date');
    const today = now.toDateString();

    if (lastNotificationDate === today) {
      return; // Already sent today
    }

    // Get incomplete tasks
    const incompleteTasks = this.getIncompleteTasks(data.tasks);

    if (incompleteTasks.length > 0) {
      this.sendNotification(incompleteTasks);
      localStorage.setItem('last-notification-date', today);
    }
  }

  private getIncompleteTasks(tasks: Task[]): Task[] {
    return tasks.filter((task) => !task.completed);
  }

  private sendNotification(tasks: Task[]) {
    if (Notification.permission !== 'granted') {
      return;
    }

    const taskCount = tasks.length;
    const title = 'Ödev Hatırlatıcı 📚';
    const body =
      taskCount === 1
        ? '1 tamamlanmamış ödev var!'
        : `${taskCount} tamamlanmamış ödev var!`;

    // Why: Group tasks by child for better notification
    const tasksByChild = this.groupTasksByChild(tasks);
    const details = Array.from(tasksByChild.entries())
      .map(([childId, childTasks]) => {
        const data = loadAppData();
        const child = data.children.find((c) => c.id === childId);
        const childName = child?.name || 'Bilinmeyen';
        return `${childName}: ${childTasks.length} ödev`;
      })
      .join('\n');

    new Notification(title, {
      body: `${body}\n\n${details}`,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: 'daily-reminder',
      requireInteraction: true
    });
  }

  private groupTasksByChild(tasks: Task[]): Map<string, Task[]> {
    const grouped = new Map<string, Task[]>();

    for (const task of tasks) {
      const existing = grouped.get(task.childId) || [];
      existing.push(task);
      grouped.set(task.childId, existing);
    }

    return grouped;
  }

  updateReminderTime(time: string) {
    this.reminderTime = time;
  }
}

// Singleton instance
export const notificationScheduler = new NotificationScheduler();
