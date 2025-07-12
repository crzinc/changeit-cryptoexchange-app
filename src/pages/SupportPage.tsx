import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Phone, Clock, Search, ChevronDown, ChevronUp } from 'lucide-react'

const SupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click the "Get Started" button in the top right corner, fill in your details, and verify your email address. You\'ll be ready to trade in minutes!'
    },
    {
      question: 'What cryptocurrencies can I trade?',
      answer: 'We support over 500 cryptocurrencies including Bitcoin, Ethereum, and all major altcoins. You can view the complete list on our Markets page.'
    },
    {
      question: 'Are there any trading fees?',
      answer: 'Changeit offers zero trading fees for all cryptocurrency exchanges. We believe in making crypto trading accessible to everyone.'
    },
    {
      question: 'How secure is my account?',
      answer: 'We use bank-grade security including cold storage, 2FA, advanced encryption, and regular security audits to protect your assets.'
    },
    {
      question: 'How long do transactions take?',
      answer: 'Most transactions are processed instantly. Blockchain confirmations may take 2-30 minutes depending on the cryptocurrency and network congestion.'
    },
    {
      question: 'Can I withdraw my funds anytime?',
      answer: 'Yes, you can withdraw your funds 24/7. Withdrawals are typically processed within minutes to a few hours depending on the cryptocurrency.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes! We offer 24/7 customer support via live chat, email, and phone. Our team is always ready to help you with any questions.'
    },
    {
      question: 'Is Changeit available in my country?',
      answer: 'Changeit is available in most countries worldwide. Check our supported countries list or contact support for specific availability in your region.'
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', contactForm)
    alert('Thank you for your message! We\'ll get back to you within 24 hours.')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Support</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Center
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Get help with your account, trading, or any questions about Changeit
          </p>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Live Chat</h3>
            <p className="text-white/60 mb-4">Get instant help from our support team</p>
            <button className="px-6 py-2 bg-green-500 hover:bg-green-400 rounded-lg text-white transition-colors duration-200">
              Start Chat
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Email Support</h3>
            <p className="text-white/60 mb-4">Send us a detailed message</p>
            <a 
              href="mailto:support@changeit.com"
              className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white transition-colors duration-200"
            >
              Send Email
            </a>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Phone Support</h3>
            <p className="text-white/60 mb-4">Call us for urgent matters</p>
            <a 
              href="tel:+1-800-CHANGEIT"
              className="inline-block px-6 py-2 bg-purple-500 hover:bg-purple-400 rounded-lg text-white transition-colors duration-200"
            >
              Call Now
            </a>
          </div>
        </motion.div>

        {/* Support Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-12"
        >
          <div className="flex items-center justify-center">
            <Clock className="w-6 h-6 text-cyan-400 mr-3" />
            <span className="text-white font-semibold">24/7 Support Available</span>
            <span className="text-white/60 ml-2">- We're here to help anytime, anywhere</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            {/* FAQ Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-slate-700/30 rounded-xl border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-white/60" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/60" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Subject</label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="account">Account Issues</option>
                    <option value="trading">Trading Questions</option>
                    <option value="technical">Technical Support</option>
                    <option value="security">Security Concerns</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300 resize-none"
                    placeholder="Describe your issue or question in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SupportPage