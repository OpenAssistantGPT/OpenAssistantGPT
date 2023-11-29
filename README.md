Create only one Files schema

id
name
userId
openAIId  @unique
bloblUrl
crawlerId?

When crawling publish automaticly to openai and when uploading also publish
Remove the two other schemas + openAI files


Chatbot schema:

id
name
userId         String
createdAt      DateTime @default(now()) @map(name: "created_at")
openaiKey      String
modelId        String
prompt         String
welcomeMessage String
FilesIds[]

When we create a Chatbot we automaticly publish

1. Flow when we don't have ur API key put a big popup at the start!
2. Upload a file
3. Create chatbot


TODO:
- Do DB update
- update crawlers
- -------------------
- Make sure that people import a file before create a chatbot
- Create include js to implement in website
- Finish the Update chatbot form
- Delete specific uploaded file
- Add maximum file size while uploading and crawling
- Add a "how to" on the dashboard when there is nothing 


Landing page:

- Open source alternative to all chatbots
- Bring your own api, don't get charged more than what open AI do
- Low code required
- Powered by custom gpts
- Unlimited message
- Implement on unlimited websites

