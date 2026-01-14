// Discover Screen - Web-compatible version
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://sokonova-backend-production.up.railway.app';

async function searchProducts(query: string, category?: string) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    params.append('limit', '20');

    const response = await fetch(`${API_URL}/discovery/products-search?${params}`);
    if (!response.ok) throw new Error('Failed to search');
    return response.json();
}

export default function DiscoverScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['products', searchQuery, category],
        queryFn: () => searchProducts(searchQuery, category),
    });

    const products = data?.items || [];
    const categories = ['All', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Food'];

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="🔍 Search products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={() => refetch()}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                        <Text>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Category Filters */}
            <View style={styles.categoryList}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.categoryChip,
                            (cat === 'All' && !category) || cat.toLowerCase() === category?.toLowerCase()
                                ? styles.categoryActive
                                : null,
                        ]}
                        onPress={() => setCategory(cat === 'All' ? '' : cat.toLowerCase())}
                    >
                        <Text style={[
                            styles.categoryText,
                            (cat === 'All' && !category) || cat.toLowerCase() === category?.toLowerCase()
                                ? styles.categoryTextActive
                                : null,
                        ]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Products Grid */}
            {isLoading ? (
                <ActivityIndicator size="large" color="#10B981" style={styles.loader} />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item: any) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.productGrid}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyIcon}>🔍</Text>
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.productCard}>
                            <Image
                                source={{ uri: item.imageUrl || 'https://via.placeholder.com/200' }}
                                style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.productPrice}>${item.price}</Text>
                                {item.seller?.shopName && (
                                    <Text style={styles.productSeller}>{item.seller.shopName}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        height: 44,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    clearButton: {
        marginLeft: 8,
        padding: 8,
    },
    categoryList: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexWrap: 'wrap',
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        marginBottom: 8,
    },
    categoryActive: {
        backgroundColor: '#10B981',
    },
    categoryText: {
        color: '#6B7280',
        fontSize: 14,
    },
    categoryTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    productGrid: {
        padding: 8,
    },
    productCard: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 140,
        backgroundColor: '#E5E7EB',
    },
    productInfo: {
        padding: 12,
    },
    productTitle: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
    },
    productSeller: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 16,
        marginTop: 12,
    },
});
