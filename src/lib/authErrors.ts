/** Maps auth error messages to short bilingual copy for the sign-in / sign-up forms. */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email 或密碼不正確。Incorrect email or password.";
  if (m.includes("already registered") || m.includes("already exists"))
    return "這個 email 已經註冊過，請直接登入。This email is already registered.";
  if (m.includes("weak") || m.includes("easy to guess"))
    return "這組密碼太常見，請換一組更安全的密碼。This password is too easy to guess.";
  if (m.includes("password")) return `密碼不符合要求。${message}`;
  if (m.includes("rate limit")) return "嘗試次數太多，請稍後再試。Too many attempts, try again later.";
  return message;
}
