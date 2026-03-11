import { Header } from "@/components/layout/Header";
import { ChatContainer } from "@/components/chat/ChatContainer";

export default function ChatPage() {
  return (
    <main className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(135deg, #060612 0%, #0d0b2e 50%, #1a0533 100%)" }}>
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-8">
        <div className="w-full max-w-2xl h-[80vh]">
          <ChatContainer />
        </div>
      </div>
    </main>
  );
}
