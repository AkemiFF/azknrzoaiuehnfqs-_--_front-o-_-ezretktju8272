import Head from "next/head";
import style from './../../../../style/pages/responsable/accommodation/setting.module.css';
import { useContext, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import ResponsableLayoutContext from "@/layouts/context/responsableLayoutContext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useTranslation } from "react-i18next";
export default function Help() {
    const { t } = useTranslation();
    const router = useRouter();
    const { user, setUser } = useContext(ResponsableLayoutContext);



    const [menuSidebar, setMenuSidebar] = useState([
        { label: "Profil" },
        { label: "Info" },
        { label: "Commission" },
        { label: "Notification" },
        { label: "Security" },
        { label: "Help" }
    ]);

    const menu = 4;
    const policySections = [
        { key: 'overview', title: t('policy.overview.title'), content: t('policy.overview.text') },
        {
            key: 'commission_structure', title: t('policy.commission_structure.title'), content: [
                { key: 'standard_commission_rate', title: t('policy.commission_structure.standard_commission_rate.title'), content: t('policy.commission_structure.standard_commission_rate.text') },
                { key: 'commission_variations', title: t('policy.commission_structure.commission_variations.title'), content: t('policy.commission_structure.commission_variations.text') },
            ]
        },
        {
            key: 'commission_calculation', title: t('policy.commission_calculation.title'), content: [
                { key: 'booking_confirmation', title: t('policy.commission_calculation.booking_confirmation.title'), content: t('policy.commission_calculation.booking_confirmation.text') },
                { key: 'commissionable_amount', title: t('policy.commission_calculation.commissionable_amount.title'), content: t('policy.commission_calculation.commissionable_amount.text') },
            ]
        },
        {
            key: 'payment_terms', title: t('policy.payment_terms.title'), content: [
                { key: 'payment_schedule', title: t('policy.payment_terms.payment_schedule.title'), content: t('policy.payment_terms.payment_schedule.text') },
                { key: 'payment_method', title: t('policy.payment_terms.payment_method.title'), content: t('policy.payment_terms.payment_method.text') },
            ]
        },
        {
            key: 'dispute_resolution', title: t('policy.dispute_resolution.title'), content: [
                { key: 'dispute_submission', title: t('policy.dispute_resolution.dispute_submission.title'), content: t('policy.dispute_resolution.dispute_submission.text') },
                { key: 'dispute_resolution_process', title: t('policy.dispute_resolution.dispute_resolution_process.title'), content: t('policy.dispute_resolution.dispute_resolution_process.text') },
            ]
        },
        { key: 'policy_updates', title: t('policy.policy_updates.title'), content: t('policy.policy_updates.text') }
    ];
    const helpSections = [
        {
            key: 'getting_started', title: t('help.getting_started.title'), content: t('help.getting_started.text'), steps: [
                { key: 'create_account', title: t('help.getting_started.steps.0.title'), content: t('help.getting_started.steps.0.text') },
                { key: 'add_accommodation', title: t('help.getting_started.steps.1.title'), content: t('help.getting_started.steps.1.text') },
                { key: 'manage_reservations', title: t('help.getting_started.steps.2.title'), content: t('help.getting_started.steps.2.text') }
            ]
        },
        {
            key: 'managing_accommodations', title: t('help.managing_accommodations.title'), content: t('help.managing_accommodations.text'), sections: [
                { key: 'edit_accommodation', title: t('help.managing_accommodations.sections.0.title'), content: t('help.managing_accommodations.sections.0.text') },
                { key: 'delete_accommodation', title: t('help.managing_accommodations.sections.1.title'), content: t('help.managing_accommodations.sections.1.text') }
            ]
        },
        {
            key: 'reservations_and_commissions', title: t('help.reservations_and_commissions.title'), content: t('help.reservations_and_commissions.text'), sections: [
                { key: 'view_reservations', title: t('help.reservations_and_commissions.sections.0.title'), content: t('help.reservations_and_commissions.sections.0.text') },
                { key: 'understanding_commissions', title: t('help.reservations_and_commissions.sections.1.title'), content: t('help.reservations_and_commissions.sections.1.text') }
            ]
        },
        {
            key: 'support_and_contact', title: t('help.support_and_contact.title'), content: t('help.support_and_contact.text'), contactMethods: [
                { key: 'email', method: t('help.support_and_contact.contact_methods.0.method'), details: t('help.support_and_contact.contact_methods.0.details') },
                { key: 'live_chat', method: t('help.support_and_contact.contact_methods.1.method'), details: t('help.support_and_contact.contact_methods.1.details') },
                { key: 'faq', method: t('help.support_and_contact.contact_methods.2.method'), details: t('help.support_and_contact.contact_methods.2.details') }
            ]
        }
    ];

    return (
        <>
            <Head>
                <title>Help</title>
            </Head>

            <div className={style.container}>
                <div className={style.left_container}>
                    <div className={style.left_top_container}>
                        <span className={style.left_top_subtitle}>{menuSidebar[menu].label}</span>
                        <span className={style.left_top_title}>{user ? user.nom_hebergement : null}</span>
                    </div>
                    <div className={style.left_body_container}>
                        {menuSidebar.map((item, index) => {
                            return <Button key={index} onClick={() => router.push("/responsable/accommodation/setting/" + item.label.toLowerCase())} text className={menu == index ? "button-secondary" : style.text_button} raised={menu == index ? true : false} label={item.label} />
                        })}
                    </div>
                </div>
                <div className={style.right_body_container}>
                    <br />
                    <span className={style.left_top_title}>Base section</span>
                    <hr />

                    <Accordion multiple activeIndex={[]}>
                        {helpSections.map(section => (
                            <AccordionTab key={section.key} header={section.title}>
                                {/* Si la section contient un tableau (comme les steps ou les sous-sections), on affiche les sous-éléments */}
                                {section.steps ? (
                                    section.steps.map(step => (
                                        <div key={step.key}>
                                            <span><b>{step.title}</b></span>
                                            <p>{step.content}</p>
                                        </div>
                                    ))
                                ) : section.sections ? (
                                    section.sections.map(subSection => (
                                        <div key={subSection.key}>
                                            <span><b>{subSection.title}</b></span>
                                            <p>{subSection.content}</p>
                                        </div>
                                    ))
                                ) : section.contactMethods ? (
                                    section.contactMethods.map(method => (
                                        <div key={method.key}>
                                            <span><b>{method.method}</b></span>
                                            <p>{method.details}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>{section.content}</p>
                                )}
                            </AccordionTab>
                        ))}
                    </Accordion>

                    <br />

                    <span className={style.left_top_title}>Commission section</span>
                    <hr />

                    <Accordion multiple activeIndex={[]}
                    >
                        {policySections.map(section => (
                            <AccordionTab key={section.key} header={section.title} >
                                {Array.isArray(section.content) ? (
                                    section.content.map(subSection => (
                                        <div key={subSection.key}>
                                            <span><b>{subSection.title}</b></span>
                                            <p>{subSection.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>{section.content}</p>
                                )}
                            </AccordionTab>
                        ))}
                    </Accordion>
                </div>
            </div>
        </>
    )
}