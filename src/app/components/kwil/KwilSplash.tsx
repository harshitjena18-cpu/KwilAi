import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function KwilSplash() {
  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Green Mist Gradient Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(0, 255, 156, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, rgba(0, 255, 156, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 40%)
          `
        }}
      />

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            backgroundColor: '#00FF9C',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
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

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Glowing AI Ring Animation */}
        <div className="relative w-48 h-48 mb-8">
          {/* Outer Glow Ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 156, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Main Rotating Ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-4"
            style={{
              borderColor: '#00FF9C',
              borderTopColor: 'transparent',
              borderRightColor: 'rgba(0, 255, 156, 0.3)',
              boxShadow: `
                0 0 20px rgba(0, 255, 156, 0.5),
                0 0 40px rgba(0, 255, 156, 0.3),
                inset 0 0 20px rgba(0, 255, 156, 0.1)
              `,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Secondary Ring */}
          <motion.div
            className="absolute inset-8 rounded-full border-2"
            style={{
              borderColor: 'rgba(0, 255, 156, 0.4)',
              borderBottomColor: 'transparent',
              borderLeftColor: 'rgba(0, 255, 156, 0.2)',
              boxShadow: '0 0 15px rgba(0, 255, 156, 0.3)',
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Inner Glow Ring */}
          <motion.div
            className="absolute inset-12 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 156, 0.2) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Center Icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)',
                boxShadow: `
                  0 0 30px rgba(0, 255, 156, 0.6),
                  0 0 60px rgba(0, 255, 156, 0.3),
                  inset 0 0 20px rgba(255, 255, 255, 0.2)
                `,
              }}
            >
              <Sparkles className="text-[#050B08]" size={32} strokeWidth={2.5} />
            </div>
          </motion.div>

          {/* Orbital Dots */}
          {[0, 120, 240].map((rotation, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: '#00FF9C',
                left: '50%',
                top: '50%',
                marginLeft: '-4px',
                marginTop: '-4px',
                boxShadow: '0 0 10px rgba(0, 255, 156, 0.8)',
              }}
              animate={{
                rotate: [rotation, rotation + 360],
                x: [0, 80 * Math.cos((rotation * Math.PI) / 180)],
                y: [0, 80 * Math.sin((rotation * Math.PI) / 180)],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Logo & Text */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* App Name */}
          <motion.h1 
            className="text-5xl font-bold text-white tracking-tight"
            style={{
              textShadow: `
                0 0 20px rgba(0, 255, 156, 0.3),
                0 0 40px rgba(0, 255, 156, 0.2)
              `,
            }}
            animate={{
              textShadow: [
                '0 0 20px rgba(0, 255, 156, 0.3), 0 0 40px rgba(0, 255, 156, 0.2)',
                '0 0 30px rgba(0, 255, 156, 0.5), 0 0 60px rgba(0, 255, 156, 0.3)',
                '0 0 20px rgba(0, 255, 156, 0.3), 0 0 40px rgba(0, 255, 156, 0.2)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Kwil AI
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            className="text-lg tracking-wide"
            style={{ 
              color: '#00FF9C',
              fontWeight: 500,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Cook Smart with AI
          </motion.p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          className="mt-12 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#00FF9C' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Glow Effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20"
        style={{
          background: 'linear-gradient(to top, rgba(0, 255, 156, 0.2) 0%, transparent 100%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
