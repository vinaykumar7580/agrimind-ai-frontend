import Sidebar from "@/components/sidebar/Sidebar";
import ChatBox from "@/components/chat/ChatBox";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <ChatBox />
      </div>
    </div>
  );
}