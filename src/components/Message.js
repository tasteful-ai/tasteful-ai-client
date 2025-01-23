import Markdown from "react-markdown";

export default function Message({message}) {
  return (
    <div className="mb-l">
      <div className="font-bold">{message.role === 'user' ? '🧑‍💻 You' : '🤖 Assistant'}</div>
      <div>
        <Markdown>
          {message.content}
        </Markdown>
      </div>
    </div>
  )
};