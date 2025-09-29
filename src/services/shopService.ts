import { Product, Order, CartItem, PaymentMethod, ShippingAddress } from '@types';

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  images: string[];
  inventory: number;
  isDigital: boolean;
  shippingInfo?: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  };
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export interface OrderResponse {
  order: Order;
  paymentIntent?: {
    clientSecret: string;
    id: string;
  };
}

export interface ProductsResponse {
  products: Product[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount: number;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

class ShopService {
  private baseUrl = 'http://localhost:3000/api';

  // Product Management
  async getProducts(cursor?: string, category?: string, search?: string): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`${this.baseUrl}/shop/products?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return await response.json();
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  async getProduct(productId: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      return await response.json();
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      return await response.json();
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  async updateProduct(productData: UpdateProductRequest): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/products/${productData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      return await response.json();
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  // Cart Management
  async getCart(): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    }
  }

  async addToCart(productId: string, quantity: number = 1): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  }

  async updateCartItem(itemId: string, quantity: number): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      return await response.json();
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    }
  }

  async removeFromCart(itemId: string): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/cart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }

  // Order Management
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  async getOrders(cursor?: string): Promise<{ orders: Order[]; nextCursor?: string; hasMore: boolean }> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/shop/orders?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      return await response.json();
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/payment-methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  }

  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(paymentMethod),
      });

      if (!response.ok) {
        throw new Error('Failed to add payment method');
      }

      return await response.json();
    } catch (error) {
      console.error('Add payment method error:', error);
      throw error;
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment method');
      }
    } catch (error) {
      console.error('Delete payment method error:', error);
      throw error;
    }
  }

  // Shipping Addresses
  async getShippingAddresses(): Promise<ShippingAddress[]> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/shipping-addresses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shipping addresses');
      }

      return await response.json();
    } catch (error) {
      console.error('Get shipping addresses error:', error);
      throw error;
    }
  }

  async addShippingAddress(address: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/shipping-addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error('Failed to add shipping address');
      }

      return await response.json();
    } catch (error) {
      console.error('Add shipping address error:', error);
      throw error;
    }
  }

  async updateShippingAddress(addressId: string, address: Partial<ShippingAddress>): Promise<ShippingAddress> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/shipping-addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error('Failed to update shipping address');
      }

      return await response.json();
    } catch (error) {
      console.error('Update shipping address error:', error);
      throw error;
    }
  }

  async deleteShippingAddress(addressId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/shipping-addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete shipping address');
      }
    } catch (error) {
      console.error('Delete shipping address error:', error);
      throw error;
    }
  }

  // Coupons and Discounts
  async validateCoupon(couponCode: string): Promise<{ valid: boolean; discount: number; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/shop/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ couponCode }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate coupon');
      }

      return await response.json();
    } catch (error) {
      console.error('Validate coupon error:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export const shopService = new ShopService();
