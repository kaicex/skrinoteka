import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, что appId не undefined в URL
  if (pathname.includes('/undefined')) {
    return NextResponse.redirect(new URL('/browse/mobile', request.url));
  }

  // Разрешаем доступ ко всем маршрутам
  return NextResponse.next();
}
