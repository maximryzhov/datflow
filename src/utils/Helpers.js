import { toRaw } from "vue";

function accessor(obj, path, val = undefined) {
  if (!obj || typeof obj !== "object" || !path || typeof path !== "string") {
    return val;
  }
  try {
    return path
      .replace(/\[(\w+)\]/g, ".$1")
      .replace(/^\./, "")
      .split(".")
      .reduce((acc, key) => {
        if (acc === null || acc === undefined) return val;
        if (Array.isArray(acc) && /^\d+$/.test(key)) {
          const index = parseInt(key, 10);
          return index >= 0 && index < acc.length ? acc[index] : val;
        }
        return acc[key] !== undefined ? acc[key] : val;
      }, obj);
  } catch (e) {
    return val;
  }
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(toRaw(obj)));
}

function moveKey(obj, key, direction) {
  const keys = Object.keys(obj);
  const i = keys.indexOf(key);

  if (direction === -1 && i > 0) {
    // Swap with previous key
    [keys[i - 1], keys[i]] = [keys[i], keys[i - 1]];
  } else if (direction === 1 && i < keys.length - 1) {
    // Swap with next key
    [keys[i], keys[i + 1]] = [keys[i + 1], keys[i]];
  }

  // Rebuild object with new order
  const result = {};
  keys.forEach((k) => {
    result[k] = obj[k];
  });

  return result;
}

function compareObj(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export { accessor, deepCopy, moveKey, compareObj};
