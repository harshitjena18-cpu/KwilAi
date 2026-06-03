import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Crown,
  Zap,
  Camera,
  Sparkles,
  Check,
  X,
  Infinity,
  Shield,
  Star,
  ChefHat,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { getPlanSummary, type UsageSummary } from '../../services/planService';

const DEMO_USER_ID = 'demo-user-001';

export default function UpgradePage() {
  const navigate = useNavigate();
  const [planSummary, setPlanSummary] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const summary = await getPlanSummary(DEMO_USER_ID);
      setPlanSummary(summary);
    } catch (error) {
      console.error('Failed to load plan:', error);
      // Fallback to free plan display
      setPlanSummary({
        plan: 'free',
        today: {
          scans: { used: 0, limit: 5, remaining: 5 },
          aiGenerations: { used: 0, limit: 5, remaining: 5 },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    // Simulate upgrade flow (in production, this would redirect to Stripe)
    setTimeout(() => {
      setUpgrading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const isPro = planSummary?.plan === 'pro';

  const freeFeatures = [
    { label: '5 scans per day', icon: <Camera size={16} /> },
    { label: '5 AI recipes per day', icon: <Sparkles size={16} /> },
    { label: 'Basic nutrition tracking', icon: <TrendingUp size={16} /> },
    { label: 'Recipe browsing', icon: <ChefHat size={16} /> },
  ];

  const proFeatures = [
    { label: 'Unlimited scans', icon: <Camera size={16} /> },
    { label: 'Unlimited AI recipes', icon: <Sparkles size={16} /> },
    { label: 'Advanced nutrition insights', icon: <TrendingUp size={16} /> },
    { label: 'Priority API access', icon: <Zap size={16} /> },
    { label: 'Voice assistant premium', icon: <Star size={16} /> },
    { label: 'Ad-free experience', icon: <Shield size={16} /> },
  ];

  if (loading) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ backgroundColor: '#050B08' }}
      >
        <Loader2 size={32} className="text-[#00FF9C] animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-16 pb-4">
        <div className="flex items-center gap-4">
          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">Upgrade to Pro</h1>
            <p className="text-[#A0A0A0] text-sm">Unlock the full Kwil experience</p>
          </div>
          <Crown size={28} className="text-[#FFD700]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-28 space-y-6 relative z-10">
        {/* Current Plan Status */}
        <motion.div
          className="rounded-3xl p-5"
          style={{
            background: isPro
              ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))'
              : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: isPro
              ? '1px solid rgba(255, 215, 0, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isPro ? '0 0 30px rgba(255, 215, 0, 0.2)' : 'none',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isPro ? (
                <Crown size={20} className="text-[#FFD700]" />
              ) : (
                <Zap size={20} className="text-[#A0A0A0]" />
              )}
              <h3 className="text-white font-bold text-lg">
                {isPro ? 'Pro Plan' : 'Free Plan'}
              </h3>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: isPro
                  ? 'rgba(255, 215, 0, 0.2)'
                  : 'rgba(0, 255, 156, 0.15)',
                color: isPro ? '#FFD700' : '#00FF9C',
                border: `1px solid ${isPro ? 'rgba(255, 215, 0, 0.4)' : 'rgba(0, 255, 156, 0.3)'}`,
              }}
            >
              CURRENT
            </span>
          </div>

          {/* Today's Usage */}
          {planSummary && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div
                className="rounded-2xl p-3"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Camera size={14} className="text-[#00FF9C]" />
                  <span className="text-[#A0A0A0] text-xs">Scans Today</span>
                </div>
                <p className="text-white font-bold text-lg">
                  {planSummary.today.scans.used}
                  <span className="text-[#A0A0A0] text-sm font-normal">
                    /{planSummary.today.scans.limit === Infinity ? (
                      <Infinity size={14} className="inline ml-0.5" />
                    ) : (
                      planSummary.today.scans.limit
                    )}
                  </span>
                </p>
              </div>
              <div
                className="rounded-2xl p-3"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#FFD93D]" />
                  <span className="text-[#A0A0A0] text-xs">AI Recipes</span>
                </div>
                <p className="text-white font-bold text-lg">
                  {planSummary.today.aiGenerations.used}
                  <span className="text-[#A0A0A0] text-sm font-normal">
                    /{planSummary.today.aiGenerations.limit === Infinity ? (
                      <Infinity size={14} className="inline ml-0.5" />
                    ) : (
                      planSummary.today.aiGenerations.limit
                    )}
                  </span>
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Plan Comparison */}
        <div className="space-y-4">
          {/* Free Plan Card */}
          <motion.div
            className="rounded-3xl p-5"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Free</h3>
                <p className="text-[#A0A0A0] text-xs">Basic features</p>
              </div>
              <p className="text-white text-2xl font-bold">
                $0<span className="text-[#A0A0A0] text-sm font-normal">/mo</span>
              </p>
            </div>
            <div className="space-y-2.5">
              {freeFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="text-[#A0A0A0]">{feature.icon}</div>
                  <span className="text-[#A0A0A0] text-sm">{feature.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pro Plan Card */}
          <motion.div
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 165, 0, 0.05))',
              border: '2px solid rgba(255, 215, 0, 0.4)',
              boxShadow: '0 0 40px rgba(255, 215, 0, 0.15)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Popular Badge */}
            <div
              className="absolute top-0 right-6 px-3 py-1 rounded-b-lg"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              }}
            >
              <span className="text-[#050B08] text-xs font-bold">POPULAR</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown size={22} className="text-[#FFD700]" />
                <div>
                  <h3 className="text-white font-semibold">Pro</h3>
                  <p className="text-[#A0A0A0] text-xs">Everything unlimited</p>
                </div>
              </div>
              <p className="text-white text-2xl font-bold">
                $9.99<span className="text-[#A0A0A0] text-sm font-normal">/mo</span>
              </p>
            </div>

            <div className="space-y-2.5 mb-5">
              {proFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="text-[#FFD700]">{feature.icon}</div>
                  <span className="text-white text-sm">{feature.label}</span>
                  <Check size={14} className="text-[#00FF9C] ml-auto" />
                </div>
              ))}
            </div>

            {/* Upgrade Button */}
            {!isPro && (
              <motion.button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#050B08',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' }}
                whileTap={{ scale: 0.98 }}
              >
                {upgrading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown size={20} />
                    Upgrade to Pro
                  </>
                )}
              </motion.button>
            )}

            {isPro && (
              <div
                className="w-full py-4 rounded-2xl font-bold text-center text-[#00FF9C]"
                style={{
                  background: 'rgba(0, 255, 156, 0.1)',
                  border: '1px solid rgba(0, 255, 156, 0.3)',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Check size={20} />
                  Active Subscription
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-white font-semibold px-2">FAQ</h3>
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes! Cancel your subscription at any time. You\'ll keep Pro features until the end of your billing period.',
            },
            {
              q: 'What happens to my data?',
              a: 'Your recipes, nutrition logs, and cooking history are always saved, regardless of your plan.',
            },
            {
              q: 'Do limits reset daily?',
              a: 'Yes, scan and AI generation limits reset at midnight UTC each day.',
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <p className="text-white text-sm font-medium mb-1">{faq.q}</p>
              <p className="text-[#A0A0A0] text-xs">{faq.a}</p>
            </div>
          ))}
        </motion.div>

        <div className="h-20" />
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute top-20 left-6 right-6 z-50 rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: 'rgba(0, 255, 156, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 156, 0.4)',
              boxShadow: '0 0 30px rgba(0, 255, 156, 0.3)',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Check size={24} className="text-[#00FF9C]" />
            <div>
              <p className="text-white font-bold">Stripe Checkout Required</p>
              <p className="text-[#A0A0A0] text-xs">
                Configure STRIPE_SECRET_KEY to enable payments
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
