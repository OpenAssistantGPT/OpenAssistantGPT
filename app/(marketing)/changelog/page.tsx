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
                    version="0.2.20"
                    date="2024-07-08"
                    new={[
                        {
                            title: 'Network Security',
                            description: 'You can now make chatbot fully private, only accessible by your IP. This will prevent unauthorized access to your chatbot. You can also ban specific IPs from accessing the chatbot.',
                            image: new URL(
                                '/public/network_security.png',
                                import.meta.url,
                            ).toString()
                        },
                    ]}
                />
                <Release
                    version="0.2.19"
                    date="2024-06-28"
                    new={[
                        {
                            title: 'Multiple line text input instead of single line',
                            description: 'Now the text input in the chatbot is a multiple line input. This will allow you to write longer messages in the chatbot. The input will grow as you write more text.',
                        },
                        {
                            title: 'Input style',
                            description: 'You can now choose default input style or max width input style in the chatbot. This will allow you to choose the style of the input in the chatbot.',
                            image: new URL(
                                '/public/new_input_style.png',
                                import.meta.url,
                            ).toString()
                        },
                    ]}
                />
                <Release
                    version="0.2.18"
                    date="2024-06-26"
                    new={[
                        {
                            title: 'User message attachments',
                            description: 'We now use message instead of updating the thread. This will allow you to attach files to a message. The chatbot will then analyse the file and provide a response. You\'ll get better result',
                        },
                    ]}
                />
                <Release
                    version="0.2.17"
                    date="2024-06-23"
                    new={[
                        {
                            title: 'Default messages',
                            description: 'You can now set default messages for your chatbot. This will allow you to set a message that will be displayed when the chatbot is loaded. You can set this message in the chatbot IFRAME url.',
                            image: new URL(
                                '/public/default_message.png',
                                import.meta.url,
                            ).toString()
                        },
                    ]}
                />
                <Release
                    version="0.2.16"
                    date="2024-06-21"
                    new={[
                        {
                            title: 'Create new modal for the OpenAI configuration',
                            description: 'Now when you need to configure OpenAI, a new modal will be displayed. This will allow you to configure OpenAI without leaving the page.',
                            image: new URL(
                                '/public/new_openai_modal.png',
                                import.meta.url,
                            ).toString()
                        },
                    ]}
                />
                <Release
                    version="0.2.15"
                    date="2024-06-19"
                    improvements={[
                        {
                            title: 'Chatbox UX Improvements',
                            description: 'Now the text size is smaller in the chatbox. This will allow you to see more messages in the chatbox. The header is also sticky when you scroll down. This will allow you to always see the chatbox header.',
                            image: new URL(
                                '/public/file_attachements_v2.png',
                                import.meta.url,
                            ).toString()
                        },
                    ]}
                    bugs={[
                        {
                            title: 'Fix issue in mobile when link was too long',
                            description: 'We add a new CSS rule to prevent the link from overflowing the chatbox. Now the link will be displayed on multiple lines if it is too long.'
                        }
                    ]}
                />
                <Release
                    version="0.2.14"
                    date="2024-06-16"
                    improvements={[
                        {
                            title: 'Hangle Right to Left languages',
                            description: 'We now support right to left languages in the chatbot. This will allow you to use languages like Arabic, Hebrew and more.',
                        },
                    ]}
                />
                <Release
                    version="0.2.13"
                    date="2024-06-14"
                    improvements={[
                        {
                            title: 'Improve how file attachments works',
                            description: 'Better UX when uploading files in the chatbot. We now display the file name and we can also remove the file from the chat.',
                            image: new URL(
                                '/public/file_attachements_v2.png',
                                import.meta.url,
                            ).toString()
                        },
                    ]}
                />
                <Release
                    version="0.2.12"
                    date="2024-06-09"
                    improvements={[
                        {
                            title: 'Add validation for the max_completion_tokens and max_prompt_tokens',
                            description: 'In the advanced settings of your chatbot, you can now configure the max_completion_tokens and max_prompt_tokens. We added validation to prevent you from entering a value lower than 256. This will prevent the chatbot from returning an error when the value is too low.',
                        },
                    ]}
                />
                <Release
                    version="0.2.11"
                    date="2024-06-09"
                    new={[
                        {
                            title: 'Messages Export',
                            description: 'This feature is created for exporting messages from your chatbot. This feature will generate a JSON file with all the messages received by a chatbot.',
                            image: new URL(
                                '/public/exports.png',
                                import.meta.url,
                            ).toString()
                        },
                    ]}
                />
                <Release
                    version="0.2.10"
                    date="2024-06-07"
                    new={[
                        {
                            title: 'Copy to clipboard feature',
                            description: 'Now you can copy to your clipboard the chatbot response by clicking on the copy icon in the chat.',
                        },
                    ]}
                    improvements={[
                        {
                            title: 'We added Z index on the chatbot HTML code',
                            description: 'This will prevent the chatbot from being hidden by other elements on the page.',
                        },
                    ]}
                />
                <Release
                    version="0.2.9"
                    date="2024-06-03"
                    new={[
                        {
                            title: 'Configure max_completion_tokens and max_prompt_tokens',
                            description: 'Now in the advanced settings of your chatbot, you can configure the max_completion_tokens and max_prompt_tokens. This will allow you to control the number of tokens used in the completion and prompt.',
                        },
                    ]}
                    bugs={[
                        {
                            title: 'Fix issue while customizing the chatbot could create infinite loading',
                            description: 'Now we can update the chatbot customization without having an infinite loading issue.',
                        },

                    ]}
                />
                <Release
                    version="0.2.8"
                    date="2024-06-02"
                    new={[
                        {
                            title: 'You can now unsubscribe from marketing emails',
                            description: 'New feature to unsubscribe from marketing emails. You can now manage your communication preferences in the settings page.',
                        },
                    ]}
                />
                <Release
                    version="0.2.7"
                    date="2024-06-01"
                    new={[
                        {
                            title: 'Free trials!',
                            description: 'You can now try our basic and pro plan for free for 7 days. It will give you access to all the features of the plan.',
                        },
                        {
                            title: 'Enable auto scroll in chatbox',
                            description: 'We re-enabled the auto scroll in the chatbox. This will make the chatbox scroll to the bottom when a new message is received.',
                        }
                    ]}
                />
                <Release
                    version="0.2.6"
                    date="2024-05-29"
                    new={[
                        {
                            title: 'Chat file attachments',
                            description: 'User in the chat can now upload files, images and more to the chatbot. The chatbot will then analyse the file and provide a response. It uses the "code_execution" function in OpenAI',
                            image: new URL(
                                '/public/file_attachements.png',
                                import.meta.url,
                            ).toString()
                        },
                        {
                            title: 'Display images generated by Assistant in the chat',
                            description: 'When the assistant generates an image, it will now be displayed in the chat.',
                            image: new URL(
                                '/public/pie_chart.png',
                                import.meta.url,
                            ).toString()
                        }
                    ]}
                    improvements={[
                        {
                            title: 'Chatbotjs script now migrates you to the latest version',
                            description: 'You will automaticly get migrated to our iframe version of the chatbot when you use the chatbotjs script.',
                        },
                        {
                            title: 'Removed 3$ pricing plans',
                            description: 'For a better futur of the project we are removing the 3$ pricing plans. With Stripe fees, taxes and server costs we can not sustain this pricing plan. Users who already have this pricing plan will keep it and still pay 3$.',
                        }
                    ]}
                />
                <Release
                    version="0.2.5"
                    date="2024-05-25"
                    new={[
                        {
                            title: 'Change Chatbot Logo image in chatbox',
                            description: 'You can now update Chatbot Logo in the Chatbox, this will help you to personalize your chatbot even more.',
                        }
                    ]}
                />
                <Release
                    version="0.2.4"
                    date="2024-05-24"
                    new={[
                        {
                            title: 'Improve chatbot bubbles',
                            description: 'Improve design of chatbot bubbles on user\'s reply.',
                            image: new URL(
                                '/public/new_bubbles.png',
                                import.meta.url,
                            ).toString()
                        }
                    ]}
                    improvements={[
                        {
                            title: 'Improve UX for chatbot',
                            description: 'Remove auto focus on input after message.',
                        },
                    ]}

                />
                <Release
                    version="0.2.3"
                    date="2024-05-17"
                    new={[
                        {
                            title: 'New Client Side Prompt in Chatbox IFrame',
                            description:
                                "It is now possible to use client side prompt on your chatbot for more personalization depending on the context. Heres's how you can use it '&clientSidePrompt=You are currently talking to {User X} help him to understand the book {Book Name X}.' You can find more information in our documentation.",
                        },
                    ]}
                />
                <Release
                    version="0.2.2"
                    date="2024-05-10"
                    new={[
                        {
                            title: 'New Chatbox UI in IFrame',
                            description:
                                "You can now embed the chatbox in your website using an IFrame. This will prevent CSS conflicts and provide a smoother user experience.",
                            image: new URL(
                                '/public/chatbox-iframe.png',
                                import.meta.url,
                            ).toString(),
                        },
                    ]}
                />
                <Release
                    version="0.2.1"
                    date="2024-05-10"
                    new={[
                        {
                            title: 'Display LaTex Math function in the chat',
                            description:
                                "When you ask your chatbot to output math function and starting them with $$ it will display math function in LaTex style. Here's what your prompt should look like to display LaTex: 'Display a math function in latex and the function text must always start with $$'",
                            image: new URL(
                                '/public/chatmessage-latex.png',
                                import.meta.url,
                            ).toString(),
                        },
                    ]}
                />
                <Release
                    version="0.2.0"
                    date="2024-05-10"
                    new={[
                        {
                            title: 'New Chatbot Window UI',
                            description:
                                "We improved UI to make it look better. We also now have an integration via IFrame which means no more CSS conflicts and a smoother user experience.",
                            image: new URL(
                                '/public/new_chatbot_ui.jpg',
                                import.meta.url,
                            ).toString(),
                        },
                    ]}
                />
                <Release
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
