import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon, XIcon, PaperAirplaneIcon, BellIcon, VolumeUpIcon, VolumeOffIcon } from '@heroicons/react/outline';
import chatService from '../../services/chatService';
import { MAX_CHAT_HISTORY } from '../../config';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  const messageAudioRef = useRef(null);
  
  // Tạo audio element cho âm thanh thông báo
  useEffect(() => {
    messageAudioRef.current = new Audio('https://assets.mixkit.co/sfx/download/mixkit-software-interface-start-2574.wav');
    messageAudioRef.current.volume = 0.5;
    
    return () => {
      if (messageAudioRef.current) {
        messageAudioRef.current.pause();
        messageAudioRef.current = null;
      }
    };
  }, []);
  
  // Tự động cuộn xuống dưới khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Lấy lịch sử chat khi component được mount
  useEffect(() => {
    const savedHistory = chatService.getChatHistory();
    if (savedHistory.length > 0) {
      setChatHistory(savedHistory);
    }
  }, []);
  
  // Cập nhật lịch sử chat và cuộn xuống dưới khi có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
    
    // Lưu lịch sử chat vào localStorage
    if (chatHistory.length > 0) {
      chatService.saveChatHistory(chatHistory);
    }
  }, [chatHistory, isOpen]);
  
  // Cập nhật số tin nhắn chưa đọc khi có tin nhắn mới từ bot
  useEffect(() => {
    if (!isOpen && chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.sender === 'bot') {
        setUnreadCount((prev) => prev + 1);
        
        // Phát âm thanh nếu được bật
        if (soundEnabled && messageAudioRef.current) {
          messageAudioRef.current.play().catch(err => console.log('Không thể phát âm thanh', err));
        }
      }
    }
  }, [chatHistory, isOpen, soundEnabled]);

  // Xử lý khi người dùng gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Thêm tin nhắn của người dùng vào lịch sử chat
    const userMessage = { sender: 'user', text: message, timestamp: new Date().toISOString() };
    setChatHistory([...chatHistory, userMessage]);
    setIsLoading(true);
    setMessage('');
    
    try {
      // Gọi API chatbot qua service
      const response = await chatService.sendMessage(message);
      
      // Thêm tin nhắn phản hồi từ bot vào lịch sử chat
      const botMessage = { 
        sender: 'bot', 
        text: response.response, 
        timestamp: new Date().toISOString() 
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Lỗi khi gọi chatbot:', error);
      const errorMessage = { 
        sender: 'bot', 
        text: 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa lịch sử chat
  const handleClearChat = () => {
    setChatHistory([]);
    chatService.clearChatHistory();
  };
  
  // Bật/tắt âm thanh
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Xử lý tin nhắn có chứa link sản phẩm
  const formatMessageWithLinks = (text) => {
    // Tìm URL dạng localhost:3000/products/{id}
    const regex = /(localhost:3000\/products\/\d+)/g;
    
    if (!regex.test(text)) {
      return <span>{text}</span>;
    }
    
    const parts = text.split(regex);
    const matches = text.match(regex) || [];
    
    return (
      <>
        {parts.map((part, i) => {
          // Nếu phần này là một URL
          if (matches.includes(part)) {
            const href = `http://${part}`;
            return (
              <a 
                key={i}
                href={href}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {part}
              </a>
            );
          }
          // Nếu không phải URL
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };
  
  // Format thời gian tin nhắn
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Nút mở/đóng chat box */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all relative`}
        aria-label="Mở chat box"
      >
        <ChatIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat box container */}
      <div
        className={`${
          isOpen ? 'flex' : 'hidden'
        } flex-col w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl overflow-hidden transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-500 text-white">
          <h3 className="font-medium">Chat với chúng tôi</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSound}
              className="focus:outline-none"
              aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {soundEnabled ? (
                <VolumeUpIcon className="h-5 w-5" />
              ) : (
                <VolumeOffIcon className="h-5 w-5" />
              )}
            </button>
            {chatHistory.length > 0 && (
              <button 
                onClick={handleClearChat} 
                className="text-xs text-white hover:underline focus:outline-none"
                aria-label="Xóa lịch sử chat"
              >
                Xóa lịch sử
              </button>
            )}
            <button 
              onClick={() => setIsOpen(false)} 
              className="focus:outline-none"
              aria-label="Đóng chat box"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ChatIcon className="h-12 w-12 mb-2" />
              <p className="text-center">Chào mừng bạn! Hãy đặt câu hỏi để bắt đầu cuộc trò chuyện.</p>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  chat.sender === 'user'
                    ? 'ml-auto bg-blue-500 text-white'
                    : 'mr-auto bg-gray-200 text-gray-800'
                } p-3 rounded-lg max-w-[80%] relative ${chat.isError ? 'bg-red-100 text-red-800' : ''}`}
              >
                <div className="text-sm mb-1 font-medium">
                  {chat.sender === 'user' ? 'Bạn' : 'Shop VVDG'}
                </div>
                {formatMessageWithLinks(chat.text)}
                {chat.timestamp && (
                  <div className="text-xs opacity-70 text-right mt-1">
                    {formatMessageTime(chat.timestamp)}
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="mr-auto bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className={`px-4 py-2 bg-blue-500 text-white rounded-r-lg ${
                isLoading || !message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              aria-label="Gửi tin nhắn"
            >
              <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox; 