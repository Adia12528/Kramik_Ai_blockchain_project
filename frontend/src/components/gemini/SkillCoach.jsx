import React, { useState } from 'react'
import { Send, Bot, User, Sparkles, Lightbulb, BookOpen, Target } from 'lucide-react'

const SkillCoach = ({ student }) => {
  const [query, setQuery] = useState('')
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const suggestedQueries = [
    "Suggest a project for Data Structures practice",
    "How can I improve my web development skills?",
    "What should I learn after React.js?",
    "Recommend resources for algorithm practice",
    "Create a study plan for database concepts",
    "How to prepare for technical interviews?"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    const userMessage = { 
      type: 'user', 
      content: query,
      timestamp: new Date().toISOString()
    }
    
    setConversation(prev => [...prev, userMessage])
    setLoading(true)
    setError('')
    
    const currentQuery = query
    setQuery('')

    try {
      // Simulate API call to Gemini
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockResponse = generateMockResponse(currentQuery, student)
      
      const botMessage = { 
        type: 'bot', 
        content: mockResponse,
        timestamp: new Date().toISOString()
      }
      
      setConversation(prev => [...prev, botMessage])
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error('Skill coach error:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateMockResponse = (userQuery, studentProfile) => {
    const responses = {
      "project": `Based on your skills in ${studentProfile?.skills?.join(', ') || 'programming'}, here's a great project idea:

## 📋 Inventory Management System

**Tech Stack:** React.js, Node.js, MongoDB, Express

**Key Features:**
- User authentication and authorization
- CRUD operations for inventory items
- Real-time stock updates
- Sales analytics dashboard
- Barcode scanning integration

**Learning Outcomes:**
- Full-stack development
- Database design
- API development
- State management
- Deployment strategies

**Next Steps:** Start with building the backend API, then create the React frontend. Use MongoDB for data storage and JWT for authentication.`,

      "skills": `Looking at your current skills (${studentProfile?.skills?.join(', ') || 'programming fundamentals'}), here's a skill development path:

## 🚀 Recommended Learning Path

**Immediate Focus (2-3 weeks):**
1. **Advanced JavaScript** - ES6+ features, async/await
2. **React Hooks** - useState, useEffect, custom hooks
3. **Node.js Fundamentals** - Express, middleware, routing

**Intermediate Goals (1-2 months):**
1. **Database Management** - MongoDB/PostgreSQL
2. **API Design** - RESTful principles, authentication
3. **Version Control** - Advanced Git workflows

**Advanced Topics (3+ months):**
1. **Cloud Deployment** - AWS/Azure fundamentals
2. **Testing** - Jest, React Testing Library
3. **System Design** - Scalability patterns

**Resources:**
- FreeCodeCamp's JavaScript Algorithms
- React Official Documentation
- Node.js Best Practices`,

      "resources": `Here are excellent resources for ${userQuery.toLowerCase().includes('algorithm') ? 'algorithm practice' : 'web development'}:

## 📚 Learning Resources

**Interactive Platforms:**
- LeetCode - Algorithm challenges
- HackerRank - Coding practice
- FreeCodeCamp - Project-based learning
- Codecademy - Interactive courses

**Video Content:**
- Traversy Media (YouTube) - Web development
- FreeCodeCamp (YouTube) - Full courses
- The Net Ninja - Modern frameworks

**Documentation:**
- MDN Web Docs - Web technologies
- React Official Docs - Latest features
- Node.js Guides - Backend development

**Practice Projects:**
- Build a portfolio website
- Create a REST API
- Develop a chat application
- Make a e-commerce prototype`,

      "default": `I'd be happy to help you with "${userQuery}"! 

Based on your profile as a ${studentProfile?.course || 'Computer Science'} student at ${studentProfile?.college || 'your university'}, here's my advice:

## 💡 Personalized Guidance

**Key Recommendations:**
1. **Focus on Fundamentals** - Ensure strong grasp of core concepts
2. **Build Projects** - Apply theoretical knowledge practically
3. **Join Communities** - Engage with peer learners and professionals
4. **Continuous Learning** - Stay updated with industry trends

**Actionable Steps:**
- Set specific, measurable goals
- Create a weekly study schedule
- Work on at least one project simultaneously
- Participate in coding challenges

Remember: Consistency is more important than intensity. Regular practice will yield better long-term results than cramming.

Would you like me to elaborate on any specific aspect or provide more detailed resources?`
    }

    if (userQuery.toLowerCase().includes('project')) return responses.project
    if (userQuery.toLowerCase().includes('skill') || userQuery.toLowerCase().includes('improve')) return responses.skills
    if (userQuery.toLowerCase().includes('resource') || userQuery.toLowerCase().includes('learn')) return responses.resources
    
    return responses.default
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
  }

  const formatBotResponse = (text) => {
    const lines = text.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h3 key={index} className="text-lg font-bold mt-6 mb-3 text-indigo-700 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            {line.replace('## ', '')}
          </h3>
        )
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-gray-800">
            {line.replace(/\*\*/g, '')}
          </strong>
        )
      } else if (line.trim() === '') {
        return <div key={index} className="h-3" />
      } else if (line.includes(':')) {
        const [label, value] = line.split(':')
        return (
          <div key={index} className="flex mb-2">
            <span className="font-semibold text-gray-700 w-32 flex-shrink-0">{label}:</span>
            <span className="text-gray-600 flex-1">{value}</span>
          </div>
        )
      } else {
        return (
          <p key={index} className="text-gray-700 mb-2 leading-relaxed">
            {line}
          </p>
        )
      }
    })
  }

  const clearConversation = () => {
    setConversation([])
    setError('')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Skill Development Coach</h3>
            <p className="text-gray-600 text-sm">
              Get personalized study tips and project ideas
            </p>
          </div>
        </div>
        
        {conversation.length > 0 && (
          <button
            onClick={clearConversation}
            className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Conversation Area */}
      <div className="mb-6 h-80 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {conversation.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <Lightbulb className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Ready to help you learn!</p>
            <p className="text-sm">Ask me anything about your studies, projects, or career goals.</p>
          </div>
        ) : (
          conversation.map((message, index) => (
            <div
              key={index}
              className={`flex space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-purple-100 text-purple-600'
                }`}
              >
                {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`flex-1 p-4 rounded-lg max-w-[85%] ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium opacity-75">
                    {message.type === 'user' ? 'You' : 'Study Coach'}
                  </span>
                  <span className="text-xs opacity-60">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                {message.type === 'user' ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <div className="text-sm space-y-2">
                    {formatBotResponse(message.content)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>Analyzing your query...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Suggested Queries */}
      {conversation.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            Try asking:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQueries.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition duration-200 text-left hover:shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask for study advice, project ideas, or career guidance..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
            disabled={loading}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

      {/* Features Highlight */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500">
        <div className="text-center">🎯 Personalized</div>
        <div className="text-center">⚡ Instant</div>
        <div className="text-center">📚 Educational</div>
      </div>
    </div>
  )
}

export default SkillCoach