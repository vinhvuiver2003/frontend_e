import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon, XIcon, PaperAirplaneIcon, BellIcon, VolumeUpIcon, VolumeOffIcon } from '@heroicons/react/outline';
import chatService from '../../services/chatService';
import { MAX_CHAT_HISTORY } from '../../config';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  const messageAudioRef = useRef(null);
  
 
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
      // Xử lý xuống dòng và định dạng văn bản
      const lines = text.split('\n');
      return (
        <div className="whitespace-pre-wrap">
          {lines.map((line, i) => (
            <p key={i} className="mb-1 last:mb-0">
              {line}
            </p>
          ))}
        </div>
      );
    }
    
    const parts = text.split(regex);
    const matches = text.match(regex) || [];
    
    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          // Nếu phần này là một URL
          if (matches.includes(part)) {
            const href = `http://${part}`;
            return (
              <a 
                key={i}
                href={href}
                className="text-blue-500 hover:underline inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                {part}
              </a>
            );
          }
          // Nếu không phải URL, xử lý xuống dòng
          const lines = part.split('\n');
          return (
            <span key={i}>
              {lines.map((line, j) => (
                <p key={j} className="mb-1 last:mb-0">
                  {line}
                </p>
              ))}
            </span>
          );
        })}
      </div>
    );
  };
  
  // Format thời gian tin nhắn
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Cập nhật phần hiển thị tin nhắn
  const MessageBubble = ({ message, isUser }) => {
    const formattedTime = message.timestamp 
      ? format(new Date(message.timestamp), 'HH:mm', { locale: vi })
      : '';

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
              {isUser ? (
                <span className="text-white text-sm font-medium">Bạn</span>
              ) : (
                <span className="text-gray-600 text-sm font-medium">Bot</span>
              )}
            </div>
            <span className="text-xs text-gray-500">{formattedTime}</span>
          </div>
          <div className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-blue-500 text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          } ${message.isError ? 'bg-red-100 text-red-800' : ''} break-words`}>
            {formatMessageWithLinks(message.text)}
          </div>
        </div>
      </div>
    );
  };

  // Cập nhật phần hiển thị loading
  const LoadingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="flex flex-col max-w-[80%]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">Bot</span>
          </div>
        </div>
        <div className="bg-gray-100 text-gray-800 rounded-lg p-3 rounded-tl-none">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );

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
        } flex-col w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl overflow-hidden transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-500 text-white">
          <div className="flex items-center gap-2">
            <ChatIcon className="h-5 w-5" />
            <h3 className="font-medium">Chat với chúng tôi</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSound}
              className="focus:outline-none hover:bg-blue-600 p-1 rounded"
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
              className="focus:outline-none hover:bg-blue-600 p-1 rounded"
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
              <MessageBubble 
                key={index}
                message={chat}
                isUser={chat.sender === 'user'}
              />
            ))
          )}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className={`p-2 bg-blue-500 text-white rounded-lg ${
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