import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
export default function RootLayout() { return <AuthProvider><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="index" /><Stack.Screen name="login" /><Stack.Screen name="register" /><Stack.Screen name="home" /><Stack.Screen name="jobs" /><Stack.Screen name="job/[id]" /><Stack.Screen name="applications" /><Stack.Screen name="notifications" /><Stack.Screen name="profile" /></Stack></AuthProvider>; }
