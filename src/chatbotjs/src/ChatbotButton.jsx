import React, { useEffect } from 'react';

import { Button } from '../../../app/components/ui/Button';

const ChatbotButton = () => {
    useEffect(() => {
        // This code runs after the component mounts
        const chatbotButton = document.createElement(<Button />);
        chatbotButton.innerHTML = 'Chat with us!';
        // Add your styling here or use a separate CSS file
        chatbotButton.style.position = 'fixed';
        // ... other styles

        chatbotButton.addEventListener('click', () => {
            // Implement your chatbot opening logic here
            console.log('Chatbot clicked');
        });

        document.body.appendChild(chatbotButton);

        // Cleanup function
        return () => {
            document.body.removeChild(chatbotButton);
        };
    }, []);

    return null; // This component does not render anything itself
};

export default ChatbotButton;
