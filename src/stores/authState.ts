import { TBarnabasProfile } from '@/types/barnabas.types';
import { User } from 'firebase/auth';
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
  user: null as User | null,
  profile: null as TBarnabasProfile | null,
};

export const useAuthStore = create(
  persist(
    subscribeWithSelector(
      immer(
        combine(initialState, (set) => ({
          setUser: (user: User | null) =>
            set((state) => {
              state.user = user;
            }),
          setProfile: (profile: TBarnabasProfile | null) =>
            set((state) => {
              state.profile = profile;
            }),
          logout: () =>
            set((state) => {
              state.user = null;
              state.profile = null;
            }),
        }))
      )
    ),
    {
      name: 'barnabas-auth', // ✅ 로컬스토리지에 저장될 키
      storage: createJSONStorage(() => localStorage), // ✅ 상태를 JSON 형태로 저장
    }
  )
);
