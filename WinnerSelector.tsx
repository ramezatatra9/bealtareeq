import { useState, useMemo } from 'react';
import { useLotteryStore } from '../../store/useLotteryStore';
import toast from 'react-hot-toast';
import { Trophy, Search, Check, AlertCircle } from 'lucide-react';

export const WinnerSelector = ({ lotteryId }: { lotteryId: string }) => {
  const lottery = useLotteryStore(state => state.lotteries.find(l => l.id === lotteryId));
  const selectWinner = useLotteryStore(state => state.selectWinner);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const participants = lottery?.participants || [];
  const currentWinner = participants.find(p => p.id === lottery?.winnerId);

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.phone.includes(searchTerm)
    ).slice(0, 50); // Limit to 50 for performance
  }, [participants, searchTerm]);

  const handleSelectWinner = () => {
    if (selectedParticipantId) {
      selectWinner(lotteryId, selectedParticipantId);
      setShowConfirmModal(false);
      setSearchTerm('');
      setSelectedParticipantId(null);
      toast.success('تم اختيار الفائز بنجاح!');
    }
  };

  if (!lottery) return null;

  return (
    <div className="glass-card p-6 border-gold-500/30">
      <h3 className="text-xl font-bold text-gold-500 mb-6 flex items-center gap-2">
        <Trophy size={24} />
        اختيار الفائز
      </h3>

      {currentWinner ? (
        <div className="bg-dark-800/80 border border-gold-500/50 rounded-xl p-6 text-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <Trophy className="w-16 h-16 text-gold-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-1">الفائز الحالي</p>
          <h4 className="text-2xl font-bold text-white mb-2">{currentWinner.name}</h4>
          <p className="text-gold-400 font-mono" dir="ltr">{currentWinner.phone}</p>
        </div>
      ) : (
        <div className="relative">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ابحث عن مشارك لاختياره كفائز
            </label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="اسم المشارك أو رقم الهاتف..."
                className="w-full bg-dark-900 border border-dark-800/80 rounded-lg pr-10 pl-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          {isDropdownOpen && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-dark-800 border border-dark-800/50 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {filteredParticipants.length > 0 ? (
                <ul className="py-2">
                  {filteredParticipants.map(p => (
                    <li 
                      key={p.id}
                      onClick={() => {
                        setSelectedParticipantId(p.id);
                        setIsDropdownOpen(false);
                        setShowConfirmModal(true);
                      }}
                      className="px-4 py-2 hover:bg-dark-700 cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <span className="font-medium">{p.name}</span>
                      <span className="text-sm text-gray-400 font-mono" dir="ltr">{p.phone}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">لا يوجد نتائج</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-card w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">تأكيد اختيار الفائز</h3>
              <p className="text-gray-400 mb-6">
                هل أنت متأكد من اختيار 
                <span className="text-gold-400 font-bold mx-1">
                  {participants.find(p => p.id === selectedParticipantId)?.name}
                </span>
                كفائز في هذه القرعة؟
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleSelectWinner}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold py-2 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors"
                >
                  <Check size={18} />
                  تأكيد
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-dark-800 hover:bg-dark-700 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-dark-800/50"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnerSelector;
