/* Convert auth provider errors into short messages suitable for a toast. */
export function mapAuthError(error) {
  const message = error?.message || error?.response?.data?.message || "";

  if (/invalid email or password/i.test(message)) return "Invalid email or password.";
  if (/already exists|registered|in use/i.test(message)) {
    return "An account with this email already exists.";
  }
  if (message) return message.charAt(0).toUpperCase() + message.slice(1);
  return "Something went wrong. Please try again.";
}

/* Keep auth redirects inside this app. */
export function safeRedirect(value, fallback = "/") {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }

  try {
    const target = new URL(value, "https://sebak.invalid");
    if (target.origin !== "https://sebak.invalid") return fallback;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}
