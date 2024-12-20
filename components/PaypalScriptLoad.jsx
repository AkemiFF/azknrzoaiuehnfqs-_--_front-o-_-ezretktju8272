import Script from 'next/script';

export default function PayPalScriptLoader() {
    return (
        <Script
            src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT}&currency=EUR`}
            strategy="lazyOnload"
            onError={(e) => {
                console.error('Failed to load PayPal SDK', e);
            }}
        // onLoad={() => {
        //     console.log('PayPal SDK loaded successfully');
        // }}
        />
    );
}
