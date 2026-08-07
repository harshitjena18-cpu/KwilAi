import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Plus, 
  Check, 
  Trash2, 
  Share2,
  Download,
  Sparkles
} from 'lucide-react';
import { KwilButton } from './KwilButton';
import { KwilCard } from './KwilCard';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  fromRecipe?: string;
}

export default function KwilShoppingList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Paneer', quantity: '200g', category: 'Dairy', checked: false, fromRecipe: 'Paneer Tikka' },
    { id: '2', name: 'Bell Peppers', quantity: '2 pcs', category: 'Vegetables', checked: false, fromRecipe: 'Paneer Tikka' },
    { id: '3', name: 'Yogurt', quantity: '1 cup', category: 'Dairy', checked: false, fromRecipe: 'Paneer Tikka' },
    { id: '4', name: 'Garam Masala', quantity: '1 tsp', category: 'Spices', checked: true, fromRecipe: 'Paneer Tikka' },
    { id: '5', name: 'Tomatoes', quantity: '4 pcs', category: 'Vegetables', checked: false },
    { id: '6', name: 'Onions', quantity: '2 pcs', category: 'Vegetables', checked: false },
    { id: '7', name: 'Rice', quantity: '500g', category: 'Grains', checked: false },
    { id: '8', name: 'Lentils', quantity: '250g', category: 'Grains', checked: true },
  ]);

  const [newItem, setNewItem] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (newItem.trim()) {
      const item: ShoppingItem = {
        id: Date.now().toString(),
        name: newItem,
        quantity: '1x',
        category: 'Other',
        checked: false,
      };
      setItems([item, ...items]);
      setNewItem('');
      setShowAddInput(false);
    }
  };

  // ⚡ Bolt: Memoize categories and groupedItems to prevent O(N*M) calculation on every keystroke when typing in the 'Add Item' input
  const categories = useMemo(() => ['Dairy', 'Vegetables', 'Spices', 'Grains', 'Other'], []);
  const groupedItems = useMemo(() => {
    return categories.map(category => ({
      category,
      items: items.filter(item => item.category === category),
    })).filter(group => group.items.length > 0);
  }, [items, categories]);

  // ⚡ Bolt: Memoize completedCount to avoid filtering the array unnecessarily on every keystroke
  const completedCount = useMemo(() => items.filter(i => i.checked).length, [items]);
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Background Effects */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 50% 10%, rgba(0, 255, 156, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%)
          `
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-6 pt-16 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          <div className="flex gap-2">
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Share2 size={18} className="text-[#00FF9C]" />
            </button>
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Download size={18} className="text-[#00FF9C]" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)',
                boxShadow: '0 0 30px rgba(0, 255, 156, 0.5)',
              }}
            >
              <ShoppingCart size={24} className="text-[#050B08]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Shopping List</h1>
              <p className="text-[#A0A0A0] text-sm">{items.length} items • {completedCount} collected</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00FF9C 0%, #10B981 100%)',
                boxShadow: '0 0 15px rgba(0, 255, 156, 0.6)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 relative z-10">
        <div className="space-y-4">
          {/* Add Item Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {!showAddInput ? (
              <button
                onClick={() => setShowAddInput(true)}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 156, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px dashed rgba(0, 255, 156, 0.4)',
                }}
              >
                <Plus size={20} className="text-[#00FF9C]" />
                <span className="text-[#00FF9C] font-medium">Add Item</span>
              </button>
            ) : (
              <div 
                className="p-4 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 255, 156, 0.3)',
                }}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Enter item name..."
                    autoFocus
                    className="flex-1 bg-transparent text-white placeholder-[#A0A0A0] outline-none"
                  />
                  <button
                    onClick={addItem}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)',
                      boxShadow: '0 0 20px rgba(0, 255, 156, 0.4)',
                    }}
                  >
                    <Check size={20} className="text-[#050B08]" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* AI Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <KwilCard>
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(0, 255, 156, 0.2)',
                    border: '1px solid rgba(0, 255, 156, 0.3)',
                  }}
                >
                  <Sparkles size={18} className="text-[#00FF9C]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">AI Suggestion</h3>
                  <p className="text-[#A0A0A0] text-sm">Based on your recipes, you might also need: Cumin Seeds, Coriander Powder</p>
                  <button className="text-[#00FF9C] text-sm font-medium mt-2 hover:underline">
                    Add suggestions
                  </button>
                </div>
              </div>
            </KwilCard>
          </motion.div>

          {/* Grouped Items */}
          {groupedItems.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + groupIndex * 0.05 }}
            >
              <h3 className="text-white font-medium mb-3 px-2">{group.category}</h3>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <AnimatePresence key={item.id}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div
                        className="p-4 rounded-2xl flex items-center gap-3 transition-all"
                        style={{
                          background: item.checked 
                            ? 'rgba(0, 255, 156, 0.08)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: item.checked 
                            ? '1px solid rgba(0, 255, 156, 0.3)' 
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          opacity: item.checked ? 0.7 : 1,
                        }}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                          style={{
                            background: item.checked 
                              ? 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)'
                              : 'rgba(255, 255, 255, 0.1)',
                            border: item.checked 
                              ? 'none'
                              : '2px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: item.checked 
                              ? '0 0 15px rgba(0, 255, 156, 0.5)'
                              : 'none',
                          }}
                        >
                          {item.checked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check size={14} className="text-[#050B08]" />
                            </motion.div>
                          )}
                        </button>

                        {/* Item Details */}
                        <div className="flex-1">
                          <h4 
                            className="text-white font-medium"
                            style={{
                              textDecoration: item.checked ? 'line-through' : 'none',
                            }}
                          >
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#A0A0A0] text-sm">{item.quantity}</span>
                            {item.fromRecipe && (
                              <>
                                <span className="text-[#A0A0A0]">•</span>
                                <span className="text-[#00FF9C] text-xs">{item.fromRecipe}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                          style={{
                            background: 'rgba(255, 59, 48, 0.2)',
                            border: '1px solid rgba(255, 59, 48, 0.3)',
                          }}
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-6 z-20"
        style={{
          background: 'linear-gradient(to top, #050B08 0%, #050B08 70%, transparent 100%)',
        }}
      >
        <div className="space-y-3">
          <KwilButton variant="primary" fullWidth>
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart size={20} />
              <span>Start Shopping</span>
            </div>
          </KwilButton>
          <button
            onClick={() => {
              setItems(items.map(item => ({ ...item, checked: false })));
            }}
            className="w-full py-3 text-[#A0A0A0] text-sm font-medium"
          >
            Clear All Checks
          </button>
        </div>
      </div>
    </div>
  );
}
