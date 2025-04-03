import { query, queryOne } from "@/lib/db"

export interface Conversation {
  id: string
  title: string
  created_at: Date
  updated_at: Date
  participants?: ConversationParticipant[]
  last_message?: DirectMessage
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  user_id: string
  joined_at: Date
  last_read_at: Date
  user?: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

export interface DirectMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  sent_at: Date
  is_read: boolean
  sender?: {
    id: string
    name: string | null
    email: string
  }
}

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const conversations = await query<Conversation>(
    `
    SELECT c.* 
    FROM "Conversation" c
    JOIN "ConversationParticipant" cp ON c.id = cp.conversation_id
    WHERE cp.user_id = $1
    ORDER BY c.updated_at DESC
  `,
    [userId],
  )

  // Get the last message for each conversation
  for (const conversation of conversations) {
    const lastMessage = await queryOne<DirectMessage>(
      `
      SELECT dm.* 
      FROM "DirectMessage" dm
      WHERE dm.conversation_id = $1
      ORDER BY dm.sent_at DESC
      LIMIT 1
    `,
      [conversation.id],
    )

    conversation.last_message = lastMessage || undefined

    // Get participants
    const participants = await query<ConversationParticipant & { name: string | null; email: string; role: string }>(
      `
      SELECT cp.*, u.name, u.email, u.role
      FROM "ConversationParticipant" cp
      JOIN "User" u ON cp.user_id = u.id
      WHERE cp.conversation_id = $1
    `,
      [conversation.id],
    )

    conversation.participants = participants.map((p) => ({
      ...p,
      user: {
        id: p.user_id,
        name: p.name,
        email: p.email,
        role: p.role,
      },
    }))
  }

  return conversations
}

export async function getConversation(conversationId: string, userId: string): Promise<Conversation | null> {
  // Check if user is a participant
  const isParticipant = await queryOne<{ exists: boolean }>(
    `
    SELECT EXISTS(
      SELECT 1 FROM "ConversationParticipant"
      WHERE conversation_id = $1 AND user_id = $2
    ) as exists
  `,
    [conversationId, userId],
  )

  if (!isParticipant?.exists) {
    return null
  }

  const conversation = await queryOne<Conversation>(
    `
    SELECT * FROM "Conversation"
    WHERE id = $1
  `,
    [conversationId],
  )

  if (!conversation) {
    return null
  }

  // Get participants
  const participants = await query<ConversationParticipant & { name: string | null; email: string; role: string }>(
    `
    SELECT cp.*, u.name, u.email, u.role
    FROM "ConversationParticipant" cp
    JOIN "User" u ON cp.user_id = u.id
    WHERE cp.conversation_id = $1
  `,
    [conversationId],
  )

  conversation.participants = participants.map((p) => ({
    ...p,
    user: {
      id: p.user_id,
      name: p.name,
      email: p.email,
      role: p.role,
    },
  }))

  return conversation
}

export async function getConversationMessages(
  conversationId: string,
  userId: string,
  limit = 50,
  offset = 0,
): Promise<DirectMessage[]> {
  // Check if user is a participant
  const isParticipant = await queryOne<{ exists: boolean }>(
    `
    SELECT EXISTS(
      SELECT 1 FROM "ConversationParticipant"
      WHERE conversation_id = $1 AND user_id = $2
    ) as exists
  `,
    [conversationId, userId],
  )

  if (!isParticipant?.exists) {
    return []
  }

  const messages = await query<DirectMessage & { sender_name: string | null; sender_email: string }>(
    `
    SELECT dm.*, u.name as sender_name, u.email as sender_email
    FROM "DirectMessage" dm
    JOIN "User" u ON dm.sender_id = u.id
    WHERE dm.conversation_id = $1
    ORDER BY dm.sent_at DESC
    LIMIT $2 OFFSET $3
  `,
    [conversationId, limit, offset],
  )

  // Update last read timestamp
  await query(
    `
    UPDATE "ConversationParticipant"
    SET last_read_at = CURRENT_TIMESTAMP
    WHERE conversation_id = $1 AND user_id = $2
  `,
    [conversationId, userId],
  )

  // Mark messages as read
  await query(
    `
    UPDATE "DirectMessage"
    SET is_read = TRUE
    WHERE conversation_id = $1 AND sender_id != $2 AND is_read = FALSE
  `,
    [conversationId, userId],
  )

  return messages.map((message) => ({
    ...message,
    sender: {
      id: message.sender_id,
      name: message.sender_name,
      email: message.sender_email,
    },
  }))
}

