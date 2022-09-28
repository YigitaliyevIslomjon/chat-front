import ReceivedMessage from "../../components/Chat/ReceivedMessage";
import { io } from "socket.io-client";

import { useEffect, useMemo } from "react";

function Chat() {
  const socket = useMemo(() => io("http://localhost:4000"), []);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    socket.emit("send-message", {
      user_id: user._id,
    });
  }, []);
  return (
    <div className="flex flex-col gap-y-2">
      <ReceivedMessage socket={socket} />
    </div>
  );
}

export default Chat;
