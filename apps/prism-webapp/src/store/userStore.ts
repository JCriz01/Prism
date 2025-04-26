import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  user: {
    username: string;
    name: string;
    password: string;
    email: string;
    avatar: string;
    bio: string;
  };
};

type Action = {
  updateUser: (partialUser: Partial<State>) => void;
};

export const useUserStore = create<State & Action>()(
  immer((set) => ({
    user: {
      username: "",
      name: "",
      password: "",
      email: "",
      avatar: "",
      bio: "",
    },
    updateUser: (partialUser) =>
      set((state) => {
        // Update the user state with the partial user data
        //TODO: Check if this implementation is correct
        state.user = { ...state.user, ...partialUser };
        console.log("User updated:", state.user);
      }),
  }))
);
