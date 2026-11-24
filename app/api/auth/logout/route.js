import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function POST() { cookies().delete('aura_session'); return NextResponse.json({ ok: true }); }
