import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// 화면 컴포넌트들
import HomeScreen from '../screens/HomeScreen';
import WordListScreen from '../screens/WordListScreen';
import QuizScreen from '../screens/QuizScreen';
import WrongAnswersScreen from '../screens/WrongAnswersScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// 타입 정의
export type RootStackParamList = {
  MainTabs: undefined;
  WrongAnswers: undefined;
  Stats: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  WordList: undefined;
  Quiz: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// 메인 탭 네비게이터
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'WordList') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Quiz') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: '홈' }}
      />
      <Tab.Screen 
        name="WordList" 
        component={WordListScreen}
        options={{ tabBarLabel: '단어장' }}
      />
      <Tab.Screen 
        name="Quiz" 
        component={QuizScreen}
        options={{ tabBarLabel: '퀴즈' }}
      />
    </Tab.Navigator>
  );
}

// 루트 스택 네비게이터
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen 
          name="WrongAnswers" 
          component={WrongAnswersScreen}
          options={{
            headerShown: true,
            title: '오답노트',
            headerBackTitle: '뒤로',
          }}
        />
        <Stack.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{
            headerShown: true,
            title: '학습 통계',
            headerBackTitle: '뒤로',
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 