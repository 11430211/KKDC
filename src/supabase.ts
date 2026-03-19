// Local stub replacing Supabase client to avoid external network calls.
// Provides the minimal auth API surface used by the app: `auth.getSession()` and `auth.signInWithPassword()`.

type Session = { user: any; access_token: string } | null;

const LOCAL_USER_KEY = 'local_supabase_user';

const auth = {
  async getSession() {
    try {
      const raw = localStorage.getItem(LOCAL_USER_KEY);
      if (!raw) return { data: { session: null } };
      const session = JSON.parse(raw);
      return { data: { session } };
    } catch (e) {
      return { data: { session: null } };
    }
  },
  async signInWithPassword({ email }: { email: string }) {
    // Simple local sign-in: create a fake user with the provided email
    const user = { id: 'local-' + (email || 'anon'), email };
    const session = { user, access_token: 'local-token-' + Date.now() };
    try {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(session));
      return { data: { session }, error: null };
    } catch (e: any) {
      return { data: { session: null }, error: { message: String(e && e.message) } };
    }
  },
  async signOut() {
    localStorage.removeItem(LOCAL_USER_KEY);
    return { error: null };
  }
};

const supabase = { auth };

export default supabase;
