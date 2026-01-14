// Cart Screen - Web-compatible version
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../lib/auth';

const MOCK_CART = [
    { id: '1', title: 'African Print Dress', price: 45.00, quantity: 1, image: 'https://via.placeholder.com/100' },
    { id: '2', title: 'Handmade Beads', price: 25.00, quantity: 2, image: 'https://via.placeholder.com/100' },
];

export default function CartScreen() {
    const { isAuthenticated } = useAuth();
    const cartItems = MOCK_CART;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    if (!isAuthenticated) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🛒</Text>
                <Text style={styles.emptyTitle}>Your cart is waiting</Text>
                <Text style={styles.emptyText}>Login to view your cart</Text>
                <Link href="/auth/login" asChild>
                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        );
    }

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🛒</Text>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptyText}>Start shopping to add items</Text>
                <Link href="/discover" asChild>
                    <TouchableOpacity style={styles.shopButton}>
                        <Text style={styles.shopButtonText}>Browse Products</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                            <View style={styles.quantityRow}>
                                <TouchableOpacity style={styles.qtyButton}>
                                    <Text>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                <TouchableOpacity style={styles.qtyButton}>
                                    <Text>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.removeButton}>
                            <Text style={styles.removeText}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyIcon: {
        fontSize: 64,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374151',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    shopButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    shopButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    list: {
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemTitle: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
        marginBottom: 8,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyButton: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        paddingHorizontal: 12,
        fontSize: 14,
        fontWeight: '600',
    },
    removeButton: {
        padding: 8,
    },
    removeText: {
        fontSize: 20,
    },
    summary: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        color: '#6B7280',
        fontSize: 14,
    },
    summaryValue: {
        color: '#374151',
        fontSize: 14,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 12,
        marginTop: 8,
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981',
    },
    checkoutButton: {
        backgroundColor: '#10B981',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
