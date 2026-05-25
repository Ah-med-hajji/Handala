import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === 'admin123') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('mock-admin-session', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
    });
    return response;
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
