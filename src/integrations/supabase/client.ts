import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Guard: if env vars are missing (e.g. prerender, local dev without .env,
// or production where Supabase has been deprecated portfolio-wide), return
// a no-op stub instead of throwing and white-screening the app.
//
// The previous stub (`new Proxy({}, { get: () => () => Promise.resolve(...) })`)
// only handled ONE level of chaining — any second call in a chain
// (`.from(x).select(y)`, `.auth.getSession()`) threw "is not a function",
// because the returned Promise/function has no `.select`/`.getSession`.
// This version returns the exact shape each real Supabase method resolves,
// including nested fields callers destructure (`data.session`,
// `data.subscription.unsubscribe`), so no caller ever throws.
function createNoopClient(): unknown {
  const queryResult = Promise.resolve({ data: null, error: null });
  // A query builder that's both chainable (.select/.eq/.order/.limit/...
  // all return itself) and thenable (awaiting it resolves {data:null,error:null}).
  const queryBuilder: unknown = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'then') return queryResult.then.bind(queryResult);
        if (prop === 'catch') return queryResult.catch.bind(queryResult);
        if (prop === 'finally') return queryResult.finally.bind(queryResult);
        return () => queryBuilder;
      },
    }
  );

  const authError = { message: 'Authentication is not configured.', name: 'AuthApiError', status: 500 };

  return {
    from: () => queryBuilder,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: authError }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: authError }),
      signOut: () => Promise.resolve({ error: null }),
    },
    functions: {
      invoke: () => Promise.resolve({ data: null, error: { message: 'Not configured' } }),
    },
  };
}

export const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : (createNoopClient() as unknown as Database);