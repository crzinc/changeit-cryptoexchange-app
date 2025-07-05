import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Users, TrendingUp, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Multi-layer security with cold storage, 2FA, and advanced encryption to protect your assets.',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Execute trades in seconds with our optimized matching engine and instant settlement.',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Globe,
    title: '500+ Cryptocurrencies',
    description: 'Access the largest selection of digital assets from Bitcoin to the latest DeFi tokens.',
    color: 'from-blue-400 to-purple-500'
  },
  {
    icon: Users,
    title: 'Trusted by Millions',
    description: 'Join over 10 million users who trust Changeit for their cryptocurrency trading needs.',
    color: 'from-pink-400 to-rose-500'
  },
  {
    icon: TrendingUp,
    title: 'Best Rates',
    description: 'Get the most competitive exchange rates with our smart routing across multiple liquidity sources.',
    color: 'from-cyan-400 to-teal-500'
  },
  {
    icon: Lock,
    title: 'No KYC Required',
    description: 'Trade anonymously without complex verification processes. Your privacy is our priority.',
    color: 'from-purple-400 to-indigo-500'
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Why Choose</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Changeit?
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            We've built the most advanced crypto exchange platform with your needs in mind
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              <div className="h-full bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl">
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '$2.4B', label: '24h Volume' },
              { value: '10M+', label: 'Active Users' },
              { value: '500+', label: 'Cryptocurrencies' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-slate-800/30 rounded-2xl border border-white/10"
              >
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;