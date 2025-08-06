function getCookie(name) {
  const pairs = document.cookie.split("; ").map((s) => s.split("="));
  const match = pairs.find(([key]) => key === name);
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${d.toUTCString()};path=/`;
}

function getProgressCookie() {
  try {
    const raw = getCookie("puzzleProgress");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveProgressCookie(level) {
  try {
    const progress = getProgressCookie();
    progress[level] = true;
    setCookie("puzzleProgress", JSON.stringify(progress));
    return true;
  } catch (e) {
    return false;
  }
}
