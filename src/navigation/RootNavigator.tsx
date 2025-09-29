import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { RootStackParamList } from '@types';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
