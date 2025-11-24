# AI Engineering Assistant Setup Guide

## Overview
This guide will help you set up the AI Engineering Assistant for the Kramik admin dashboard. The assistant uses free LLM APIs to answer engineering questions.

## Features
- 🤖 **Multiple LLM Providers**: Groq (fastest), Hugging Face, and local fallback
- 💬 **Conversation History**: Context-aware responses
- 🎯 **Smart Categorization**: Auto-detects question type (code, debug, architecture, general)
- 💻 **Code Generation**: Production-ready code with explanations
- 🔍 **Syntax Highlighting**: Beautiful code blocks with copy functionality
- 📚 **Engineering Expertise**: Covers algorithms, data structures, system design, and more

## Quick Start

### Step 1: Get Free API Keys (Choose ONE)

#### Option A: Groq (Recommended - Fastest)
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to "API Keys"
4. Click "Create API Key"
5. Copy your key

**Models Available:**
- `mixtral-8x7b-32768` - Best for general engineering questions
- `llama2-70b-4096` - Great for code generation
- `gemma-7b-it` - Fast responses

#### Option B: Hugging Face
1. Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Sign up or log in
3. Click "New token"
4. Select "Read" access
5. Copy your token

**Models Available:**
- `mistralai/Mistral-7B-Instruct-v0.2` - Excellent for instructions
- `codellama/CodeLlama-7b-Instruct-hf` - Specialized for code
- `microsoft/phi-2` - Lightweight and fast

### Step 2: Configure Backend

1. **Update `.env` file** in `backend/` directory:
```env
# Add ONE of these (Groq recommended):
GROQ_API_KEY=gsk_your_actual_key_here

# OR use Hugging Face:
HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

2. **Register the AI Chat route** in `backend/server.js`:
```javascript
// Add this import at the top
const aiChatRoutes = require('./src/routes/aiChat');

// Add this route registration (after other routes)
app.use('/api/ai-chat', aiChatRoutes);
```

3. **Install axios** if not already installed:
```bash
cd backend
npm install axios
```

### Step 3: Update Admin Dashboard

Add the AI Assistant to your admin page (`frontend/src/pages/Admin.jsx`):

```javascript
import AIAssistant from '../components/admin/AIAssistant';

// Inside your Admin component, add a new tab:
const [activeTab, setActiveTab] = useState('overview'); // Add 'ai-assistant' as option

// In your tab navigation:
<button onClick={() => setActiveTab('ai-assistant')}>
  AI Assistant
</button>

// In your content area:
{activeTab === 'ai-assistant' && <AIAssistant />}
```

### Step 4: Start the Application

```bash
# Terminal 1 - Backend
cd kramik-hub/backend
npm start

# Terminal 2 - Frontend
cd kramik-hub/frontend
npm run dev
```

## Usage Examples

### 1. Ask about Algorithms
```
Question: "Explain how binary search works with code example"
```

### 2. Request Code Implementation
```
Question: "Write a React component with useState and useEffect hooks"
```

### 3. Debug Issues
```
Question: "I'm getting 'Cannot read property of undefined' error in JavaScript"
```

### 4. System Design
```
Question: "Design a scalable microservices architecture for an e-commerce platform"
```

### 5. Optimize Performance
```
Question: "How to optimize SQL queries with indexes?"
```

## Architecture

### Backend Components
```
backend/
├── src/
│   ├── controllers/
│   │   └── aiChatController.js   # Main AI logic
│   └── routes/
│       └── aiChat.js              # API routes
```

### API Endpoints
- `POST /api/ai-chat/chat` - Send a question
- `GET /api/ai-chat/history/:sessionId` - Get conversation history
- `DELETE /api/ai-chat/history/:sessionId` - Clear history
- `GET /api/ai-chat/providers` - Get available providers

### Frontend Component
```
frontend/
└── src/
    └── components/
        └── admin/
            └── AIAssistant.jsx    # React UI
```

## How It Works

1. **Question Input**: User types engineering question
2. **Categorization**: System detects if it's code/debug/architecture/general
3. **Context Building**: Adds conversation history and appropriate system prompt
4. **LLM Query**: Sends to configured provider (Groq/HuggingFace)
5. **Response Processing**: Formats answer with code highlighting
6. **History Storage**: Saves conversation for context

## System Prompts

The AI uses specialized prompts for different question types:

- **General**: Expert knowledge across CS, ML, web dev, etc.
- **Code**: Production-ready code with error handling
- **Debug**: Root cause analysis and fixes
- **Architecture**: System design patterns and best practices

## Cost & Limits

### Groq (Free Tier)
- ✅ Very fast responses (< 1 second)
- ✅ Generous rate limits
- ✅ No credit card required
- 📊 ~30 requests per minute

### Hugging Face (Free Tier)
- ✅ Completely free
- ✅ Multiple model options
- ⏱️ Slower than Groq (3-10 seconds)
- 📊 Rate limits based on model

### Local Fallback
- ✅ Works without API keys
- ⚠️ Limited functionality (demo responses)
- 💡 Shows how to configure API keys

## Troubleshooting

### Issue: "Using fallback mode"
**Solution**: Add API key to `.env` and restart backend

### Issue: API timeout
**Solution**: Try different provider or model in dropdown

### Issue: Rate limit exceeded
**Solution**: Wait a minute or switch to alternative provider

### Issue: No response
**Solution**: Check backend logs for errors, verify API key is correct

## Security Notes

- ✅ All routes require authentication
- ✅ API keys stored in `.env` (never in code)
- ✅ Session-based conversation isolation
- ✅ Input validation and error handling
- ⚠️ Don't commit `.env` to git (already in `.gitignore`)

## Advanced Configuration

### Change Default Model
In `aiChatController.js`:
```javascript
const DEFAULT_PROVIDER = 'groq';
const DEFAULT_MODEL = 'mixtral'; // or 'llama70b', 'gemma'
```

### Adjust Response Length
```javascript
parameters: {
  max_new_tokens: 4096, // Increase for longer responses
  temperature: 0.7,     // Lower = more focused, Higher = more creative
}
```

### Modify Conversation History Length
```javascript
if (history.length > 20) { // Change to 10, 30, etc.
  history.shift();
}
```

## Free Alternatives (Future Options)

1. **Together AI** - Multiple open-source models
2. **Replicate** - Pay-per-use, very affordable
3. **OpenRouter** - Multiple providers in one API
4. **LocalAI** - Run models locally (requires GPU)

## Support

For issues or questions:
1. Check backend logs: `cd backend && npm start`
2. Check browser console for frontend errors
3. Verify API keys are correct and active
4. Test API endpoint directly: `curl http://localhost:5000/api/ai-chat/providers`

## Next Steps

- ✅ Get API key from Groq or Hugging Face
- ✅ Add to `.env` file
- ✅ Register route in `server.js`
- ✅ Add component to Admin page
- ✅ Test with sample questions
- 🚀 Start building with AI assistance!

---

**Note**: This AI assistant is designed to help with engineering questions. It provides accurate, detailed answers with working code examples. The quality of responses depends on the LLM provider and model selected.
