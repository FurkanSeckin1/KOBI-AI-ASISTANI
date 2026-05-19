import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Sparkles, BarChart2, PieChart, CheckSquare } from 'lucide-react-native';

import OpportunitiesScreen from '../screens/OpportunitiesScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ChartsScreen from '../screens/ChartsScreen';
import ActionPlanScreen from '../screens/ActionPlanScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#eab308', // yellow-500
        tabBarInactiveTintColor: '#94a3b8', // slate-400
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9', // slate-100
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 10,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 4,
        }
      }}
    >
      <Tab.Screen 
        name="Fırsatlar" 
        component={OpportunitiesScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Özet" 
        component={SummaryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Grafikler" 
        component={ChartsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <PieChart size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="To-Do" 
        component={ActionPlanScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}
