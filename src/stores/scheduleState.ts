import { TMatching } from '@/types/barnabas.types';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ✅ 초기 상태 정의
interface ScheduleState {
  date: string | undefined;
  hour: string;
  minute: string;
  place: string;
  selectedCourse: TMatching | null;
  setDate: (date: string | undefined) => void;
  setHour: (hour: string) => void;
  setMinute: (minute: string) => void;
  setPlace: (place: string) => void;
  setSelectedCourse: (course: TMatching | null) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    subscribeWithSelector(
      immer((set) => ({
        date: undefined,
        hour: '00',
        minute: '00',
        place: '',
        selectedCourse: null,

        setDate: (date) => set((state) => void (state.date = date)),
        setHour: (hour) => set((state) => void (state.hour = hour)),
        setMinute: (minute) => set((state) => void (state.minute = minute)),
        setPlace: (place) => set((state) => void (state.place = place)),
        setSelectedCourse: (course) =>
          set((state) => void (state.selectedCourse = course)),
      }))
    ),
    {
      name: 'schedule-state', // ✅ 로컬스토리지 저장 키
      storage: createJSONStorage(() => localStorage),
    }
  )
);
