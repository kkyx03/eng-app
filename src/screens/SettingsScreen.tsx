import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { NotificationManager, NotificationSettings } from '../utils/notifications';
import { useAppStore } from '../store/useAppStore';
import { SettingsScreenProps } from '../types/navigation';

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { theme, themeMode, isDark, toggleTheme, setThemeMode } = useTheme();
  const { clearAllData } = useAppStore();
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    dailyReminder: true,
    reminderTime: '09:00',
    wordOfTheDay: true,
    quizReminder: true,
    streakReminder: true,
  });

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    const settings = await NotificationManager.getSettings();
    setNotificationSettings(settings);
  };

  const handleNotificationSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    await NotificationManager.saveSettings(newSettings);
  };

  const handleThemeModeChange = async (mode: 'light' | 'dark' | 'auto') => {
    await setThemeMode(mode);
  };

  const handleClearData = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 학습 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('완료', '모든 데이터가 삭제되었습니다.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    Alert.alert('준비 중', '데이터 내보내기 기능은 준비 중입니다.');
  };

  const handleImportData = () => {
    // TODO: Implement data import functionality
    Alert.alert('준비 중', '데이터 가져오기 기능은 준비 중입니다.');
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>설정</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Theme Settings */}
        <Card variant="default" style={styles.section}>
          <Text style={styles.sectionTitle}>테마</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={20} color={theme.textPrimary} />
              <Text style={styles.settingLabel}>다크모드</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.borderColor, true: theme.infoColor }}
              thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={styles.themeModeButtons}>
            {(['light', 'dark', 'auto'] as const).map((mode) => (
              <Button
                key={mode}
                title={mode === 'light' ? '라이트' : mode === 'dark' ? '다크' : '자동'}
                onPress={() => handleThemeModeChange(mode)}
                variant={themeMode === mode ? 'primary' : 'outline'}
                size="small"
                style={styles.themeButton}
              />
            ))}
          </View>
        </Card>

        {/* Notification Settings */}
        <Card variant="default" style={styles.section}>
          <Text style={styles.sectionTitle}>알림</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color={theme.textPrimary} />
              <Text style={styles.settingLabel}>알림 활성화</Text>
            </View>
            <Switch
              value={notificationSettings.enabled}
              onValueChange={(value) => handleNotificationSettingChange('enabled', value)}
              trackColor={{ false: theme.borderColor, true: theme.infoColor }}
              thumbColor={notificationSettings.enabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          {notificationSettings.enabled && (
            <>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="time" size={20} color={theme.textPrimary} />
                  <Text style={styles.settingLabel}>일일 학습 알림</Text>
                </View>
                <Switch
                  value={notificationSettings.dailyReminder}
                  onValueChange={(value) => handleNotificationSettingChange('dailyReminder', value)}
                  trackColor={{ false: theme.borderColor, true: theme.infoColor }}
                  thumbColor={notificationSettings.dailyReminder ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="book" size={20} color={theme.textPrimary} />
                  <Text style={styles.settingLabel}>오늘의 단어 알림</Text>
                </View>
                <Switch
                  value={notificationSettings.wordOfTheDay}
                  onValueChange={(value) => handleNotificationSettingChange('wordOfTheDay', value)}
                  trackColor={{ false: theme.borderColor, true: theme.infoColor }}
                  thumbColor={notificationSettings.wordOfTheDay ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="help-circle" size={20} color={theme.textPrimary} />
                  <Text style={styles.settingLabel}>퀴즈 알림</Text>
                </View>
                <Switch
                  value={notificationSettings.quizReminder}
                  onValueChange={(value) => handleNotificationSettingChange('quizReminder', value)}
                  trackColor={{ false: theme.borderColor, true: theme.infoColor }}
                  thumbColor={notificationSettings.quizReminder ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="flame" size={20} color={theme.textPrimary} />
                  <Text style={styles.settingLabel}>연속 학습 알림</Text>
                </View>
                <Switch
                  value={notificationSettings.streakReminder}
                  onValueChange={(value) => handleNotificationSettingChange('streakReminder', value)}
                  trackColor={{ false: theme.borderColor, true: theme.infoColor }}
                  thumbColor={notificationSettings.streakReminder ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            </>
          )}
        </Card>

        {/* Data Management */}
        <Card variant="default" style={styles.section}>
          <Text style={styles.sectionTitle}>데이터 관리</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="download" size={20} color={theme.textPrimary} />
              <Text style={styles.settingLabel}>데이터 내보내기</Text>
            </View>
            <TouchableOpacity onPress={handleExportData}>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="upload" size={20} color={theme.textPrimary} />
              <Text style={styles.settingLabel}>데이터 가져오기</Text>
            </View>
            <TouchableOpacity onPress={handleImportData}>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash" size={20} color={theme.errorColor} />
              <Text style={[styles.settingLabel, { color: theme.errorColor }]}>데이터 초기화</Text>
            </View>
            <TouchableOpacity onPress={handleClearData}>
              <Ionicons name="chevron-forward" size={20} color={theme.errorColor} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* App Info */}
        <Card variant="default" style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle" size={20} color={theme.textPrimary} />
              <Text style={styles.settingLabel}>버전</Text>
            </View>
            <Text style={styles.settingValue}>2.0.0</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="code" size={20} color={theme.textPrimary} />
              <Text style={styles.settingLabel}>개발자</Text>
            </View>
            <Text style={styles.settingValue}>React Native & TypeScript 전문가</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.textPrimary,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  themeModeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  themeButton: {
    flex: 1,
  },
}); 