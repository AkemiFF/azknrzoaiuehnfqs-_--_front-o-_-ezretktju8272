import { NextResponse } from 'next/server';

export function middleware(req) {
    const admin_token = req.cookies.get('yesthisisanotherpaimon');
    const responsable_token = req.cookies.get('responsable_refresh_token');
    const url = req.nextUrl.clone();

    if (url.pathname === '/') {
        return NextResponse.redirect(new URL('/users', req.url));
    }

    // Redirection pour la page de connexion admin
    if (url.pathname.startsWith('/admin/login')) {
        if (admin_token) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }
        return NextResponse.next();
    }

    // Redirection pour les chemins responsables
    if (url.pathname.startsWith('/responsable')) {
        if (!responsable_token) {
            return NextResponse.redirect(new URL('/users/etablissement/login', req.url));
        }
        return NextResponse.next();
    }

    // Redirection pour les chemins admin protégés
    if (url.pathname.startsWith('/admin')) {
        if (!admin_token) {
            return NextResponse.redirect(new URL('/404', req.url));
        }
        return NextResponse.next();
    }
    const response = NextResponse.next()


    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

    // Pour les autres cas
    return response;
}

export const config = {
    matcher: ['/:path*'],
};
