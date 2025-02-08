import dayjs, { Dayjs } from 'dayjs';
import { create } from 'zustand';
import {
  combine,
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ✅ 오늘 날짜 (초기값)
const today = dayjs().format('YYYY-MM-DD'); // 'YYYY-MM-DD' 형식으로 저장

const initialState = {
  currentDate: today, // 문자열로 저장
  selectedDate: today || null,
};

export const useDateStore = create(
  persist(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => ({
          // ✅ currentDate 설정
          setCurrentDate: (update: Dayjs | ((prev: Dayjs) => Dayjs)) => {
            set((state) => {
              const prev = dayjs(state.currentDate, 'YYYY-MM-DD'); // 📌 명확하게 'YYYY-MM-DD' 포맷을 사용하여 변환
              state.currentDate =
                typeof update === 'function'
                  ? update(prev).format('YYYY-MM-DD') // 📌 변환 후 다시 'YYYY-MM-DD' 형식으로 저장
                  : update.format('YYYY-MM-DD');
            });
          },

          // ✅ selectedDate 설정
          setSelectedDate: (date: Dayjs | null) =>
            set((state) => {
              state.selectedDate = date ? date.format('YYYY-MM-DD') : null;
            }),

          // ✅ 날짜 초기화
          resetDates: () =>
            set((state) => {
              state.currentDate = today;
              state.selectedDate = today;
            }),
        }))
      )
    ),
    {
      name: 'date-store', // ✅ 로컬스토리지에 저장될 키
      storage: createJSONStorage(() => localStorage), // ✅ JSON Storage 사용
    }
  )
);
