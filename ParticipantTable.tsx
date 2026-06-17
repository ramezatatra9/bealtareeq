import { useState, useMemo } from 'react';
import { useLotteryStore } from '../../store/useLotteryStore';
import { Search, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';

export const ParticipantTable = ({ lotteryId }: { lotteryId: string }) => {
  const lottery = useLotteryStore(state => state.lotteries.find(l => l.id === lotteryId));
  const deleteParticipant = useLotteryStore(state => state.deleteParticipant);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const participants = lottery?.participants || [];

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.phone.includes(searchTerm)
    );
  }, [participants, searchTerm]);

  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredParticipants.slice(start, start + itemsPerPage);
  }, [filteredParticipants, currentPage]);

  if (!lottery) return null;

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-dark-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          المشاركين 
          <span className="bg-gold-500/20 text-gold-500 text-xs py-1 px-3 rounded-full">
            {participants.length}
          </span>
        </h3>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="بحث عن مشارك..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-dark-900 border border-dark-800/50 rounded-lg pr-10 pl-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-dark-900/50 text-gray-400 border-b border-dark-800/50">
            <tr>
              <th className="px-6 py-4 font-medium">الرقم</th>
              <th className="px-6 py-4 font-medium">الاسم</th>
              <th className="px-6 py-4 font-medium">رقم الهاتف</th>
              <th className="px-6 py-4 font-medium">الحالة</th>
              <th className="px-6 py-4 font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/50">
            {currentData.length > 0 ? (
              currentData.map((p, index) => (
                <tr key={p.id} className="hover:bg-dark-800/30 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-200">{p.name}</td>
                  <td className="px-6 py-4 text-gray-400" dir="ltr">{p.phone || '-'}</td>
                  <td className="px-6 py-4">
                    {p.status === 'winner' ? (
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">فائز</span>
                    ) : (
                      <span className="bg-dark-800 text-gray-400 px-2 py-1 rounded text-xs">في الانتظار</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    {/* Add Edit functionality later if needed */}
                    <button 
                      onClick={() => deleteParticipant(lotteryId, p.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  لا يوجد مشاركين
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-dark-800/50 flex justify-between items-center bg-dark-900/30">
          <span className="text-sm text-gray-400">
            صفحة {currentPage} من {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-dark-800 text-gray-400 disabled:opacity-50 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-dark-800 text-gray-400 disabled:opacity-50 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantTable;
