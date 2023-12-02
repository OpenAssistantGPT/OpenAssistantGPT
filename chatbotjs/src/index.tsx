import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import ChatBox from './Chat'; // Import your main component

document.addEventListener('DOMContentLoaded', (event) => {
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <ChatBox />
        </React.StrictMode>
    );
});
