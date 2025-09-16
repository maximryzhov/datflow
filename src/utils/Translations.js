import { translationsStore } from "@/stores";

let counter;
const makeStringLabel = () => {
  if (!counter) {
    counter = Object.keys(translationsStore.state.labels).length;
  }
  let newLabel = "";
  do {
    const suffix = String(counter).padStart(4, "0");
    newLabel = `string_${suffix}`;
    counter++;
  } while (Object.values(translationsStore.state.labels).includes(newLabel));
  return newLabel;
};

export { makeStringLabel };
