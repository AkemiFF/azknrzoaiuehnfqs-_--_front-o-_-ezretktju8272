import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import './../style/globals.css';
import '../util/i18n';
import Layout from "@/layouts/layout";
import { useContext, useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import dynamic from "next/dynamic";
import { LayoutProvider } from "@/layouts/context/layoutContext";
import { appWithTranslation } from "next-i18next";
import ResponsableLayout from "@/layouts/responsable/ResponsableLayout";
import { ResponsableLayoutProvider } from "@/layouts/context/responsableLayoutContext";
import 'react-calendar/dist/Calendar.css';
import { Button } from "primereact/button";
import ChatBot from "@/components/ChatBot";
import { NavigationProvider } from "@/layouts/context/navigation";
import AdminLayout from "@/layouts/admin/AdminLayout";
import AdminLayoutContext, { AdminLayoutProvider } from "@/layouts/context/adminLayoutContext";
import { LocationProvider } from "@/layouts/context/locationContext";
const Loader = dynamic(() => import('@/layouts/Loader'), { ssr: false });



function MyApp({ Component, pageProps }) {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleEnd = () => setLoading(false);
        if (process.env.NODE_ENV === 'production') {
            document.addEventListener('contextmenu', (event) => event.preventDefault());
            document.addEventListener('keydown', (event) => {
                if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'C')) {
                    event.preventDefault();
                }
            });
        }

        Router.events.on("routeChangeStart", handleStart);
        Router.events.on("routeChangeComplete", handleEnd);
        Router.events.on("routeChangeError", handleEnd);
        return () => {
            Router.events.off("routeChangeStart", handleStart);
            Router.events.off("routeChangeComplete", handleEnd);
            Router.events.off("routeChangeError", handleEnd);
        }
    }, [])

    if (router.asPath.includes("/admin") && !Component.getLayout) {
        return (
            <PrimeReactProvider>
                <AdminLayoutProvider>
                    <AdminLayout>
                        {loading && <Loader />}
                        <Component {...pageProps} />
                    </AdminLayout>
                </AdminLayoutProvider>
            </PrimeReactProvider>
        )
    }
    if (router.asPath.includes("/admin") && Component.getLayout) {
        return (
            <PrimeReactProvider>
                <AdminLayoutProvider>
                    {loading && <Loader />}
                    {Component.getLayout(<Component {...pageProps} />)}
                </AdminLayoutProvider>
            </PrimeReactProvider>
        )
    }
    if (router.asPath.includes("/responsable") && !Component.getLayout) {
        return (
            <PrimeReactProvider>
                <NavigationProvider>
                    <ResponsableLayoutProvider>
                        <ResponsableLayout>
                            {loading && <Loader />}
                            {/* <Button onClick={() => setVisible(true)} className="chat_bot_btn" icon="pi pi-comment" />
                            <ChatBot visible={visible} onHide={() => setVisible(false)} /> */}
                            <Component {...pageProps} />
                        </ResponsableLayout>
                    </ResponsableLayoutProvider>
                </NavigationProvider>
            </PrimeReactProvider>
        )
    }
    if (Component.getLayout) {
        return (
            <PrimeReactProvider>
                <NavigationProvider>
                    <ResponsableLayoutProvider>
                        <LocationProvider>
                            <LayoutProvider>
                                {loading && <Loader />}
                                <Button onClick={() => setVisible(true)} className="chat_bot_btn" icon="pi pi-comment" />
                                <ChatBot visible={visible} onHide={() => setVisible(false)} />
                                {Component.getLayout(<Component {...pageProps} />)}
                            </LayoutProvider>
                        </LocationProvider>
                    </ResponsableLayoutProvider>
                </NavigationProvider>
            </PrimeReactProvider>
        );
    }
    else {
        return (
            <PrimeReactProvider>
                <LayoutProvider>
                    <LocationProvider>
                        {loading && <Loader />}
                        <Button onClick={() => setVisible(true)} className="chat_bot_btn" icon="pi pi-comment" />
                        <ChatBot visible={visible} onHide={() => setVisible(false)} />
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </LocationProvider>

                </LayoutProvider>
            </PrimeReactProvider>
        );
    }
}
export default appWithTranslation(MyApp);