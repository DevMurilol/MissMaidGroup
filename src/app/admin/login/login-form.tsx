"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="from" value={from} />
      <label className="flex flex-col gap-2">
        <span className="font-heading text-sm font-semibold text-neutral-800">Email</span>
        <input name="email" type="email" required autoComplete="username" className="input-field" placeholder="admin@missmaidgroup.com.au" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-heading text-sm font-semibold text-neutral-800">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="input-field" placeholder="••••••••" />
      </label>

      {state.error ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 cursor-pointer rounded-[var(--radius-brand)] bg-brand-500 px-5 py-3 font-heading font-semibold text-white transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
