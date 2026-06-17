import { useState } from 'react';
import { useLotteryStore } from '../../store/useLotteryStore';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

const LotteryForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const addLottery = useLotteryStore(state => state.addLottery);
  const [formData, setFormData] = useState({
    name: '',
    organizer: 'بالطريق',
    prizeName: '',
    prizeDescription: '',
    drawDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.prizeName || !formData.drawDate) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    addLottery(formData);
    toast.success('تم إنشاء القرعة بنجاح!');
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gold-500 mb-2">إنشاء قرعة جديدة</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">اسم القرعة *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-dark-800 border border-dark-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="مثال: نتيجة قرعة iPhone 17 Pro Max"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">اسم الجائزة *</label>
          <input
            type="text"
            value={formData.prizeName}
            onChange={(e) => setFormData({...formData, prizeName: e.target.value})}
            className="w-full bg-dark-800 border border-dark-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="مثال: iPhone 17 Pro Max"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">وصف الجائزة</label>
          <textarea
            value={formData.prizeDescription}
            onChange={(e) => setFormData({...formData, prizeDescription: e.target.value})}
            className="w-full bg-dark-800 border border-dark-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors min-h-[80px]"
            placeholder="وصف تفصيلي للجائزة..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">تاريخ السحب *</label>
          <input
            type="date"
            value={formData.drawDate}
            onChange={(e) => setFormData({...formData, drawDate: e.target.value})}
            className="w-full bg-dark-800 border border-dark-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">المنظم</label>
          <input
            type="text"
            value={formData.organizer}
            disabled
            className="w-full bg-dark-800/50 border border-dark-800/50 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors w-full md:w-auto self-end"
      >
        <PlusCircle size={20} />
        إنشاء القرعة
      </button>
    </form>
  );
};

export default LotteryForm;
