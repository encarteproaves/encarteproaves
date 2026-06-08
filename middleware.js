import { NextResponse } from 'next/server';

export function middleware(request) {
  // Captura o cookie de login
  const token = request.cookies.get('auth_token')?.value; 
  const url = request.nextUrl.clone();

  // Se o usuário JÁ ESTIVER na página de login (/admin), não faça nada! Deixe ele entrar.
  if (url.pathname === '/admin') {
    return NextResponse.next();
  }

  // Lista de OUTRAS rotas administrativas que precisam de proteção
  const rotasProtegidas = ['/produtos', '/cadastro', '/estoque'];

  // Verifica se ele tenta acessar o estoque ou cadastro sem estar logado
  const precisaDeProtecao = rotasProtegidas.some(rota => url.pathname.startsWith(rota));

  if (precisaDeProtecao && !token) {
    // Se não tiver o token, joga ele para a tela de login (/admin) de forma segura
    url.pathname = '/admin'; 
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// O Next.js vai monitorar apenas as rotas que precisam de validação
export const config = {
  matcher: [
    '/produtos/:path*', 
    '/cadastro/:path*', 
    '/estoque/:path*'
  ], 
};