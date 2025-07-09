// store.js
import { create } from "zustand";

const usersStore = create((set) => ({
  user: {
    _id: null,
    fullname: "",
    username: "",
    profileImg: "",
    gender: "",
  },
  setUser: (userData) => set({ user: userData }),
  conversations: [],
  addConversation: (newMessage) =>
    set((state) => ({
      conversations: [...state.conversations, newMessage],
    })),
}));

export default usersStore;
