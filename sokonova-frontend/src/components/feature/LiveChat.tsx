import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface LiveChatProps {
  supportHours?: string;
  responseTime?: string;
}

export default function LiveChat({ 
  supportHours = '24/7', 
  responseTime = 'Usually replies in minutes' 
}: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to SOKONOVA Support. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    'Track my order',
    'Return policy',
    'Payment issues',
    'Shipping info'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleSendMessage = (text: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate agent response based on message content
    setTimeout(() => {
      let responseText = 'Thank you for your message. An agent will respond shortly.';
      
      if (messageText.toLowerCase().includes('order') || messageText.toLowerCase().includes('track')) {
        responseText = 'To track your order, please provide your order number (e.g., ORD-2024-001) and I\'ll look it up for you.';
      } else if (messageText.toLowerCase().includes('return')) {
        responseText = 'Our return policy allows returns within 30 days of delivery. Would you like me to help you start a return?';
      } else if (messageText.toLowerCase().includes('payment')) {
        responseText = 'I can help with payment issues. What specific problem are you experiencing?';
      } else if (messageText.toLowerCase().includes('shipping')) {
        responseText = 'We offer standard (5-7 days), express (2-3 days), and overnight shipping. Which would you like to know more about?';
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    handleSendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-[9999] whitespace-nowrap cursor-pointer hover:scale-110"
        aria-label="Open chat"
        style={{ boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)' }}
      >
        {isOpen ? (
          <i className="ri-close-line text-2xl"></i>
        ) : (
          <i className="ri-message-3-line text-2xl"></i>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-[9999] border border-gray-200 animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="ri-customer-service-2-line text-xl"></i>
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">SOKONOVA Support</h3>
                  <p className="text-xs text-emerald-100">{isOnline ? 'Online now' : 'Offline'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-subtract-line"></i>
              </button>
            </div>
            <div className="text-xs text-emerald-100">
              <div className="flex items-center gap-2">
                <i className="ri-time-line"></i>
                <span>{supportHours}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <i className="ri-flashlight-line"></i>
                <span>{responseTime}</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              We typically reply within a few minutes
            </p>
          </div>
        </div>
      )}
    </>
  );
}
