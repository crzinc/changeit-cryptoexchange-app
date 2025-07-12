import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './Auth/AuthModal'

const CallToAction: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard'
    } else {
      setIsAuthModalOpen(true)
    }
  }

  return (
    <>
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl border border-white/10 p-12 lg:p-16 text-center overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-3xl" />
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center mb-6"
                >
                  <Sparkles className="w-8 h-8 text-cyan-400 mr-3" />
                  <span className="text-cyan-400 font-semibold text-lg">Ready to Start Trading?</span>
                  <Sparkles className="w-8 h-8 text-purple-400 ml-3" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-4xl lg:text-6xl font-bold mb-6"
                >
                  <span className="text-white">Join</span>{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    10 Million+
                  </span>
                  <br />
                  <span className="text-white">Crypto Traders</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                  Start your crypto journey today with zero fees, instant trades, 
                  and bank-grade security. Your financial freedom is just one click away.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetStarted}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-semibold text-lg flex items-center justify-center hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                  >
                    View Markets
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="mt-8 flex items-center justify-center gap-8 text-white/60 text-sm"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    No Hidden Fees
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                    Instant Setup
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                    24/7 Support
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="register"
      />
    </>
  )
}

export default CallToAction