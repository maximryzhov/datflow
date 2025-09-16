import { optionsStore } from "@/stores";

function toggleTheme() {
  if (optionsStore.state.theme == "light") {
    optionsStore.state.theme = "dark";
  } else {
    optionsStore.state.theme = "light";
  }
}

function setTheme() {
  if (optionsStore.state.theme == "light") {
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
  }
}

export { toggleTheme, setTheme };
