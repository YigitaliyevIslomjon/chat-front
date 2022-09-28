import ReceivedMessage from "../../components/Chat/ReceivedMessage";
import { io } from "socket.io-client";

import { useEffect, useMemo } from "react";

function Chat() {
  const socket = useMemo(() => io("https://app-like-gmail.herokuapp.com"), []);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    socket.emit("send-message", {
      user_id: user._id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col gap-y-2">
      <ReceivedMessage socket={socket} />
    </div>
  );
}

export default Chat;
