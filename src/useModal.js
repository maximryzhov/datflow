import { reactive } from "vue";

const state = reactive({
  title: "",
  message: "",
  isVisible: false
});
let resolveCallback;

export function useModalState() {
  return {
    state,
    resolve: (value) => {
      if (resolveCallback) {
        resolveCallback(value);
      }
    },
  };
}

export function useModal() {
  return {
    confirm({ title, message }) {
      state.isVisible = true;
      state.title = title;
      state.message = message;
      return new Promise((resolve) => {
        resolveCallback = resolve;
      });
    },
  };
}
