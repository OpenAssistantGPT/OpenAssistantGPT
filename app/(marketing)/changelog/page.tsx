import { siteConfig } from '@/config/site'
import { twMerge } from 'tailwind-merge'

export default function ChangelogPage() {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full text-center p-8 pb-24">
                <h1 className="w-full text-lg">Changelog</h1>
                <p className="w-full text-4xl text-neutral-500 mt-3">
                    What&apos;s new in {siteConfig.name}?
                </p>
            </div>
            <div className="p-4 max-w-screen-sm">
                <Release
                    isFirst={true}
                    version="0.2.0"
                    date="2024-05-10"
                    new={[
                        {
                            title: 'New Chatbot Window UI',
                            description:
                                "We improved UI to make it look better. We also now have an integration via IFrame which means no more CSS conflicts and a smoother user experience.",
                            image: new URL(
                                '/public/new_chatbot_ui.png',
                                import.meta.url,
                            ).toString(),
                        },
                    ]}
                />
                <Release
                    isFirst={true}
                    version="0.1.2"
                    date="2024-05-1"
                    new={[
                        {
                            title: 'Import Assistant from OpenAI',
                            description:
                                "You can now import an assistant that you've trained on OpenAI in our app without having to recreate everything.",
                            image: new URL(
                                '/public/import_assistant.png',
                                import.meta.url,
                            ).toString(),
                        },
                    ]}
                />
                <Release
                    isFirst={true}
                    version="0.1.1"
                    date="2024-04-28"
                    new={[
                        {
                            title: 'Email notifications',
                            description:
                                "We now have email notifications! You'll receive an email when you receive a new user inquiry.",
                            image: new URL(
                                '/public/email_test_image.png',
                                import.meta.url,
                            ).toString(),
                        },
                    ]}
                    improvements={[
                        {
                            title: 'Improve list of valid file extensions',
                            description:
                                'Update the list of valid file extensions to match OpenAI list.',
                        },
                    ]}
                />
                <Release
                    version="0.1.0"
                    date="2024-04-15"
                    new={[
                        {
                            title: 'New dashboard tile',
                            description:
                                'You can now see your recent user inquiry and chatbot errors in the main dashboard.',
                            image: new URL(
                                '/public/dashboard_improvement.png',
                                import.meta.url,
                            ).toString(),
                        },
                        {
                            title: 'Chatbot Error Tracking',
                            description:
                                'We now track chatbot errors and display them in the dashboard. We this feature you can easily see what went wrong and fix it.',
                        },
                    ]}
                />
            </div>
        </div>
    )
}

function Release(props: { isFirst?: boolean; version: string; date: string; new?: any[]; improvements?: any[]; bugs?: any[] }) {
    return (
        <div
            className={twMerge(
                'flex flex-col gap-4 border-t pt-4 mt-8',
                props.isFirst && 'border-t-0 mt-0',
            )}
        >
            <div>
                <div className="font-bold text-3xl">
                    Version <span className="">{props.version}</span>
                </div>
                <div className="text-neutral-500 font-semibold">{props.date}</div>
            </div>
            {props.new && (
                <div className="grid grid-cols-1 gap-3">
                    <span className="font-semibold text-xs uppercase bg-emerald-500 border border-emerald-600 text-white px-1.5 py-0.5 rounded w-fit">
                        New
                    </span>
                    <div className="flex flex-col gap-2">
                        {props.new?.map((item, index) => (
                            <div className="mb-2" key={`new-${index}`}>
                                <div className="font-bold pb-1 text-base">🎉 {item.title}</div>
                                <div className="text-neutral-500 text-sm pb-3">
                                    {item.description}
                                </div>
                                {item.image && (
                                    <img
                                        src={item.image}
                                        className="w-2/3 rounded shadow border mb-2"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {props.improvements && (
                <div className="grid grid-cols-1 gap-3">
                    <span className="font-semibold text-xs uppercase bg-blue-500 border border-blue-600 text-white px-1.5 py-0.5 rounded w-fit">
                        Improvements
                    </span>
                    <div className="flex flex-col gap-2">
                        {props.improvements?.map((item, index) => (
                            <div className="mb-2" key={`improvements-${index}`}>
                                <div className="font-bold pb-1 text-base">🚀 {item.title}</div>
                                <div className="text-neutral-500 text-sm pb-3">
                                    {item.description}
                                </div>
                                {item.image && (
                                    <img
                                        src={item.image}
                                        className="w-2/3 rounded shadow border mb-2"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {props.bugs && (
                <div className="grid grid-cols-1 gap-3">
                    <span className="font-semibold text-xs uppercase bg-rose-500 border border-rose-600 text-white px-1.5 py-0.5 rounded w-fit">
                        Bugs
                    </span>
                    <div className="flex flex-col gap-2">
                        {props.bugs?.map((item, index) => (
                            <div className="mb-2" key={`bugs-${index}`}>
                                <div className="font-bold pb-1 text-base">🐛 {item.title}</div>
                                <div className="text-neutral-500 text-sm pb-3">
                                    {item.description}
                                </div>
                                {item.image && (
                                    <img
                                        src={item.image}
                                        className="w-2/3 rounded shadow border mb-2"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}