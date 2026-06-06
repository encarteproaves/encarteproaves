import { NextResponse } from 'next/server';

export function middleware(request) {
  // Captura o cookie de login.
  // IMPORTANTE: Se o seu sistema usar outro nome de cookie (ex: 'session', 'token'), 
  // mude a palavra 'auth_token' abaixo para o nome correto.
  const token = request.cookies.get('auth_token')?.value; 
  const url = request.nextUrl.clone();

  // Lista de rotas que vão exigir a senha
  const rotasProtegidas = ['/admin', '/produtos', '/cadastro', '/estoque'];

  // Verifica se o usuário está tentando acessar uma das áreas administrativas
  const precisaDeProtecao = rotasProtegidas.some(rota => url.pathname.startsWith(rota));

  if (precisaDeProtecao) {
    // Se não tiver o token de login, expulsa para a página de login/admin
    if (!token) {
      url.pathname = '/admin'; // Altere para '/login' se a sua tela de senha for outra rota
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// O Next.js vai monitorar essas rotas e suas subpastas automaticamente
export const config = {
  matcher: [
    '/admin/:path*', 
    '/produtos/:path*', 
    '/cadastro/:path*', 
    '/estoque/:path*'
  ], 
};