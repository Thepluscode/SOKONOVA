// Root Layout - App Entry Point
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../lib/auth';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 2,
        },
    },
});

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="auth/login" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="auth/register" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="product/[id]" options={{ headerShown: true, title: 'Product' }} />
                </Stack>
            </AuthProvider>
        </QueryClientProvider>
    );
}
