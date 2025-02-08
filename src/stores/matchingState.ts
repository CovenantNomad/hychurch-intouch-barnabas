import { TMatching } from '@/types/barnabas.types';
import { create } from 'zustand';
import {
  combine,
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ✅ 초기 상태 정의
const initialState = {
  selectedMatching: null as TMatching | null,
};

export const useMatchingStore = create(
  persist(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => ({
          // 선택된 매칭 설정
          setSelectedMatching: (matching: TMatching | null) =>
            set((state) => {
              state.selectedMatching = matching;
            }),

          // 선택된 매칭 초기화
          clearSelectedMatching: () =>
            set((state) => {
              state.selectedMatching = null;
            }),
        }))
      )
    ),
    {
      name: 'selected-matching', // ✅ 로컬스토리지에 저장될 키
      storage: createJSONStorage(() => localStorage), // ✅ 상태를 JSON 형태로 저장
    }
  )
);
