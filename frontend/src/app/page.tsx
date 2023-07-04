"use client";
import { useEffect, useState } from "react";

import query from "@/libs/llama"

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prevMessages) => [...prevMessages, input]);
    setInput("");
  };

  useEffect(() => {
    query({
      inputs: messages,
    }).then((response) => {
      console.log(JSON.stringify(response));
    });
  },[messages] );

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col p-6">
        <div className="flex-grow border border-gray-700 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              {message}
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
    </>
  );
}
