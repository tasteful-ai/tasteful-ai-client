import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(`http://localhost:8080/api/users/aiChats`, {
        message: input
      }, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VydGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzM3NjEyMDUwLCJleHAiOjE3Mzc2MTU2NTB9.8Eor8RB02mE9QxZFXWQwuMl1TNXbu9SOFCd_BMhiMA4`
        }
      });

      // 기존 AI 호출 시에 응답 받아오는 로직
      // const botMessage = { sender: 'bot', text: response.data.completion };

      // 서버의 recommendation 필드 사용하여 메시지 설정
      const botMessage = { sender: 'bot', text: response.data.data.recommendation };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: '오류가 발생했습니다.' }]);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      </div>
    </div>
  );
}

export default App;
