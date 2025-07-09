import ConverHeader from "../conversation/ConverHeader";
import ConverInbox from "../conversation/ConverInbox";

function ChatBox() {
  return (
    <div className="w-full min-h-screen max-h-screen">
      <ConverHeader />
      <ConverInbox />
    </div>
  );
}

export default ChatBox;
