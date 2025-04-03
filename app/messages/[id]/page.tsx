import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import MessageThread from "@/components/messaging/message-thread"

interface MessagePageProps {
  params: {
    id: string
  }
}

export default async function MessagePage({ params }: MessagePageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-3xl mx-auto border rounded-lg h-[calc(100vh-200px)]">
      <MessageThread conversationId={params.id} currentUserId={user.id} />
    </div>
  )
}

