import { Head, Html, Main, NextScript } from 'next/document';

function Document() {
    return (
        <Html>
            <Head>
                <meta name="description" content="Aftrip website" />
                <link rel="shortcut icon" href="/images/logo-aftrip.png" type="image/x-icon" />
                <meta name="keywords" content="voyage, artisanat, tourisme, hébergement, Aftrip" />
                <meta name="author" content="AkeTech Agency" />
                <meta property="og:title" content="Aftrip - Explorez l'artisanat et le tourisme local" />
                <meta property="og:description" content="Aftrip vous permet de découvrir et réserver des expériences uniques en artisanat et tourisme." />
                <meta property="og:image" content="/images/logo-aftrip.png" />
                <meta property="og:url" content="https://craft-aftrip.com" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Aftrip - Explorez l'artisanat et le tourisme local" />
                <meta name="twitter:description" content="Aftrip vous permet de découvrir et réserver des expériences uniques en artisanat et tourisme." />
                <meta name="twitter:image" content="/images/logo-aftrip.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
                {/* <Script
                    src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT}&currency=EUR`}
                    strategy="beforeInteractive"
                /> */}
                {process.env.NODE_ENV === 'production' && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function() {
                                    const noop = () => {};
                                    console.log = noop;
                                    console.info = noop;
                                    console.warn = noop;
                                    console.error = noop;
                                    console.debug = noop;
                                    console.dir = noop;
                                    console.dirxml = noop;
                                    console.trace = noop;
                                    console.assert = noop;
                                    console.group = noop;
                                    console.groupCollapsed = noop;
                                    console.groupEnd = noop;
                                })();
                                `,
                        }}
                    />
                )}

            </body>
        </Html>
    );
}

export default Document;
