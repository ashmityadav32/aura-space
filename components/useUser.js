'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
export default function useUser() {
  const [user, setUser] = useState(undefined), path = usePathname();
  useEffect(() => { fetch('/api/auth/me', { cache: 'no-store' }).then((r) => r.json()).then((d) => setUser(d.user)).catch(() => setUser(null)); }, [path]);
  return user; // undefined = loading, null = signed out
}
