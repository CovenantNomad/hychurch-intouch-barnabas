import { create } from 'zustand';

type ToastStore = {
  hasShownProgressToast: boolean;
  setHasShownProgressToast: (value: boolean) => void;
};
export const useDelayAlertStore = create<ToastStore>((set) => ({
  hasShownProgressToast: false,
  setHasShownProgressToast: (value) => set({ hasShownProgressToast: value }),
}));
