import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { BiSend } from "react-icons/bi";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputText, setInputText] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setGeminiResponse(null);
    setError(null);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCwnYjl6VS-R0l2ijmWgp3YNTPuyZ15lAQ",
        {
          contents: [{ parts: [{ text: inputText }] }],
        }
      );

      const botResponse = response.data.candidates[0].content.parts[0].text;
      const newMessages = [
        ...messages,
        { text: inputText, sender: "user" },
        { text: botResponse, sender: "bot" },
      ];
      setMessages(newMessages);
      setInputText("");

      // Speak the bot's response
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate response. Please try again.");
    }

    setGeneratingAnswer(false);
  }

  // Function to speak text using Speech Synthesis API


  return (
    <div className="app">
      <header className="header bg-blue-500 text-white text-center py-4">
        College Inquiry ChatBot
      </header>

      <div className="container">
        <div className="chat-area">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mt-3 ${
                message.sender === "user" ? "flex justify-end" : "flex justify-start"
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg shadow-md ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {message.sender === "bot" ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  message.text
                )}
              </div>
            </div>
          ))}
          {generatingAnswer && (
            <div className="mt-3 flex justify-end">
              <div className="inline-block px-4 py-2 rounded-lg shadow-md bg-gray-200 animate-pulse">
                Loading...
              </div>
            </div>
          )}
          {error && (
            <div className="mt-3 flex justify-center text-red-500">
              {error}
            </div>
          )}
        </div>
        <form onSubmit={generateAnswer} className="form-container">
          <input
            type="text"
            className="input-box"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={generatingAnswer}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
            disabled={!inputText || generatingAnswer}
          >
            <BiSend className="mr-2" />
            {generatingAnswer ? "Generating..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
