import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Edit2, Save, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabaseApi } from '../services/supabaseApi'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await supabaseApi.updateUserProfile(user.id, { name })
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-white">Please sign in to view your profile</div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>
          <p className="text-white/70 text-lg">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
              <p className="text-white/60 mb-6">{user.email}</p>
              <div className="flex items-center justify-center text-white/40 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Member since {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-white">Account Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-white transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg text-white transition-colors duration-200 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-white transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl mb-6 ${
                    message.includes('success') 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                      : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}
                >
                  {message}
                </motion.div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                      {user.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                  <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60">
                    <Mail className="w-5 h-5 mr-3" />
                    {user.email}
                    <span className="ml-auto text-xs bg-gray-500/20 px-2 py-1 rounded">Read-only</span>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Account Created</label>
                  <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60">
                    <Calendar className="w-5 h-5 mr-3" />
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Last Updated</label>
                  <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60">
                    <Calendar className="w-5 h-5 mr-3" />
                    {new Date(user.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Security Settings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-700/30 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Two-Factor Authentication</h4>
                <p className="text-white/60 text-sm mb-4">Add an extra layer of security to your account</p>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors duration-200">
                  Enable 2FA
                </button>
              </div>
              <div className="p-6 bg-slate-700/30 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Change Password</h4>
                <p className="text-white/60 text-sm mb-4">Update your password regularly for better security</p>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors duration-200">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage