"use client";

import { useEffect, useState } from "react";
import query from "@/libs/llama";

export default function Chat() {
  const [messages, setMessages] = useState<
    { sender: string; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [waitingForUser, setWaitingForUser] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "User", content: input },
      ]);
      setInput("");
      setWaitingForUser(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      if (!waitingForUser) {
          const instruction = messages
            .filter((message) => message.sender === "User")
            .map((message) => message.content)
            .join(" ");

        query({
          instruction,
          input,
        }).then((response) => {
          const reply = response.response.replace("[!] Response: ", "");
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "AI", content: reply },
          ]);
          setWaitingForUser(true);
        });

        // const lastUserMessages = messages
        //   .filter((message) => message.sender === "User")
        //   .slice(-3);

        // const instruction = lastUserMessages
        //   .map((message) => message.content)
        //   .join(" ");

        // query({
        //   instruction: instruction,
        // }).then((response) => {
        //   const reply = response.response.replace("[!] Response: ", "");
        //   setMessages((prevMessages) => [
        //     ...prevMessages,
        //     { sender: "AI", content: reply },
        //   ]);
        //   setWaitingForUser(true);
        // });
      }
    }
  }, [messages, waitingForUser]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-6">
      <div className="flex-grow border border-gray-700 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.sender === "User" ? "justify-end" : "justify-start"
            } flex`}
          >
            <div
              className={`p-2 rounded-lg ${
                message.sender === "User" ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={handleInput}
          className="flex-grow border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-100 bg-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg focus:outline-none hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
