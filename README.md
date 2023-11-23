TODO:

- Add db row about is model draft or not (Not in draft mode mean it is created in openAI)
- Remove crawling related stuff from chatbot tab
- Create a tab for your crawlers and crawling configs
- For each crawler create a tabs for your crawled files files
- Upload files to vercel blob storage then when you deploy chatbot to openAI use thoses files
- Create table for files with storage url linked with owner id and link them to a bot
- When bot is deployed store all openai bot info in other table (model id)


Pricing:
- Bring you openAI key, Always infinite messages
- x/$ per month for each bot (Free 1 free bot for 3 days max of 15 messages, Basic 3 bot max for 9$/month, Pro up to 10 bots for 30$/month)
- max number of files that can be imported (Free import 1 file, Basic 3 import files, Pro 10 files)



model Chatbot {
  id          String        @id @default(cuid())
  name        String
  userId      String
  createdAt   DateTime      @default(now()) @map(name: "created_at")
  openaiKey   String
  draft       Boolean
  fromDomain  String
  prompt      String
  crawlerFile CrawlerFile[]

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map(name: "chatbots")
}

model Crawler {
  id              String   @id @default(cuid())
  name            String
  createdAt       DateTime @default(now()) @map(name: "created_at")
  userId          String
  crawlUrl        String
  urlMatch        String
  selector        String
  maxPagesToCrawl Int

  crawlerFile CrawlerFile[]

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map(name: "crawlers")
}

model CrawlerFile {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now()) @map(name: "created_at")
  blobUrl   String
  crawlerId String

  crawler   Crawler  @relation(fields: [crawlerId], references: [id], onDelete: Cascade)
  Chatbot   Chatbot? @relation(fields: [chatbotId], references: [id])
  chatbotId String?
}
