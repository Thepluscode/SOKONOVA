// Home Screen
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useAuth } from '../../lib/auth';

// Using direct API call since services might need adjustment for mobile
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://sokonova-backend-production.up.railway.app';

async function fetchFeaturedProducts() {
    const response = await fetch(`${API_URL}/products?limit=10`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
}

export default function HomeScreen() {
    const { user } = useAuth();

    const { data: products, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['featuredProducts'],
        queryFn: fetchFeaturedProducts,
    });

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
        >
            {/* Hero Section */}
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Welcome to SOKONOVA</Text>
                <Text style={styles.heroSubtitle}>
                    {user ? `Hello, ${user.name}!` : 'African Marketplace'}
                </Text>
                <Text style={styles.heroText}>
                    Discover amazing products from trusted sellers across Africa
                </Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <Link href="/discover" asChild>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>🛍️ Shop Now</Text>
                    </TouchableOpacity>
                </Link>
                {!user && (
                    <Link href="/auth/login" asChild>
                        <TouchableOpacity style={[styles.actionButton, styles.actionSecondary]}>
                            <Text style={[styles.actionText, styles.actionTextSecondary]}>👤 Login</Text>
                        </TouchableOpacity>
                    </Link>
                )}
            </View>

            {/* Featured Products */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Products</Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#10B981" style={styles.loader} />
                ) : products?.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productRow}>
                        {products.slice(0, 6).map((product: any) => (
                            <Link key={product.id} href={`/product/${product.id}`} asChild>
                                <TouchableOpacity style={styles.productCard}>
                                    <Image
                                        source={{ uri: product.imageUrl || 'https://via.placeholder.com/150' }}
                                        style={styles.productImage}
                                    />
                                    <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                                    <Text style={styles.productPrice}>${product.price}</Text>
                                </TouchableOpacity>
                            </Link>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.emptyText}>No products available</Text>
                )}
            </View>

            {/* Categories */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.categories}>
                    {['Fashion', 'Electronics', 'Home', 'Beauty', 'Food'].map((cat) => (
                        <Link key={cat} href={`/discover?category=${cat.toLowerCase()}`} asChild>
                            <TouchableOpacity style={styles.categoryChip}>
                                <Text style={styles.categoryText}>{cat}</Text>
                            </TouchableOpacity>
                        </Link>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    hero: {
        backgroundColor: '#10B981',
        padding: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#D1FAE5',
        marginBottom: 8,
    },
    heroText: {
        fontSize: 14,
        color: '#D1FAE5',
    },
    quickActions: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#10B981',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionSecondary: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#10B981',
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    actionTextSecondary: {
        color: '#10B981',
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    loader: {
        padding: 40,
    },
    productRow: {
        marginHorizontal: -8,
    },
    productCard: {
        width: 150,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#E5E7EB',
    },
    productTitle: {
        padding: 8,
        paddingBottom: 4,
        fontSize: 14,
        color: '#374151',
    },
    productPrice: {
        paddingHorizontal: 8,
        paddingBottom: 12,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6B7280',
        padding: 40,
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    categoryText: {
        color: '#374151',
        fontSize: 14,
    },
});
