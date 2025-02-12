import React, { useState, useEffect } from "react";
import { BsChatDots } from "react-icons/bs";
import { AiOutlineClose} from "react-icons/ai";
import axios from "axios";
import { apiUrl } from "../actions/apiUrl";
import toast from "react-hot-toast";


const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // Send a message to the backend

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/api/products/sendmessage`,
          { message: "Hello" }
        );
        const botReply = response.data.reply;
        console.log("Bot Reply:", botReply); // Check if it's the correct response

        // Update state with the bot's response
        setMessages([{ text: botReply, sender: "bot" }]);
      } catch (error) {
        console.error("Error fetching welcome message:", error);
      }
    };

    fetchWelcomeMessage();
  }, []); // Empty array ensures it runs once when the component mounts

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setMessages([...messages, { text: userMessage, sender: "user" }]);
    setLoading(true);

    try {
      
      const response = await axios.post(`${apiUrl}/webhook`, {
        queryResult: {
          queryText: userMessage, // Send queryText only
          parameters: {}, // No need to send parameters explicitly
          languageCode: "en",
        },
      });
      console.log(response)

      const botReply = response.data.reply;
      const products = Array.isArray(response.data.products) ? response.data.products : [];

      setMessages([
        ...messages,
        { text: userMessage, sender: "user" },
        { text: botReply, sender: "bot" },
        ...products.map((product, index) => ({
          text: `${product.name} - $${product.price}`,
          sender: "bot",
        })),
        ...(response.data.shipping
          ? [{ text: response.data.shipping, sender: "bot" }]
          : []),
        ...(response.data.payment
          ? [{ text: response.data.payment, sender: "bot" }]
          : []),
        ...response.data.products?.map((product, index) => ({
          text: `Product ID: ${product.product}, Count: ${product.count}, Size: ${product.size}, Color: ${product.color}`,
          sender: "bot",
        })),
      ]);
    } catch (error) {
      console.error("Error sending message to backend:", error);
      toast.error(error.response.data.fullfillmentText)
    }

    setUserMessage("");
    setLoading(false);
  };

  return (
    <div className="chatbtn-container">
      <button
        onClick={() => setIsChatOpen((prev) => !prev)}
        className="chatbtn"
      >
        <BsChatDots />
      </button>

      {isChatOpen && (
        <div className="chat-box open">
          <div className="chat-box-header">
            <button onClick={() => setIsChatOpen(false)} className="close-btn">
              <AiOutlineClose />
            </button>
          </div>

          <div className="chat-box-content">
            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.sender === "user" ? "user-message" : "bot-message"
                  }
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask me about products or order status..."
              />
              <button onClick={sendMessage} disabled={loading}>
                {" "}
                {loading ? "Loading..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
