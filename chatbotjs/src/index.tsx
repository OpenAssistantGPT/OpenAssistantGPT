import React from 'react';
import ChatBox from './Chat'; // Import your main component
import { createRoot } from 'react-dom/client'; // Import createRoot
import ShadowRootComponent from './ShadowRoot';


// Create a new div element
const rootDiv = document.createElement('div');
rootDiv.id = 'chatbot-root'; // Give it an ID for easy reference

// Append the new div to body
document.body.appendChild(rootDiv);

// Create a React root and render your component
const root = createRoot(document.getElementById('chatbot-root'));

root.render(
    <ShadowRootComponent styleUrl="https://dev-openassistantgpt.vercel.app/chatbot.css">
        <ChatBox />
    </ShadowRootComponent>
);