import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { Product, CartItem } from '@types';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - 32) / 2;

export const ShopScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'products' | 'cart' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'fashion', name: 'Fashion', icon: 'checkroom' },
    { id: 'electronics', name: 'Electronics', icon: 'devices' },
    { id: 'home', name: 'Home', icon: 'home' },
    { id: 'beauty', name: 'Beauty', icon: 'face' },
    { id: 'sports', name: 'Sports', icon: 'sports' },
    { id: 'books', name: 'Books', icon: 'menu-book' },
  ];

  const tabs = [
    { key: 'products', label: 'Products', icon: 'store' },
    { key: 'cart', label: 'Cart', icon: 'shopping-cart' },
    { key: 'orders', label: 'Orders', icon: 'receipt' },
  ] as const;

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 199.99,
          currency: 'USD',
          category: 'electronics',
          tags: ['audio', 'wireless', 'headphones'],
          images: ['https://example.com/headphones.jpg'],
          inventory: 50,
          isDigital: false,
          seller: {
            id: 'seller1',
            username: 'techstore',
            avatar: 'https://example.com/seller.jpg',
          },
          rating: 4.5,
          reviewCount: 128,
          isAvailable: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Designer T-Shirt',
          description: 'Premium cotton t-shirt with unique design',
          price: 29.99,
          currency: 'USD',
          category: 'fashion',
          tags: ['clothing', 't-shirt', 'designer'],
          images: ['https://example.com/tshirt.jpg'],
          inventory: 100,
          isDigital: false,
          seller: {
            id: 'seller2',
            username: 'fashionstore',
            avatar: 'https://example.com/seller2.jpg',
          },
          rating: 4.2,
          reviewCount: 89,
          isAvailable: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCartItems(prev => prev.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems(prev => [...prev, {
        id: Date.now().toString(),
        product,
        quantity: 1,
        addedAt: new Date().toISOString(),
      }]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCartItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.productRating}>
          <Icon name="star" size={14} color={colors.warning} />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Icon name="add-shopping-cart" size={16} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.images[0] }} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.cartItemPrice}>${item.product.price.toFixed(2)}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Icon name="remove" size={16} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Icon name="add" size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromCart(item.id)}
      >
        <Icon name="close" size={20} color={colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Shop</Text>
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
          placeholderTextColor={colors.text.disabled}
        />
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === item.id && styles.activeCategoryItem,
            ]}
            onPress={() => setSelectedCategory(item.id === 'all' ? null : item.id)}
          >
            <Icon
              name={item.icon}
              size={20}
              color={selectedCategory === item.id ? '#FFFFFF' : colors.text.secondary}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item.id && styles.activeCategoryText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Icon
            name={tab.icon}
            size={20}
            color={activeTab === tab.key ? colors.primary : colors.text.secondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
          {tab.key === 'cart' && cartItems.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={loadProducts}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={styles.productsList}
          />
        );
      
      case 'cart':
        return (
          <View style={styles.cartContainer}>
            {cartItems.length > 0 ? (
              <>
                <FlatList
                  data={cartItems}
                  renderItem={renderCartItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
                <View style={styles.cartFooter}>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>${getCartTotal().toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Checkout</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="shopping-cart" size={64} color={colors.text.disabled} />
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <Text style={styles.emptySubtext}>
                  Add some products to get started
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'orders':
        return (
          <View style={styles.emptyContainer}>
            <Icon name="receipt" size={64} color={colors.text.disabled} />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Your order history will appear here
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    headerTitle: {
      ...typography.textStyles.h3,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray[100],
      borderRadius: 20,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    searchInput: {
      flex: 1,
      ...typography.textStyles.body,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    categoriesContainer: {
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    categoriesList: {
      paddingHorizontal: spacing.md,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      backgroundColor: colors.gray[100],
      borderRadius: 20,
    },
    activeCategoryItem: {
      backgroundColor: colors.primary,
    },
    categoryText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    activeCategoryText: {
      color: '#FFFFFF',
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      position: 'relative',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    activeTabText: {
      color: colors.primary,
    },
    badge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
      fontSize: 12,
    },
    content: {
      flex: 1,
    },
    productsList: {
      padding: spacing.md,
    },
    productItem: {
      width: PRODUCT_WIDTH,
      backgroundColor: colors.background.primary,
      borderRadius: 8,
      marginBottom: spacing.md,
      marginRight: spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    productImage: {
      width: '100%',
      height: 120,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      backgroundColor: colors.gray[200],
    },
    productInfo: {
      padding: spacing.sm,
    },
    productName: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    productPrice: {
      ...typography.textStyles.h6,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    productRating: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    ratingText: {
      ...typography.textStyles.caption,
      color: colors.text.primary,
      marginLeft: spacing.xs,
    },
    reviewCount: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    addToCartButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 4,
      paddingVertical: spacing.xs,
    },
    addToCartText: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
      marginLeft: spacing.xs,
    },
    cartContainer: {
      flex: 1,
    },
    cartItem: {
      flexDirection: 'row',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    cartItemImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: colors.gray[200],
      marginRight: spacing.md,
    },
    cartItemInfo: {
      flex: 1,
    },
    cartItemName: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    cartItemPrice: {
      ...typography.textStyles.h6,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.gray[100],
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityText: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      marginHorizontal: spacing.sm,
    },
    removeButton: {
      padding: spacing.sm,
    },
    cartFooter: {
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    totalLabel: {
      ...typography.textStyles.h5,
      color: colors.text.primary,
    },
    totalAmount: {
      ...typography.textStyles.h4,
      color: colors.primary,
    },
    checkoutButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    checkoutText: {
      ...typography.textStyles.button,
      color: '#FFFFFF',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      ...typography.textStyles.h4,
      color: colors.text.primary,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    emptySubtext: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderCategories()}
      {renderTabs()}
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
};