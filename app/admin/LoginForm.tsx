'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from './actions';

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, { error: null });

  return (
    <div className="min-h-screen bg-[#0A1316] text-[#F0E8DA] grid place-items-center px-6" style={{ fontFamily: "'Archivo', system-ui, sans-serif" }}>
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-10">
          <div className="font-black text-[48px] leading-none tracking-[-0.04em] mb-2">
            P<span className="font-thin">11</span>
          </div>
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#F0E8DA]/50">
            Admin / Sign in
          </div>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-[11px] tracking-[0.02em] uppercase text-[#F0E8DA]/50 mb-2">
              Access PIN
            </label>
            <input
              type="password"
              name="pin"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full bg-transparent border border-[#F0E8DA]/20 focus:border-[#C9A961] px-4 py-3 text-[15px] tracking-[0.02em] outline-none transition-colors"
            />
          </div>

          {state?.error && (
            <div className="text-[13px] text-[#C9A961]">{state.error}</div>
          )}

          <Submit />
        </form>

        <div className="mt-10 text-center text-[11px] tracking-[0.02em] text-[#F0E8DA]/30">
          Forgot the PIN? Check your <code>.env.local</code> file.
        </div>
      </div>
    </div>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#F0E8DA] text-[#0A1316] hover:bg-[#C9A961] transition-colors px-4 py-3 text-[13px] tracking-[0.02em] font-medium disabled:opacity-50"
    >
      {pending ? 'Signing in…' : 'Sign in →'}
    </button>
  );
}
