import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

const Hero = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      </div>

      {/* Floating Particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-6 py-20 relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
            >
              <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-sm text-white/90">Trusted by 10M+ users worldwide</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Exchange</span>{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Crypto
              </span>
              <br />
              <span className="text-white">Instantly</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-white/70 mb-8 max-w-2xl"
            >
              The fastest, most secure way to exchange cryptocurrencies. 
              Access 500+ coins with zero fees and lightning-fast transactions.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-semibold flex items-center justify-center hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
              >
                Start Trading
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Learn More
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-8 mt-12"
            >
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-white/80 text-sm">Bank-grade Security</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-white/80 text-sm">Instant Swaps</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Exchange Preview</h3>
                  <p className="text-white/60">Real-time rates</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-black/20 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">From</span>
                      <span className="text-white/60 text-sm">Balance: 2.45 BTC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="bg-transparent text-2xl font-bold text-white outline-none w-full"
                        defaultValue="1.0"
                      />
                      <div className="flex items-center bg-orange-500/20 rounded-full px-3 py-1">
                        <div className="w-6 h-6 bg-orange-500 rounded-full mr-2"></div>
                        <span className="text-white font-semibold">BTC</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center"
                    >
                      <ArrowRight className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>

                  <div className="bg-black/20 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">To</span>
                      <span className="text-white/60 text-sm">≈ $65,430</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">31,250.00</span>
                      <div className="flex items-center bg-blue-500/20 rounded-full px-3 py-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-white font-semibold">USDT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
                >
                  Exchange Now
                </motion.button>
              </motion.div>

              {/* Floating Stats */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-500/30"
              >
                <div className="text-green-400 text-sm font-semibold">24h Volume</div>
                <div className="text-white text-lg font-bold">$2.4B</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -right-4 bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30"
              >
                <div className="text-blue-400 text-sm font-semibold">Active Users</div>
                <div className="text-white text-lg font-bold">1.2M+</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;