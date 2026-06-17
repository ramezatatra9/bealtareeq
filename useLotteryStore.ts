import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Participant {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'winner';
}

export interface Lottery {
  id: string;
  name: string;
  organizer: string;
  prizeName: string;
  prizeDescription: string;
  prizeImage?: string;
  drawDate: string;
  participants: Participant[];
  winnerId?: string;
  createdAt: string;
}

interface LotteryState {
  lotteries: Lottery[];
  activeLotteryId: string | null;
  addLottery: (lottery: Omit<Lottery, 'id' | 'createdAt' | 'participants'>) => void;
  updateLottery: (id: string, data: Partial<Lottery>) => void;
  deleteLottery: (id: string) => void;
  setActiveLottery: (id: string) => void;
  addParticipants: (lotteryId: string, participants: Omit<Participant, 'id' | 'status'>[]) => void;
  updateParticipant: (lotteryId: string, participantId: string, data: Partial<Participant>) => void;
  deleteParticipant: (lotteryId: string, participantId: string) => void;
  selectWinner: (lotteryId: string, participantId: string) => void;
  resetLottery: (lotteryId: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useLotteryStore = create<LotteryState>()(
  persist(
    (set) => ({
      lotteries: [],
      activeLotteryId: null,

      addLottery: (lotteryData) => set((state) => {
        const newLottery: Lottery = {
          ...lotteryData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          participants: [],
        };
        return {
          lotteries: [...state.lotteries, newLottery],
          activeLotteryId: state.activeLotteryId || newLottery.id, // Auto-select first lottery
        };
      }),

      updateLottery: (id, data) => set((state) => ({
        lotteries: state.lotteries.map((lottery) => 
          lottery.id === id ? { ...lottery, ...data } : lottery
        )
      })),

      deleteLottery: (id) => set((state) => ({
        lotteries: state.lotteries.filter((l) => l.id !== id),
        activeLotteryId: state.activeLotteryId === id ? null : state.activeLotteryId
      })),

      setActiveLottery: (id) => set({ activeLotteryId: id }),

      addParticipants: (lotteryId, newParticipants) => set((state) => ({
        lotteries: state.lotteries.map(lottery => {
          if (lottery.id === lotteryId) {
            const formatted = newParticipants.map(p => ({
              ...p,
              id: generateId(),
              status: 'pending' as const
            }));
            return { ...lottery, participants: [...lottery.participants, ...formatted] };
          }
          return lottery;
        })
      })),

      updateParticipant: (lotteryId, participantId, data) => set((state) => ({
        lotteries: state.lotteries.map(lottery => {
          if (lottery.id === lotteryId) {
            return {
              ...lottery,
              participants: lottery.participants.map(p => 
                p.id === participantId ? { ...p, ...data } : p
              )
            };
          }
          return lottery;
        })
      })),

      deleteParticipant: (lotteryId, participantId) => set((state) => ({
        lotteries: state.lotteries.map(lottery => {
          if (lottery.id === lotteryId) {
            return {
              ...lottery,
              participants: lottery.participants.filter(p => p.id !== participantId),
              winnerId: lottery.winnerId === participantId ? undefined : lottery.winnerId
            };
          }
          return lottery;
        })
      })),

      selectWinner: (lotteryId, participantId) => set((state) => ({
        lotteries: state.lotteries.map(lottery => {
          if (lottery.id === lotteryId) {
            return {
              ...lottery,
              winnerId: participantId,
              participants: lottery.participants.map(p => ({
                ...p,
                status: p.id === participantId ? 'winner' : 'pending'
              }))
            };
          }
          return lottery;
        })
      })),

      resetLottery: (lotteryId) => set((state) => ({
        lotteries: state.lotteries.map(lottery => {
          if (lottery.id === lotteryId) {
            return {
              ...lottery,
              winnerId: undefined,
              participants: lottery.participants.map(p => ({ ...p, status: 'pending' }))
            };
          }
          return lottery;
        })
      })),
    }),
    {
      name: 'bil-tareeq-lottery-storage',
    }
  )
);
