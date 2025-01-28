import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  fetchRoomMessages,
} from "../store/slices/chattingSlice";
import ChattingMessageList from "../components/ChattingMessageList";
import ChattingMessageInput from "../components/ChattingMessageInput";

const ChattingRoom = () => {
  const { roomId } = useParams(); // URL 파라미터에서 채팅방 ID 가져오기
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chatting);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 채팅방 메시지 불러오기
    dispatch(fetchRoomMessages(roomId));

    // WebSocket 연결
    dispatch(connectWebSocket(roomId));

    return () => {
      // WebSocket 연결 해제
      dispatch(disconnectWebSocket());
    };
  }, [dispatch, roomId]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      dispatch(sendMessage({ roomId, message }));
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>채팅방</h1>
      <ChattingMessageList messages={messages} />
      <ChattingMessageInput
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChattingRoom;
