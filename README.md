# Changeit - Premium Cryptocurrency Exchange Platform

A full-stack cryptocurrency exchange application built with React, Node.js, and modern web technologies. Features real-time trading, user authentication, portfolio management, and stunning animations.

![Changeit Preview](https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200)

## 🚀 Features

### Frontend
- **Modern UI/UX**: Glassmorphism design with smooth animations
- **Real-time Updates**: WebSocket integration for live market data
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Animations**: Framer Motion for smooth transitions
- **3D Effects**: Three.js integration for advanced visuals
- **User Authentication**: Secure login/register system
- **Portfolio Dashboard**: Real-time portfolio tracking
- **Exchange Interface**: Intuitive crypto trading interface

### Backend
- **RESTful API**: Express.js with comprehensive endpoints
- **Real-time Communication**: WebSocket server for live updates
- **User Management**: JWT-based authentication system
- **Database**: SQLite with proper schema design
- **Security**: Helmet, CORS, and bcrypt integration
- **Market Data**: Simulated real-time price feeds
- **Transaction System**: Complete exchange functionality

## 🛠 Tech Stack

### Frontend
- **React 18** - Component-based UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics and WebGL effects
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **WebSocket** - Real-time communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks for price updates

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd changeit-crypto-exchange
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   DATABASE_URL=./database.sqlite
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the frontend (port 5173) and backend (port 3001) concurrently.

## 🏗 Project Structure

```
changeit-crypto-exchange/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── Auth/                # Authentication components
│   │   ├── Dashboard/           # User dashboard
│   │   └── ...                  # Other UI components
│   ├── context/                 # React context providers
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service layer
│   └── ...
├── server/                      # Backend source code
│   ├── routes/                  # API route handlers
│   ├── services/                # Business logic services
│   ├── middleware/              # Express middleware
│   ├── database/                # Database configuration
│   └── index.js                 # Server entry point
├── public/                      # Static assets
└── ...
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Exchange
- `GET /api/exchange/rate/:from/:to` - Get exchange rate
- `POST /api/exchange/execute` - Execute trade
- `GET /api/exchange/history` - Get trade history

### Market Data
- `GET /api/market/data` - Get all market data
- `GET /api/market/data/:symbol` - Get specific currency data
- `GET /api/market/trending` - Get trending currencies

### User Management
- `GET /api/user/profile` - Get user profile
- `GET /api/user/wallets` - Get user wallets
- `GET /api/user/transactions` - Get user transactions
- `PUT /api/user/profile` - Update user profile

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet**: Security headers for Express.js
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries

## 📊 Database Schema

### Users Table
- `id` - Unique user identifier
- `email` - User email (unique)
- `password` - Hashed password
- `name` - User display name
- `created_at` - Account creation timestamp

### Wallets Table
- `id` - Wallet identifier
- `user_id` - Foreign key to users
- `currency` - Cryptocurrency symbol
- `balance` - Current balance
- `created_at` - Wallet creation timestamp

### Transactions Table
- `id` - Transaction identifier
- `user_id` - Foreign key to users
- `type` - Transaction type (exchange, deposit, withdrawal)
- `from_currency` - Source currency
- `to_currency` - Target currency
- `from_amount` - Source amount
- `to_amount` - Target amount
- `rate` - Exchange rate used
- `status` - Transaction status
- `created_at` - Transaction timestamp

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-domain.com
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=./production-database.sqlite
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔄 Real-time Features

The application includes WebSocket integration for:
- **Live Market Data**: Real-time price updates every 30 seconds
- **Portfolio Updates**: Instant balance updates after trades
- **Connection Status**: Visual indicator of WebSocket connection
- **Automatic Reconnection**: Handles connection drops gracefully

## 🎨 Design System

### Color Palette
- **Primary**: Cyan (400-500) - `#06b6d4` to `#0891b2`
- **Secondary**: Purple (400-500) - `#8b5cf6` to `#7c3aed`
- **Accent**: Pink (400-500) - `#ec4899` to `#db2777`
- **Background**: Slate (800-900) - `#1e293b` to `#0f172a`
- **Success**: Green (400-500) - `#22c55e` to `#16a34a`
- **Warning**: Yellow (400-500) - `#eab308` to `#ca8a04`
- **Error**: Red (400-500) - `#ef4444` to `#dc2626`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900
- **Scale**: Responsive typography with clamp() functions

### Animations
- **Entrance**: Fade in with slide up
- **Hover States**: Scale and glow effects
- **Loading**: Smooth spinner animations
- **Transitions**: 300ms ease-in-out for most interactions

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Test market data
curl http://localhost:3001/api/market/data
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern crypto exchange platforms
- **Icons**: Lucide React icon library
- **Images**: Pexels for stock photography
- **Animations**: Framer Motion community examples
- **3D Effects**: Three.js documentation and examples

## 📞 Support

For support, email support@changeit.com or join our Discord community.

## 🔮 Future Enhancements

- [ ] Advanced charting with TradingView integration
- [ ] Mobile app with React Native
- [ ] Advanced order types (limit, stop-loss)
- [ ] Social trading features
- [ ] DeFi protocol integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and caching
- [ ] Automated testing suite
- [ ] Performance monitoring

---

**Built with ❤️ by the Changeit Team**