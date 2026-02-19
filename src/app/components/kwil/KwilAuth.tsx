import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Sparkles, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { KwilButton } from './KwilButton';
import { KwilInput } from './KwilInput';

export default function KwilAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 156, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            bottom: '20%',
            right: '10%',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#00FF9C]"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Auth Card */}
      <motion.div
        className="relative z-10 w-full max-w-sm mx-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Glass Card Container */}
        <div 
          className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              0 0 80px rgba(0, 255, 156, 0.15),
              inset 0 0 40px rgba(0, 255, 156, 0.05)
            `,
          }}
        >
          {/* Logo and Welcome */}
          <motion.div 
            className="text-center space-y-4 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Logo */}
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{
                background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)',
                boxShadow: '0 0 40px rgba(0, 255, 156, 0.5)',
              }}
              animate={{
                boxShadow: [
                  '0 0 40px rgba(0, 255, 156, 0.5)',
                  '0 0 60px rgba(0, 255, 156, 0.7)',
                  '0 0 40px rgba(0, 255, 156, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles size={36} className="text-[#050B08]" />
            </motion.div>

            {/* Welcome Text */}
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to Kwil AI</h1>
              <p className="text-[#A0A0A0] text-sm">Your personal AI chef assistant</p>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Email Input */}
            <KwilInput
              type="email"
              aria-label="Email address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} />}
            />

            {/* Password Input */}
            <KwilInput
              type="password"
              aria-label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button 
                className="text-[#00FF9C] text-sm hover:underline transition-all"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 156, 0.3)',
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <KwilButton variant="primary" fullWidth onClick={() => navigate('/preferences')}>
              <div className="flex items-center justify-center gap-2">
                <span>Login</span>
                <ArrowRight size={20} />
              </div>
            </KwilButton>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div 
                  className="w-full h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  }}
                />
              </div>
              <div className="relative flex justify-center">
                <span 
                  className="px-4 text-xs text-[#A0A0A0]"
                  style={{ backgroundColor: 'rgba(5, 11, 8, 0.8)' }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              {/* Google Sign In */}
              <button
                className="w-full rounded-full py-3 px-4 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-white text-sm font-medium">Continue with Google</span>
              </button>

              {/* Phone Login */}
              <button
                className="w-full rounded-full py-3 px-4 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                  }}
                >
                  <Phone size={16} className="text-[#00FF9C]" />
                </div>
                <span className="text-white text-sm font-medium">Continue with Phone</span>
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-[#A0A0A0] text-sm">
                Don't have an account?{' '}
                <button 
                  className="text-[#00FF9C] font-medium hover:underline transition-all"
                  style={{
                    textShadow: '0 0 10px rgba(0, 255, 156, 0.3)',
                  }}
                >
                  Register now
                </button>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Glow Effect */}
        <div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full opacity-40 blur-2xl"
          style={{
            background: 'linear-gradient(90deg, transparent, #00FF9C, transparent)',
          }}
        />
      </motion.div>

      {/* Floating Ring Decoration */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-20 pointer-events-none"
        style={{
          border: '2px solid #00FF9C',
          boxShadow: '0 0 20px rgba(0, 255, 156, 0.3)',
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute bottom-32 left-10 w-24 h-24 rounded-full opacity-15 pointer-events-none"
        style={{
          border: '2px solid #10B981',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
        }}
        animate={{
          rotate: -360,
          scale: [1, 1.15, 1],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
          scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </div>
  );
}