
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'buyer' | 'seller';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ChatProps {
  productId?: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  onClose: () => void;
}

export default function BuyerSellerChat({
  productId,
  sellerId,
  sellerName,
  buyerId,
  buyerName,
  onClose
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = buyerId; // In real app, get from auth context

  useEffect(() => {
    // Load existing messages
    const savedMessages = localStorage.getItem(`chat_${sellerId}_${buyerId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, [sellerId, buyerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: buyerName,
      senderType: 'buyer',
      message: newMessage,
      timestamp: new Date(),
      read: false
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${sellerId}_${buyerId}`, JSON.stringify(updatedMessages));
    setNewMessage('');

    // Simulate seller typing response
    setIsTyping(true);
    setTimeout(() => {
      const sellerResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: sellerId,
        senderName: sellerName,
        senderType: 'seller',
        message: 'Thank you for your message! I\'ll get back to you shortly.',
        timestamp: new Date(),
        read: false
      };
      const withResponse = [...updatedMessages, sellerResponse];
      setMessages(withResponse);
      localStorage.setItem(`chat_${sellerId}_${buyerId}`, JSON.stringify(withResponse));
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
              {sellerName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{sellerName}</h3>
              <p className="text-sm text-gray-500">Seller</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors whitespace-nowrap"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-message-3-line text-3xl text-gray-400"></i>
              </div>
              <p className="text-gray-500">Start a conversation with {sellerName}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.senderId === currentUserId ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      msg.senderId === currentUserId
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${msg.senderId === currentUserId ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
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

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
