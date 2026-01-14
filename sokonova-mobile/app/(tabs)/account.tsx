// Account Screen
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../lib/auth';

export default function AccountScreen() {
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    }
                },
            ]
        );
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.authContainer}>
                <Ionicons name="person-circle-outline" size={80} color="#D1D5DB" />
                <Text style={styles.authTitle}>Welcome to SOKONOVA</Text>
                <Text style={styles.authText}>Login or create an account to manage your orders</Text>

                <Link href="/auth/login" asChild>
                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/auth/register" asChild>
                    <TouchableOpacity style={styles.registerButton}>
                        <Text style={styles.registerButtonText}>Create Account</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{user?.role}</Text>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menu}>
                <MenuItem icon="receipt-outline" title="My Orders" subtitle="View order history" />
                <MenuItem icon="heart-outline" title="Wishlist" subtitle="Saved items" />
                <MenuItem icon="location-outline" title="Addresses" subtitle="Manage delivery addresses" />
                <MenuItem icon="card-outline" title="Payment Methods" subtitle="Manage payment options" />
                <MenuItem icon="notifications-outline" title="Notifications" subtitle="Notification preferences" />

                {user?.role === 'SELLER' && (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.sectionTitle}>Seller</Text>
                        <MenuItem icon="storefront-outline" title="My Shop" subtitle="Manage your store" />
                        <MenuItem icon="stats-chart-outline" title="Analytics" subtitle="View performance" />
                        <MenuItem icon="cube-outline" title="Products" subtitle="Manage inventory" />
                    </>
                )}

                <View style={styles.divider} />
                <MenuItem icon="help-circle-outline" title="Help & Support" subtitle="Get assistance" />
                <MenuItem icon="document-text-outline" title="Terms & Privacy" subtitle="Legal information" />
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.version}>SOKONOVA v1.0.0</Text>
            </View>
        </ScrollView>
    );
}

function MenuItem({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
    return (
        <TouchableOpacity style={styles.menuItem}>
            <Ionicons name={icon as any} size={24} color="#6B7280" />
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    authContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 16,
    },
    authText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 32,
    },
    loginButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#10B981',
        width: '100%',
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#10B981',
        fontWeight: '600',
        fontSize: 16,
    },
    header: {
        backgroundColor: '#10B981',
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#10B981',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12,
    },
    userEmail: {
        fontSize: 14,
        color: '#D1FAE5',
        marginTop: 4,
    },
    roleBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    roleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    menu: {
        backgroundColor: '#fff',
        marginTop: 16,
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuContent: {
        flex: 1,
        marginLeft: 16,
    },
    menuTitle: {
        fontSize: 16,
        color: '#111827',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    divider: {
        height: 8,
        backgroundColor: '#F9FAFB',
        marginHorizontal: -16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        paddingTop: 16,
        paddingBottom: 8,
        textTransform: 'uppercase',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginTop: 16,
        padding: 16,
        gap: 8,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        padding: 24,
    },
    version: {
        color: '#9CA3AF',
        fontSize: 12,
    },
});
