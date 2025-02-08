import { TAppointment } from '@/types/barnabas.types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type AppointmentState = {
  appointments: TAppointment[];
  setAppointments: (appointments: TAppointment[]) => void;
};

export const useAppointmentStore = create(
  persist(
    immer<AppointmentState>((set, get) => ({
      appointments: [],
      setAppointments: (appointments) =>
        set((state) => {
          // ✅ 기존 상태와 동일한 경우 업데이트하지 않음 (무한 루프 방지)
          if (
            JSON.stringify(get().appointments) !== JSON.stringify(appointments)
          ) {
            state.appointments = appointments;
          }
        }),
    })),
    {
      name: 'user-appointments',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
