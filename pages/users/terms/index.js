'use client'

import Head from 'next/head'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { useTranslation } from 'react-i18next'

export default function TermsPage() {
    const { t } = useTranslation()

    const sections = [
        {
            id: 'acceptance',
            title: t('terms.acceptance.title'),
            content: t('terms.acceptance.content')
        },
        {
            id: 'services',
            title: t('terms.services.title'),
            content: t('terms.services.content')
        },
        {
            id: 'registration',
            title: t('terms.registration.title'),
            content: t('terms.registration.content')
        },
        {
            id: 'booking',
            title: t('terms.booking.title'),
            content: t('terms.booking.content')
        },
        {
            id: 'responsibilities',
            title: t('terms.responsibilities.title'),
            content: t('terms.responsibilities.content')
        },
        {
            id: 'intellectual',
            title: t('terms.intellectual.title'),
            content: t('terms.intellectual.content')
        },
        {
            id: 'privacy',
            title: t('terms.privacy.title'),
            content: t('terms.privacy.content')
        },
        {
            id: 'termination',
            title: t('terms.termination.title'),
            content: t('terms.termination.content')
        }
    ]

    return (
        <>
            <Head>
                <title>{t('terms.pageTitle')} | Aftrip</title>
                <meta name="description" content={t('terms.metaDescription')} />
            </Head>

            <main className="min-h-screen bg-[#F5F7F7] py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-lg">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-[#45746A] mb-4">
                                {t('terms.pageTitle')}
                            </h1>
                            <p className="text-gray-600">
                                {t('terms.lastUpdated', { date: '2024-01-20' })}
                            </p>
                        </div>

                        <div className="space-y-8">
                            {sections.map((section, index) => (
                                <div key={section.id}>
                                    <div className="mb-4">
                                        <h2 className="text-xl font-semibold text-[#45746A] mb-3">
                                            {section.title}
                                        </h2>
                                        <p className="text-gray-700 leading-relaxed">
                                            {section.content}
                                        </p>
                                    </div>
                                    {index < sections.length - 1 && (
                                        <Divider className="my-6" />
                                    )}
                                </div>
                            ))}

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h2 className="text-xl font-semibold text-[#45746A] mb-3">
                                    {t('terms.contact.title')}
                                </h2>
                                <p className="text-gray-700">
                                    {t('terms.contact.content')}
                                    <a
                                        href="mailto:support@craft-aftrip.com"
                                        className="text-[#45746A] hover:underline"
                                    >
                                        support@craft-aftrip.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </>
    )
}

