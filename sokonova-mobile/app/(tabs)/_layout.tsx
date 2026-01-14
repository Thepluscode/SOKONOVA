// Tab Layout - Simple version for web testing
import { Slot } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';

export default function TabLayout() {
    const pathname = usePathname();

    return (
        <View style={styles.container}>
            {/* Content */}
            <View style={styles.content}>
                <Slot />
            </View>

            {/* Bottom Tab Bar */}
            <View style={styles.tabBar}>
                <TabButton href="/" label="🏠 Home" active={pathname === '/'} />
                <TabButton href="/discover" label="🔍 Discover" active={pathname === '/discover'} />
                <TabButton href="/cart" label="🛒 Cart" active={pathname === '/cart'} />
                <TabButton href="/account" label="👤 Account" active={pathname === '/account'} />
            </View>
        </View>
    );
}

function TabButton({ href, label, active }: { href: string; label: string; active: boolean }) {
    return (
        <Link href={href as any} asChild>
            <TouchableOpacity style={styles.tab}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingVertical: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    tabText: {
        fontSize: 12,
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#10B981',
        fontWeight: '600',
    },
});
