import Head from "next/head";
import { useRouter } from "next/router";
import style from './../../../style/pages/responsable/accommodation/message.module.css';
import { Button } from "primereact/button";
import { useContext, useState } from "react";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
export default function Message() {
    const router = useRouter();
    const { user } = useContext(ResponsableLayoutContext);


    const [messages, setMessages] = useState([
        /*  { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." },
         { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." },
         { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." },
         { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." },
         { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." },
         { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." },
         { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." },
         { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." },
         { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." },
         { id: 1, sender: "jean@gmail.com", text: "Lorem ipsum dolor sit amet takimata vero dolore. Lorem minim ullamcorper in aliquyam molestie diam diam." }
  */
    ]);


    return (
        <>
            <Head>
                <title>Message </title>
            </Head>

            <div className={style.top_container}>
                <div className={style.top_container_title_container}>
                    <span className={style.top_container_title}>Message</span>
                    <span className={style.top_container_subtitle}>{user ? user.nom_hebergement : null}</span>

                </div>
            </div>

            <div className={style.container}>
                <div className={style.left_container}>
                    <Button className="button-primary" icon="pi pi-pencil" label="New Message" />
                    <Button text severity="secondary" icon="pi pi-inbox" label="Inbox" />
                    <Button text severity="secondary" icon="pi pi-send" label="Send" />
                </div>
                <div className={style.right_container}>
                    <div className={style.right_top_container}>
                        <span className={style.right_top_title}>Inbox</span>
                        <span className={style.right_top_subtitle}>0 messages</span>
                    </div>
                    <div className={style.separateur}></div>
                    {messages.map((message, index) => {
                        return (
                            <div key={index} className={style.message_container}>
                                <span className={style.message_sender}>{message.sender}</span>
                                <span className={style.message_text}>{message.text}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}