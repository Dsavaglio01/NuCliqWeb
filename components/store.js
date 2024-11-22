import {create} from 'zustand';

const useStore = create((set) => ({
  sidebarValue: false,
  setSidebarValue: (value) => set({ sidebarValue: value }),
}));
export default useStore;