const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: { email: string; password: string; name: string }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Exchange methods
  async getExchangeRate(from: string, to: string) {
    return this.request(`/exchange/rate/${from}/${to}`);
  }

  async executeExchange(exchangeData: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
  }) {
    return this.request('/exchange/execute', {
      method: 'POST',
      body: JSON.stringify(exchangeData),
    });
  }

  async getExchangeHistory() {
    return this.request('/exchange/history');
  }

  // Market methods
  async getMarketData() {
    return this.request('/market/data');
  }

  async getCurrencyData(symbol: string) {
    return this.request(`/market/data/${symbol}`);
  }

  async getTrendingCurrencies() {
    return this.request('/market/trending');
  }

  // User methods
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async getUserWallets() {
    return this.request('/user/wallets');
  }

  async getUserTransactions(limit = 50, offset = 0) {
    return this.request(`/user/transactions?limit=${limit}&offset=${offset}`);
  }

  async updateUserProfile(profileData: { name: string }) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();