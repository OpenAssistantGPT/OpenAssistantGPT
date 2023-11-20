
async function verifyCurrentUserHasAccessToChatbot(chatbotId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.chatbot.count({
    where: {
      id: chatbotId,
      userId: session?.user.id,
    },
  })

  return count > 0
}