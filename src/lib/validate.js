

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Food Distribution",
  "Clothes Distribution",
  "Blanket Distribution",
  "Blood Donation",
  "Education Program",
  "Health Camp",
  "Community Awareness",
];

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}


export function isValidPassword(value) {
  const password = String(value ?? "");
  return (
    password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password)
  );
}

export function isValidUrl(value) {
  try {
    const url = new URL(String(value).trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}


export function isFutureDate(value) {
  if (!value) return false;
  const date = new Date(value);
  return date.getTime() > startOfToday().getTime();
}

export function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
