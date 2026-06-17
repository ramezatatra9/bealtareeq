import { useLotteryStore } from '../../store/useLotteryStore';
import { Users, Gift, Calendar, Trophy, Download, RotateCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import LotteryForm from '../../components/admin/LotteryForm';
import ParticipantManager from '../../components/admin/ParticipantManager';
import ParticipantTable from '../../components/admin/ParticipantTable';
import WinnerSelector from '../../components/admin/WinnerSelector';

const Dashboard = () => {
  const { lotteries, activeLotteryId, setActiveLottery, resetLottery } = useLotteryStore();
  
  const activeLottery = lotteries.find(l => l.id === activeLotteryId);

  const handleExport = () => {
    if (!activeLottery) return;
    
    const data = activeLottery.participants.map((p, i) => ({
      'الرقم': i + 1,
      'الاسم': p.name,
      'رقم الهاتف': p.phone || '-',
      'الحالة': p.status === 'winner' ? 'فائز' : 'مشارك'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المشاركين');
    XLSX.writeFile(wb, `participants-${activeLottery.name}.xlsx`);
  };

  if (lotteries.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">مرحباً بك في نظام بالطريق</h2>
          <p className="text-gray-400">يبدو أنه لا توجد قرعات حالية. ابدأ بإنشاء قرعة جديدة.</p>
        </div>
        <LotteryForm />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-900/50 p-4 rounded-xl border border-dark-800/50">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-sm text-gray-400 whitespace-nowrap">القرعة الحالية:</label>
          <select 
            value={activeLotteryId || ''}
            onChange={(e) => setActiveLottery(e.target.value)}
            className="bg-dark-800 border border-dark-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 flex-1 md:w-64"
          >
            {lotteries.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {activeLottery && (
            <>
              <button 
                onClick={handleExport}
                className="flex-1 md:flex-none bg-dark-800 hover:bg-dark-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 border border-dark-800/50 transition-colors text-sm"
              >
                <Download size={16} />
                تصدير Excel
              </button>
              <button 
                onClick={() => {
                  if(confirm('هل أنت متأكد من إعادة تعيين هذه القرعة؟ سيتم إزالة الفائز.')) {
                    resetLottery(activeLottery.id);
                  }
                }}
                className="flex-1 md:flex-none bg-dark-800 hover:bg-dark-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 border border-dark-800/50 transition-colors text-sm"
              >
                <RotateCcw size={16} />
                إعادة تعيين
              </button>
            </>
          )}
        </div>
      </div>

      {activeLottery && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Gift size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">الجائزة</p>
                <p className="font-bold text-white truncate max-w-[150px]">{activeLottery.prizeName}</p>
              </div>
            </div>
            
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">إجمالي المشاركين</p>
                <p className="font-bold text-white text-xl">{activeLottery.participants.length}</p>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">تاريخ السحب</p>
                <p className="font-bold text-white text-lg" dir="ltr">{activeLottery.drawDate}</p>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4 border-gold-500/30">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">الفائز</p>
                <p className="font-bold text-gold-500 truncate max-w-[150px]">
                  {activeLottery.winnerId 
                    ? activeLottery.participants.find(p => p.id === activeLottery.winnerId)?.name 
                    : 'لم يحدد بعد'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <ParticipantManager lotteryId={activeLottery.id} />
              <div className="h-[500px]">
                <ParticipantTable lotteryId={activeLottery.id} />
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              <WinnerSelector lotteryId={activeLottery.id} />
              
              {/* Info Card */}
              <div className="glass-card p-6">
                <h4 className="font-bold text-white mb-4">تفاصيل القرعة</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-gray-400">اسم القرعة</span>
                    <span className="text-white font-medium">{activeLottery.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-800/50 pb-2">
                    <span className="text-gray-400">المنظم</span>
                    <span className="text-white font-medium">{activeLottery.organizer}</span>
                  </div>
                  {activeLottery.prizeDescription && (
                    <div className="pt-2">
                      <span className="text-gray-400 block mb-1">وصف الجائزة</span>
                      <p className="text-gray-300 bg-dark-900/50 p-3 rounded-lg text-xs leading-relaxed">
                        {activeLottery.prizeDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
