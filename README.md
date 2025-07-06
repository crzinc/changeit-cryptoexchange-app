# Changeit - Premium Cryptocurrency Exchange Platform

A modern, full-stack cryptocurrency exchange application built with React, TypeScript, Supabase, and Tailwind CSS. Features real-time trading, user authentication, portfolio management, and stunning animations.

![Changeit Preview](https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200)

## 🚀 Features

### Frontend
- **Modern UI/UX**: Glassmorphism design with smooth animations
- **Real-time Updates**: Supabase real-time subscriptions for live market data
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Animations**: Framer Motion for smooth transitions
- **3D Effects**: Three.js integration for advanced visuals
- **User Authentication**: Secure Supabase Auth integration
- **Portfolio Dashboard**: Real-time portfolio tracking
- **Exchange Interface**: Intuitive crypto trading interface

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Real-time**: Supabase real-time subscriptions
- **Edge Functions**: Serverless functions for exchange logic
- **Security**: RLS policies for data protection
- **API**: Auto-generated REST API

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
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Database-level security
- **Edge Functions** - Serverless compute
- **Real-time** - WebSocket-based subscriptions

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

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

3. **Supabase Setup**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the database migration in the Supabase SQL editor

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
changeit-crypto-exchange/
├── src/
│   ├── components/               # React components
│   │   ├── Auth/                # Authentication components
│   │   ├── Dashboard/           # User dashboard
│   │   └── ...                  # Other UI components
│   ├── context/                 # React context providers
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Library configurations
│   ├── services/                # API service layer
│   └── ...
├── supabase/
│   ├── migrations/              # Database migrations
│   └── functions/               # Edge functions
├── public/                      # Static assets
└── ...
```

## 🗄 Database Schema

### Tables

#### Users
- `id` (uuid, primary key)
- `email` (text, unique)
- `name` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### Wallets
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `currency` (text)
- `balance` (decimal)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### Transactions
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `type` (text: exchange, deposit, withdrawal)
- `from_currency` (text)
- `to_currency` (text)
- `from_amount` (decimal)
- `to_amount` (decimal)
- `rate` (decimal)
- `status` (text: pending, completed, failed)
- `created_at` (timestamptz)
- `completed_at` (timestamptz)

#### Market Data
- `id` (uuid, primary key)
- `symbol` (text, unique)
- `name` (text)
- `price` (decimal)
- `change_24h` (decimal)
- `volume_24h` (decimal)
- `market_cap` (decimal)
- `updated_at` (timestamptz)

#### Exchange Rates
- `id` (uuid, primary key)
- `from_currency` (text)
- `to_currency` (text)
- `rate` (decimal)
- `updated_at` (timestamptz)

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Supabase Auth**: Secure authentication system
- **JWT Tokens**: Stateless authentication
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries via Supabase

## 🚀 Deployment

### Vercel Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

3. **Environment Variables for Production**
   ```env
   VITE_SUPABASE_URL=your-production-supabase-url
   VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
   ```

### Supabase Edge Functions

Deploy the edge functions to Supabase:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy functions
supabase functions deploy market-updates
supabase functions deploy execute-exchange
```

## 🔄 Real-time Features

The application includes Supabase real-time subscriptions for:
- **Live Market Data**: Real-time price updates
- **Portfolio Updates**: Instant balance updates after trades
- **Transaction Status**: Live transaction status updates
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

## 🧪 API Endpoints (Supabase)

### Authentication
- Supabase Auth handles all authentication
- Email/password sign up and sign in
- JWT token management

### Database Operations
- Auto-generated REST API via Supabase
- Real-time subscriptions
- Row Level Security policies

### Edge Functions
- `/functions/v1/market-updates` - Update market data
- `/functions/v1/execute-exchange` - Execute trades

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend-as-a-Service platform
- **Vercel** - Frontend deployment platform
- **Design Inspiration**: Modern crypto exchange platforms
- **Icons**: Lucide React icon library
- **Images**: Pexels for stock photography
- **Animations**: Framer Motion community examples

## 📞 Support

For support, create an issue in the GitHub repository or contact the development team.

## 🔮 Future Enhancements

- [ ] Advanced charting with TradingView integration
- [ ] Mobile app with React Native
- [ ] Advanced order types (limit, stop-loss)
- [ ] Social trading features
- [ ] DeFi protocol integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Push notifications
- [ ] Automated testing suite
- [ ] Performance monitoring

---

**Built with ❤️ using Supabase and modern web technologies**