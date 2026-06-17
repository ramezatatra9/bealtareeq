import { useLotteryStore } from '../../store/useLotteryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gift, Users, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const PublicResults = () => {
  const { lotteries, activeLotteryId } = useLotteryStore();
  const activeLottery = lotteries.find(l => l.id === activeLotteryId);
  const { width, height } = useWindowSize();

  if (!activeLottery) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-500 mb-4">لا توجد قرعة نشطة حالياً</h2>
        <p className="text-gray-600">يرجى العودة لاحقاً لمعرفة النتائج.</p>
      </div>
    );
  }

  const winner = activeLottery.participants.find(p => p.id === activeLottery.winnerId);

  return (
    <div className="w-full max-w-4xl relative">
      {winner && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti 
            width={width} 
            height={height} 
            recycle={false} 
            numberOfPieces={500} 
            colors={['#FFD700', '#D4AF37', '#AA8C2C', '#ffffff']}
          />
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="bg-gold-500/20 text-gold-400 px-4 py-1.5 rounded-full text-sm font-medium border border-gold-500/30 mb-4 inline-block">
          المنظم: {activeLottery.organizer}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {activeLottery.name}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 text-gray-300">
          <div className="flex items-center gap-2 bg-dark-800/50 px-4 py-2 rounded-full border border-dark-800/50">
            <Gift className="text-gold-500 w-5 h-5" />
            <span>{activeLottery.prizeName}</span>
          </div>
          <div className="flex items-center gap-2 bg-dark-800/50 px-4 py-2 rounded-full border border-dark-800/50">
            <Users className="text-gold-500 w-5 h-5" />
            <span>{activeLottery.participants.length} مشارك</span>
          </div>
        </div>
      </motion.div>

      <div className="relative">
        {/* Glow effect behind the card */}
        {winner && (
          <div className="absolute inset-0 bg-gold-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        )}

        <AnimatePresence mode="wait">
          {winner ? (
            <motion.div
              key="winner"
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 20,
                duration: 0.8 
              }}
              className="relative z-10 glass-card p-12 text-center border-gold-500/50 shadow-[0_0_50px_rgba(212,175,55,0.3)] overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Trophy className="w-24 h-24 text-gold-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
              </motion.div>
              
              <h3 className="text-2xl text-gold-400 mb-2 font-medium">🏆 الفائز 🏆</h3>
              
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                <h4 className="text-5xl md:text-6xl font-bold text-white my-6 tracking-tight">
                  {winner.name}
                </h4>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-2xl text-gold-500 font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-6 h-6" />
                مبروك للفائز!
                <Sparkles className="w-6 h-6" />
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-12 text-center rounded-2xl border-dashed border-2 border-dark-800/80"
            >
              <div className="w-20 h-20 mx-auto bg-dark-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Trophy className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">
                سيتم الإعلان عن الفائز قريباً
              </h3>
              <p className="text-gray-500">
                ترقبوا نتيجة السحب... نتمنى التوفيق للجميع!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default PublicResults;
