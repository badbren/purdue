// Customer accounts, localStorage-backed for the local demo.
// When Supabase is wired up this becomes Supabase Auth (which also hashes
// passwords properly — plaintext here is demo-only) + a `profiles` table
// holding username and loyalty points.

export interface Account {
  id: string;
  username: string;
  email: string;
  password: string;
  points: number;
  createdAt: string;
  bio: string;
  /** Customer standing, 0-5 stars. Everyone starts at a clean 5.0. */
  rating: number;
}

const ACCOUNTS_KEY = "perdue_accounts";
const SESSION_KEY = "perdue_session";

/** Fired on window whenever login state changes so the navbar etc. can react. */
export const AUTH_EVENT = "perdue-auth";

/** Fill in fields added after an account was created. */
function normalize(a: Account): Account {
  return { ...a, bio: a.bio ?? "", rating: a.rating ?? 5 };
}

function loadAccounts(): Account[] {
  if (typeof window === "undefined") return [];
  try {
    const raw: Account[] = JSON.parse(
      window.localStorage.getItem(ACCOUNTS_KEY) ?? "[]"
    );
    return raw.map(normalize);
  } catch {
    return [];
  }
}

function saveAccounts(accounts: Account[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function notify() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getCurrentUser(): Account | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  return loadAccounts().find((a) => a.id === id) ?? null;
}

export type RegisterResult =
  | { ok: true; user: Account }
  | { ok: false; error: string };

export function register(input: {
  username: string;
  password: string;
  email: string;
  emailConfirm: string;
}): RegisterResult {
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();
  const emailConfirm = input.emailConfirm.trim().toLowerCase();

  if (username.length < 3)
    return { ok: false, error: "Username needs at least 3 characters." };
  if (!/^[a-zA-Z0-9_.-]+$/.test(username))
    return {
      ok: false,
      error: "Username can only use letters, numbers, dots, dashes, and underscores.",
    };
  if (input.password.length < 6)
    return { ok: false, error: "Password needs at least 6 characters." };
  if (!/^\S+@\S+\.\S+$/.test(email))
    return { ok: false, error: "That email doesn't look right." };
  if (email !== emailConfirm)
    return { ok: false, error: "Emails don't match — double-check them." };

  const accounts = loadAccounts();
  if (accounts.some((a) => a.username.toLowerCase() === username.toLowerCase()))
    return { ok: false, error: "That username is taken — try another." };
  if (accounts.some((a) => a.email === email))
    return { ok: false, error: "There's already an account with that email. Try signing in." };

  const user: Account = {
    id: crypto.randomUUID(),
    username,
    email,
    password: input.password,
    points: 0,
    createdAt: new Date().toISOString(),
    bio: "",
    rating: 5,
  };
  saveAccounts([...accounts, user]);
  window.localStorage.setItem(SESSION_KEY, user.id);
  notify();
  return { ok: true, user };
}

export function login(identifier: string, password: string): RegisterResult {
  const id = identifier.trim().toLowerCase();
  const user = loadAccounts().find(
    (a) => a.username.toLowerCase() === id || a.email === id
  );
  if (!user || user.password !== password)
    return { ok: false, error: "Wrong username/email or password." };
  window.localStorage.setItem(SESSION_KEY, user.id);
  notify();
  return { ok: true, user };
}

export function logout() {
  window.localStorage.removeItem(SESSION_KEY);
  notify();
}

export function getAccountByUsername(username: string): Account | null {
  const u = username.trim().toLowerCase();
  return loadAccounts().find((a) => a.username.toLowerCase() === u) ?? null;
}

export function updateAccount(id: string, patch: Partial<Account>): Account | null {
  const accounts = loadAccounts().map((a) =>
    a.id === id ? { ...a, ...patch } : a
  );
  saveAccounts(accounts);
  notify();
  return accounts.find((a) => a.id === id) ?? null;
}
