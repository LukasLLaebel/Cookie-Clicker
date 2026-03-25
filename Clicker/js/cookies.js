import { updateCookieAndDisplay } from "./saveCookie.js";

function getCookieValue(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  const value = match ? match[2].trim() : null;
  const num = parseInt(value, 10);
  return isNaN(num) ? 0 : num;
}

export function createCookieCounter() {
  let count = getCookieValue("cookies"); // Initialize from cookie

  function increment() {
    count++;
    updateDisplay();
    updateCookieAndDisplay();
  }
  function getCount() {
    return count;
  }
  function setCount(value) {
    count = value;
    updateDisplay();
    updateCookieAndDisplay();
  }
  function updateDisplay() {
    document.getElementById("score").textContent =
      `${Math.floor(count)} cookies`;
  }
  return { increment, getCount, setCount };
}






export const cookie = createCookieCounter();
