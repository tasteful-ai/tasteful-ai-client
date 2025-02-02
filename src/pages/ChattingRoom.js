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
import "../styles/Chatting.css";

const ChattingRoom = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const { messages, rooms } = useSelector((state) => state.chatting);
  const [message, setMessage] = useState("");

  const currentRoom = rooms.find((room) => room.id === Number(roomId));

  useEffect(() => {
    console.log("📢 ChattingRoom 마운트됨!");
    dispatch(fetchRoomMessages(roomId));
    dispatch(connectWebSocket(roomId));

    return () => {
      console.log("❌ ChattingRoom 언마운트됨!");
      dispatch(disconnectWebSocket());
    };
  }, [dispatch, roomId]);

    const handleSendMessage = () => {
      if (message.trim()) {
        dispatch(sendMessage(roomId, message));
        setMessage("");
      }
    };

  return (
    <div className="chatting-room">
      <h1>{currentRoom?.roomName || "채팅방"}</h1>
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
