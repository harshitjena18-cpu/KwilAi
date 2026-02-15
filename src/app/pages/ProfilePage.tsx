import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  Heart, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Crown,
  Award,
  Activity,
  Mail,
  Phone
} from 'lucide-react';
import { KwilAvatar, KwilCard, KwilSwitch, KwilBadge } from '../components/kwil';
import { useNavigate } from 'react-router';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const stats = [
    { label: 'Recipes Saved', value: '48', icon: <Heart size={20} className="text-[#FF6B6B]" /> },
    { label: 'Meals Cooked', value: '127', icon: <Award size={20} className="text-[#FFD93D]" /> },
    { label: 'Day Streak', value: '7', icon: <Activity size={20} className="text-[#00FF9C]" /> },
  ];

  const menuSections = [
    {
      title: 'Account',
      items: [
        { id: 'personal', label: 'Personal Info', icon: <User size={20} />, badge: null },
        { id: 'premium', label: 'Upgrade to Premium', icon: <Crown size={20} />, badge: 'Pro' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, toggle: true },
        { id: 'email', label: 'Email Alerts', icon: <Mail size={20} />, toggle: true },
        { id: 'dietary', label: 'Dietary Preferences', icon: <Settings size={20} />, badge: null },
      ],
    },
    {
      title: 'Health',
      items: [
        { id: 'health', label: 'Health Dashboard', icon: <Activity size={20} />, badge: null, action: () => navigate('/app/health') },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: <HelpCircle size={20} />, badge: null },
        { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={20} />, badge: null },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#050B08' }}>
      {/* Header */}
      <div className="px-6 pt-16 pb-4">
        <h1 className="text-white text-3xl font-bold">Profile</h1>
        <p className="text-[#A0A0A0] text-sm">Manage your account & settings</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-28 space-y-6">
        {/* User Info Card */}
        <motion.div
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 156, 0.2)',
            boxShadow: '0 0 30px rgba(0, 255, 156, 0.15)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <KwilAvatar name="Sarah Johnson" size="lg" glow />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white text-xl font-bold">Sarah Johnson</h3>
                <KwilBadge variant="primary" dot>Free</KwilBadge>
              </div>
              <p className="text-[#A0A0A0] text-sm">sarah.j@email.com</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <p className="text-white text-lg font-bold">{stat.value}</p>
                <p className="text-[#A0A0A0] text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-white text-sm font-semibold mb-3 px-2">{section.title}</h3>
            <motion.div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (sectionIndex + 1) }}
            >
              {section.items.map((item, itemIndex) => (
                <div key={item.id}>
                  {item.toggle ? (
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-[#00FF9C]">{item.icon}</div>
                        <p className="text-white">{item.label}</p>
                      </div>
                      <KwilSwitch
                        checked={item.id === 'notifications' ? notifications : emailAlerts}
                        onChange={(checked) => {
                          if (item.id === 'notifications') setNotifications(checked);
                          else setEmailAlerts(checked);
                        }}
                      />
                    </div>
                  ) : (
                    <motion.button
                      className="w-full p-4 flex items-center justify-between"
                      whileHover={{ background: 'rgba(0, 255, 156, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={item.action}
                    >
                      <div className="flex items-center gap-3">
                        <div className={item.badge === 'Pro' ? 'text-[#FFD93D]' : 'text-[#00FF9C]'}>
                          {item.icon}
                        </div>
                        <p className="text-white">{item.label}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <KwilBadge variant={item.badge === 'Pro' ? 'warning' : 'primary'}>
                            {item.badge}
                          </KwilBadge>
                        )}
                        <ChevronRight size={20} className="text-[#A0A0A0]" />
                      </div>
                    </motion.button>
                  )}
                  {itemIndex < section.items.length - 1 && (
                    <div 
                      className="h-px mx-4"
                      style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        ))}

        {/* Logout Button */}
        <motion.button
          className="w-full rounded-2xl p-4 flex items-center justify-center gap-2"
          style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
          }}
          whileHover={{ 
            background: 'rgba(255, 107, 107, 0.2)',
            borderColor: 'rgba(255, 107, 107, 0.5)',
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LogOut size={20} className="text-[#FF6B6B]" />
          <span className="text-[#FF6B6B] font-medium">Log Out</span>
        </motion.button>

        {/* Version */}
        <p className="text-[#A0A0A0] text-xs text-center">Version 1.0.0</p>

        {/* Bottom Spacing */}
        <div className="h-20" />
      </div>
    </div>
  );
}