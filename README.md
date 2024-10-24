# Welcome to OpenAssistantGPT

<p>
<img alt="Vercel Build Status" src="https://vercelbadge.vercel.app/api/marcolivierbouch/OpenAssistantGPT" />
<img alt="GitHub Last Commit" src="https://img.shields.io/github/last-commit/marcolivierbouch/OpenAssistantGPT" />
<img alt="" src="https://img.shields.io/github/repo-size/marcolivierbouch/OpenAssistantGPT" />
<img alt="GitHub Issues" src="https://img.shields.io/github/issues/marcolivierbouch/OpenAssistantGPT" />
<img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/marcolivierbouch/OpenAssistantGPT" />
</p>

OpenAssistantGPT is an open source platform for building chatbot assistants using OpenAI's Assistant. It offers features like easy website integration, low cost, and an open source codebase available on GitHub. 

Users can build their chatbot with minimal coding required, and OpenAssistantGPT supports direct billing through OpenAI without extra charges. The platform is particularly user-friendly and cost-effective, appealing to those seeking to integrate AI chatbot functionalities into their websites.

For more detailed information and implementation guidelines, you can visit our [website](https://openassistantgpt.io/).

![image](https://github.com/marcolivierbouch/OpenAssistantGPT/assets/29548847/2c7d0684-0edf-4e9e-bd60-271efb8f8d22)


## How to create my Chatbot

1. Open [OpenAI](https://openai.com/) and create an account.
2. Open [OpenAssistantGPT](https://openassistantgpt.io/) and create an account.
3. Set your OpenAI API key in your [OpenAssistantGPT dashboard](https://openassistantgpt.io/dashboard).
4. Create a crawler or upload your own file.
5. Create your chatbot with the file you uploaded.
6. Test your chatbot!

## Technical Features
## Crawlers
  - Crawlers exist within the assistant in order to crawl through websites and extract certain information. Criteria such as strings or sections can be specified in order to allow the crawler to collect data.
  - The data collected is stored in files
  - The files can be used to help train your chatbot to become more intelligent 
## Files
  - Files can be used to train your chatbot
  - File uploads allow the user to upload a table of questions and answers to provide the chatbot with more knowledge
  - File uploads enhance chatbot performance
  - File types are currently limited. Refer to https://www.openassistantgpt.io/docs/documentation/files to see which file types can be uploaded.
## Chatbots
  - Users can create or import chatbots
  - Created chatbots can be configured with a display name, welcome message, default prompt, and OpenAI Model
  - Users must enter an OpenAI API key when creating a chatbot
  - Files can be uploaded when the chatbot is created in order for the AI to be able to search for content when a query is made
## Web Search
  - If the chatbot cannot generate an answer, the web search feature will be used
  - The web search feature is sometimes also used in coordination with the chatbot's knowledge in order to generate more accurate responses
  - Users can influence the use of the web search feature based on context of their questions, asking follow up questions, and by explicitly prompting the chatbot to do a web search
    ## Benefits:
    - Improves accuracy
    - Better experience for the users
    - More knowledge to pull from 

## Tips 
  - In order for the chatbot to perform as expected, users should create clearly state their objectives to the chatbot
  - The chatbot can be configured to respond with certain message lengths, as well as with a positive tone
  - The chatbot can be configured to inform users that their question is out of scope if the question asked is off topic

## Use Cases
  - Building a smart chatbot for your website
  - Building a smart chatbot to assist with classwork
  - Building a smart chatbot to respond to emails
  - And much more depending on user needs!

## Integrating the smart chatbot to your website
Integrating your smart chatbot with your website is quite simple. You will need the following two accounts before beginning:
  - Google or Github account
  - OpenAI account

1. Create a new secret key on https://platform.openai.com/api-keys, and set this new secret key in your OpenAssistantGPT settings
2. Upload any files with the content you desire to train the chatbot
3. Create your new chatbot
4. Embed the chatbot in your website 
  

## Documentation
For full documentation, visit our [documentation](https://openassistantgpt.io/docs)

## Contributing

We love our contributors! Here's the list of who contributed:

<a href="https://github.com/marcolivierbouch/OpenAssistantGPT/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=marcolivierbouch/OpenAssistantGPT" />
</a>

## Tech Stack

Next.js – framework

TypeScript – language

Tailwind – CSS

Supabase – database

NextAuth.js – auth

Stripe – payments

Resend – emails

Vercel – deployments

## Repo Activity

![OpenAssistantGPT repo activity](https://repobeats.axiom.co/api/embed/d376259a3651f5bcb458c4f00efb9012cb400813.svg "Repobeats analytics image")
