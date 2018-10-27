export function set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
export function get(key) {
    const val = window.localStorage.getItem(key);
    return val ? JSON.parse(val) : [];
  }

 export function remove(key) {
    window.localStorage.removeItem(key);
  }