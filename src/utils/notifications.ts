import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/theme';

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string; // "HH:MM" format
  wordOfTheDay: boolean;
  quizReminder: boolean;
  streakReminder: boolean;
}

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'daily' | 'word' | 'quiz' | 'streak';
  timestamp: number;
  read: boolean;
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  dailyReminder: true,
  reminderTime: '09:00',
  wordOfTheDay: true,
  quizReminder: true,
  streakReminder: true,
};

export class NotificationManager {
  static async getSettings(): Promise<NotificationSettings> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return settings ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(settings) } : DEFAULT_NOTIFICATION_SETTINGS;
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  }

  static async saveSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  }

  static async scheduleDailyReminder(): Promise<void> {
    // This would integrate with a notification library like expo-notifications
    // For now, we'll just store the reminder data
    const settings = await this.getSettings();
    if (settings.enabled && settings.dailyReminder) {
      console.log('Scheduling daily reminder for:', settings.reminderTime);
      // Implementation would go here
    }
  }

  static async sendWordOfTheDayNotification(word: string, meaning: string): Promise<void> {
    const settings = await this.getSettings();
    if (settings.enabled && settings.wordOfTheDay) {
      const notification: NotificationData = {
        id: `word_${Date.now()}`,
        title: '오늘의 단어',
        body: `${word} - ${meaning}`,
        type: 'word',
        timestamp: Date.now(),
        read: false,
      };
      
      await this.saveNotification(notification);
      console.log('Word of the day notification sent:', notification);
    }
  }

  static async sendQuizReminderNotification(): Promise<void> {
    const settings = await this.getSettings();
    if (settings.enabled && settings.quizReminder) {
      const notification: NotificationData = {
        id: `quiz_${Date.now()}`,
        title: '퀴즈 시간!',
        body: '오늘도 영어 단어 퀴즈를 풀어보세요!',
        type: 'quiz',
        timestamp: Date.now(),
        read: false,
      };
      
      await this.saveNotification(notification);
      console.log('Quiz reminder notification sent:', notification);
    }
  }

  static async sendStreakReminderNotification(streakDays: number): Promise<void> {
    const settings = await this.getSettings();
    if (settings.enabled && settings.streakReminder && streakDays > 0) {
      const notification: NotificationData = {
        id: `streak_${Date.now()}`,
        title: '연속 학습 기록',
        body: `${streakDays}일 연속 학습 중입니다! 오늘도 화이팅!`,
        type: 'streak',
        timestamp: Date.now(),
        read: false,
      };
      
      await this.saveNotification(notification);
      console.log('Streak reminder notification sent:', notification);
    }
  }

  private static async saveNotification(notification: NotificationData): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      notifications.unshift(notification);
      
      // Keep only last 50 notifications
      const trimmedNotifications = notifications.slice(0, 50);
      
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.NOTIFICATIONS}_data`,
        JSON.stringify(trimmedNotifications)
      );
    } catch (error) {
      console.error('Failed to save notification:', error);
    }
  }

  static async getNotifications(): Promise<NotificationData[]> {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.NOTIFICATIONS}_data`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load notifications:', error);
      return [];
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.NOTIFICATIONS}_data`,
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  static async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${STORAGE_KEYS.NOTIFICATIONS}_data`);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }
} 