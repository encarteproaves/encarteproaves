import { NextResponse } from 'next/server';

export function middleware(request) {
  // O servidor agora consegue ler o cookie criado no login!
  const token = request.cookies.get('admin_auth')?.value; 
  const url = request.nextUrl.clone();

  // Lista exata das suas páginas internas que precisam de senha
  const rotasProtegidas = ['/admin/pedidos', '/admin/produtos'];

  // Verifica se o usuário está tentando acessar os pedidos ou o estoque
  const precisaDeProtecao = rotasProtegidas.some(rota => url.pathname.startsWith(rota));

  if (precisaDeProtecao && token !== "true") {
    // Se não tiver o cookie, expulsa de volta para a tela de login correta do seu site
    url.pathname = '/admin/login'; 
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// O Next.js vai vigiar apenas as duas páginas internas do seu painel
export const config = {
  matcher: [
    '/admin/pedidos/:path*',
    '/admin/produtos/:path*'
  ], 
};