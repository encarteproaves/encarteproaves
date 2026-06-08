import { NextResponse } from 'next/server';

export function middleware(request) {
  // Captura o cookie de login do painel
  const token = request.cookies.get('auth_token')?.value; 
  const url = request.nextUrl.clone();

  // Se o usuário estiver na tela de login, não faz nada, deixa ele entrar para digitar a senha
  // IMPORTANTE: Se a sua página de login for '/login' em vez de '/admin-login', altere abaixo.
  if (url.pathname === '/login') {
    return NextResponse.next();
  }

  // Lista de caminhos administrativos que queremos trancar com senha
  const rotasProtegidas = ['/admin/produtos', '/admin/estoque', '/cadastro'];

  // Verifica se a página atual precisa de proteção
  const precisaDeProtecao = rotasProtegidas.some(rota => url.pathname.startsWith(rota));

  if (precisaDeProtecao && !token) {
    // Se o invasor tentar entrar direto sem senha, joga ele para a tela de login
    url.pathname = '/login'; // <-- Altere para a sua rota real onde você digita a senha
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// CONFIGURAÇÃO DO MATCHER (Quais rotas o Next.js vai vigiar)
export const config = {
  matcher: [
    '/admin/produtos/:path*',
    '/admin/estoque/:path*',
    '/cadastro/:path*'
  ], 
};