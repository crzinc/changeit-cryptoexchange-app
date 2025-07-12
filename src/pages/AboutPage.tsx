import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Globe, Award, TrendingUp, Zap } from 'lucide-react'

const AboutPage: React.FC = () => {
  const stats = [
    { value: '10M+', label: 'Active Users', icon: Users },
    { value: '$2.4B', label: '24h Volume', icon: TrendingUp },
    { value: '500+', label: 'Cryptocurrencies', icon: Globe },
    { value: '99.9%', label: 'Uptime', icon: Shield }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Multi-layer security with cold storage, 2FA, and advanced encryption protocols.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute trades in seconds with our optimized matching engine and instant settlement.'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Available worldwide with support for multiple languages and local currencies.'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized as the best crypto exchange platform by industry experts.'
    }
  ]

  const team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Founder',
      bio: 'Former Goldman Sachs executive with 15+ years in fintech and blockchain technology.'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      bio: 'Ex-Google engineer specializing in distributed systems and cryptocurrency infrastructure.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Security',
      bio: 'Cybersecurity expert with experience at major financial institutions and crypto exchanges.'
    },
    {
      name: 'Emily Wang',
      role: 'Head of Product',
      bio: 'Product strategist focused on user experience and cryptocurrency adoption.'
    }
  ]

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">About</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Changeit
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            We're building the future of cryptocurrency trading with cutting-edge technology, 
            uncompromising security, and a user-first approach that makes crypto accessible to everyone.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-center p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-white/70 text-lg leading-relaxed mb-6">
                  At Changeit, we believe that everyone should have access to the financial freedom 
                  that cryptocurrencies provide. Our mission is to democratize digital finance by 
                  creating the most secure, user-friendly, and innovative trading platform in the world.
                </p>
                <p className="text-white/70 text-lg leading-relaxed">
                  We're not just building an exchange – we're building the infrastructure for the 
                  future of money, where anyone, anywhere can participate in the global digital economy.
                </p>
              </div>
              <div className="relative">
                <div className="w-full h-64 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-2xl flex items-center justify-center">
                  <Globe className="w-24 h-24 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Changeit?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{member.name[0]}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-cyan-400 text-sm mb-3">{member.role}</p>
                <p className="text-white/60 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Security First</h3>
                <p className="text-white/70">
                  We prioritize the security of your assets above all else, implementing 
                  industry-leading security measures and best practices.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Transparency</h3>
                <p className="text-white/70">
                  We believe in complete transparency in our operations, fees, and 
                  decision-making processes to build trust with our community.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Innovation</h3>
                <p className="text-white/70">
                  We continuously innovate to provide cutting-edge features and 
                  stay ahead of the rapidly evolving cryptocurrency landscape.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage