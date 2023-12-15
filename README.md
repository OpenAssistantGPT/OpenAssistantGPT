# Welcome to OpenAssistantGPT

OpenAssistantGPT is an open source platform for building chatbot assistants using OpenAI's CustomGPTs. It offers features like easy website integration, low cost, and an open source codebase available on GitHub. 

Users can build their chatbot with minimal coding required, and OpenAssistantGPT supports direct billing through OpenAI without extra charges. The platform is particularly user-friendly and cost-effective, appealing to those seeking to integrate AI chatbot functionalities into their websites.

For more detailed information and implementation guidelines, you can visit our [website](https://openassistantgpt.io/).


## How to create my Chatbot

1. Open [OpenAI](https://openai.com/) and create an account.
2. Open [OpenAssistantGPT](https://openassistantgpt.io/) and create an account.
3. Set your OpenAI API key in your [OpenAssistantGPT dashboard](https://openassistantgpt.io/dashboard).
4. Create a crawler or upload your own file.
5. Create your chatbot with the file you uploaded.
6. Test your chatbot!

## How to implement chatbot on your website:
HTML 
```html
<!doctype html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<script>
  window.chatbotConfig = {
    chatbotId: 'clpl60296000qhoqiqwkmn0y5',
  }
</script>

<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  <script src="http://localhost:3000/chatbot.js"></script>
  <!-- ... other body elements ... -->
</body>

</html>
```

Nextjs
```js
"use client"

import Script from 'next/script'
import React, { useEffect } from 'react';


export default function Home() {
  useEffect(() => {
    // Set your global variable here
    window.chatbotConfig = {
      chatbotId: "clpl60296000qhoqiqwkmn0y5"
    };

  }, []);

  return (
    <main className="">
      <Script src="https://chatbot-5a94.vercel.app/chatbot.js" strategy="afterInteractive" />

    </main>
  )
}
```

## Documentation
For full documentation, visit [docs.openassistantgpt.io](https://docs.openassistantgpt.io/)