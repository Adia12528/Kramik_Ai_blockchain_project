import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [sessionId, setSessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const [providers, setProviders] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('groq');
  const [selectedModel, setSelectedModel] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load providers on mount
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const response = await api.get('/ai-chat/providers');
      setProviders(response.data.providers);
      setSelectedProvider('local');
      setSelectedModel('Built-in Knowledge Base');
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai-chat/chat', {
        question: inputMessage,
        sessionId
      });
      
      const aiMessage = {
        role: 'assistant',
        content: response.data.answer,
        category: response.data.category,
        provider: response.data.provider,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorText = error.message || 'Sorry, I encountered an error. Please try again.';
      
      if (error.response?.status === 401) {
        errorText = '❌ Authentication required. Please log in again.';
      } else if (error.response?.status === 500) {
        errorText = '❌ Server error. The AI is processing your request. Details: ' + (error.response?.data?.message || 'Unknown error');
      } else if (error.response?.data?.error) {
        errorText = '❌ ' + error.response.data.error;
      } else if (error.status && error.status !== 200) {
        errorText = `❌ Request failed with status ${error.status}: ${error.message}`;
      } else if (!error.response) {
        errorText = '❌ Cannot connect to server. Please ensure the backend is running.';
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorText,
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (isClearing) return;
    if (window.confirm('Clear all conversation history?')) {
      setIsClearing(true);
      try {
        await api.delete(`/ai-chat/history/${sessionId}`);
        setMessages([]);
        setSessionId(() => `session_${Date.now()}_${Math.random()}`);
      } catch (error) {
        console.error('Failed to clear history:', error);
        const infoMessage = {
          role: 'assistant',
          content: error.message ? `❌ Failed to clear history: ${error.message}` : '❌ Failed to clear history. Please try again.',
          isError: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, infoMessage]);
      } finally {
        setIsClearing(false);
      }
    }
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    const isError = message.isError;

    return (
      <div
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
      >
        <div
          className={`max-w-3xl rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-indigo-600 text-white'
              : isError
              ? 'bg-red-100 text-red-800 border border-red-300'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <div className="flex items-start gap-3">
            {!isUser && (
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="prose prose-sm max-w-none">
                {renderContent(message.content)}
              </div>
              {message.category && !isUser && (
                <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
                  <span className="px-2 py-1 bg-white bg-opacity-20 rounded">
                    {message.category}
                  </span>
                  {message.provider && (
                    <span className="px-2 py-1 bg-white bg-opacity-20 rounded">
                      {message.provider}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = (content) => {
    // Split content into code blocks and text
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, idx) => {
      if (part.startsWith('```')) {
        const code = part.slice(3, -3);
        const lines = code.split('\n');
        const language = lines[0].trim();
        const codeContent = lines.slice(1).join('\n');

        return (
          <div key={idx} className="my-3">
            <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
              <span className="text-sm font-mono">{language || 'code'}</span>
              <button
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }
      return (
        <div key={idx} className="whitespace-pre-wrap">
          {part}
        </div>
      );
    });
  };

  const quickPrompts = [
    { icon: '🔍', text: 'Explain binary search algorithm', category: 'Algorithm' },
    { icon: '📚', text: 'What is a stack data structure?', category: 'Data Structure' },
    { icon: '💻', text: 'Show me quicksort in Python', category: 'Code' },
    { icon: '🌳', text: 'Explain binary tree traversal', category: 'Algorithm' },
    { icon: '🚀', text: 'Create a REST API example', category: 'Code' },
    { icon: '⚛️', text: 'React component with hooks', category: 'Web Dev' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Engineering Assistant</h1>
              <p className="text-sm text-gray-500">Built locally - No API keys needed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
              ✓ Local AI - Privacy First
            </div>
            
            <button
              onClick={handleClearHistory}
              disabled={isClearing}
              className={`px-4 py-2 text-sm rounded-lg transition border border-transparent ${
                isClearing
                  ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {isClearing ? 'Clearing…' : 'Clear Chat'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Local AI Assistant
              </h2>
              <p className="text-gray-600 mb-6">
                Powered by built-in knowledge base - Ask about algorithms, data structures, coding, and more!
                <br />
                <span className="text-sm text-green-600 font-semibold">✓ No API keys • ✓ Works offline • ✓ Privacy-focused</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(prompt.text)}
                  className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition text-left group"
                >
                  <div className="text-2xl mb-2">{prompt.icon}</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {prompt.category}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {prompt.text}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            <div ref={messagesEndRef} />
          </>
        )}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask any engineering question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Be specific with your questions for better answers. Include code snippets if debugging.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
