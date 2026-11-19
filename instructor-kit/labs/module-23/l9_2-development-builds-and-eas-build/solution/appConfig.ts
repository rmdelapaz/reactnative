// Rockpool Survey's app config, reduced to what this lab needs (given: do not edit).
// The real one would be app.config.ts; here it is a plain function so the tests can call it with any env.

const variants = {
  development: { name: 'Rockpool Dev', appId: 'com.example.rockpool.dev' },
  preview: { name: 'Rockpool Preview', appId: 'com.example.rockpool.preview' },
  production: { name: 'Rockpool Survey', appId: 'com.example.rockpool' },
};
export type Variant = keyof typeof variants;

export interface App {
  name: string;
  appId: string;
  cleartext: boolean;
}

function isVariant(value: string): value is Variant {
  return Object.hasOwn(variants, value);
}

export function appFor(env: Record<string, string | undefined>): App {
  const variant = env.APP_VARIANT ?? 'development';
  if (!isVariant(variant)) {
    throw new Error(`APP_VARIANT must be development, preview or production, not "${variant}".`);
  }
  const apiUrl = env.EXPO_PUBLIC_API_URL ?? '';
  if (variant === 'production' && !apiUrl.startsWith('https://')) {
    throw new Error(`A production build needs an https:// EXPO_PUBLIC_API_URL, not "${apiUrl}".`);
  }
  return { ...variants[variant], cleartext: variant === 'preview' };
}