export async function createConversation(title: string, participantIds: string[]): Promise<Conversation | null> {
  // Create conversation
  const conversation = await queryOne<Conversation>(
    `
    INSERT INTO "Conversation" (title)
    VALUES ($1)
    RETURNING *
  `,
    [title],
  )

  if (!conversation) {
    return null
  }

  // Add participants
  for (const userId of participantIds) {
    await query(
      `
      INSERT INTO "ConversationParticipant" (conversation_id, user_id)
      VALUES ($1, $2)
    `,
      [conversation.id, userId],
    )
  }

  return getConversation(conversation.id, participantIds[0])
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
): Promise<DirectMessage | null> {
  // Check if user is a participant
  const isParticipant = await queryOne<{ exists: boolean }>(
    `
    SELECT EXISTS(
      SELECT 1 FROM "ConversationParticipant"
      WHERE conversation_id = $1 AND user_id = $2
    ) as exists
  `,
    [conversationId, senderId],
  )

  if (!isParticipant?.exists) {
    return null
  }

  // Send message
  const message = await queryOne<DirectMessage>(
    `
    INSERT INTO "DirectMessage" (conversation_id, sender_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
    [conversationId, senderId, content],
  )

  // Update conversation timestamp
  await query(
    `
    UPDATE "Conversation"
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
  `,
    [conversationId],
  )

  return message
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  const result = await queryOne<{ count: string }>(
    `
    SELECT COUNT(*) as count
    FROM "DirectMessage" dm
    JOIN "ConversationParticipant" cp ON dm.conversation_id = cp.conversation_id
    WHERE cp.user_id = $1 AND dm.sender_id != $1 AND dm.is_read = FALSE
  `,
    [userId],
  )

  return result ? Number.parseInt(result.count) : 0
}

export async function startConversationWithUser(
  currentUserId: string,
  otherUserId: string,
  initialMessage?: string,
): Promise<Conversation | null> {
  // Check if conversation already exists between these users
  const existingConversation = await queryOne<{ conversation_id: string }>(
    `
    SELECT cp1.conversation_id
    FROM "ConversationParticipant" cp1
    JOIN "ConversationParticipant" cp2 ON cp1.conversation_id = cp2.conversation_id
    JOIN "Conversation" c ON c.id = cp1.conversation_id
    WHERE cp1.user_id = $1 AND cp2.user_id = $2
    AND (
      SELECT COUNT(*) FROM "ConversationParticipant" 
      WHERE conversation_id = cp1.conversation_id
    ) = 2
    ORDER BY c.updated_at DESC
    LIMIT 1
  `,
    [currentUserId, otherUserId],
  )

  if (existingConversation) {
    const conversation = await getConversation(existingConversation.conversation_id, currentUserId)

    // If there's an initial message, send it
    if (initialMessage && conversation) {
      await sendMessage(conversation.id, currentUserId, initialMessage)
      return getConversation(conversation.id, currentUserId)
    }

    return conversation
  }

  // Get user info for conversation title
  const currentUser = await queryOne<{ name: string | null }>(
    `
    SELECT name FROM "User" WHERE id = $1
  `,
    [currentUserId],
  )

  const otherUser = await queryOne<{ name: string | null }>(
    `
    SELECT name FROM "User" WHERE id = $1
  `,
    [otherUserId],
  )

  const title = `${currentUser?.name || "User"} and ${otherUser?.name || "User"}`

  // Create new conversation
  const conversation = await createConversation(title, [currentUserId, otherUserId])

  // If there's an initial message, send it
  if (initialMessage && conversation) {
    await sendMessage(conversation.id, currentUserId, initialMessage)
    return getConversation(conversation.id, currentUserId)
  }

  return conversation
}

