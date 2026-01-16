# 📋 Algo-Scribe Project Summary

## 🎯 Project Overview

**Algo-Scribe** is a Chrome browser extension designed to help developers preparing for coding interviews by automatically capturing coding questions from platforms like LeetCode and GeeksforGeeks, organizing solutions, and generating AI-powered revision notes.

---

## 🏗️ Architecture & Technology Stack

### **Core Technologies**
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | WXT + Vite | Browser extension development framework |
| **Frontend** | React 19.1.0 + TypeScript 5.8.3 | UI components and type safety |
| **Styling** | TailwindCSS 4.1.10 + shadcn/ui | Modern, responsive UI design |
| **Backend** | Supabase | Database, authentication, and storage |
| **AI/Chat** | Azure OpenAI API | AI-powered note generation and chat |
| **Automation** | n8n | MVP agent for backend workflow |
| **State Management** | TanStack React Query 5.81.2 | Server state management |
| **Communication** | webext-bridge | Cross-extension messaging |

### **Key Dependencies**
- **UI Components**: Radix UI (Accordion, Dialog, Select, Tooltip)
- **Markdown**: react-markdown, rehype-highlight
- **Code Highlighting**: react-syntax-highlighter
- **Icons**: lucide-react
- **Notifications**: sonner
- **Theme**: next-themes (dark/light mode support)

---

## 📂 Project Structure

```
algo_scribe_extension/
├── entrypoints/              # Extension entry points
│   ├── background.ts         # Service worker (background scripts)
│   ├── content.ts            # Content scripts (page interaction)
│   ├── injector.ts           # Script injector
│   ├── popup/                # Extension popup UI
│   └── sidepanel/            # Side panel UI (main chat interface)
│       └── App.tsx           # Main side panel application
│
├── components/               # React components
│   ├── ui/                   # shadcn/ui base components
│   ├── MessageBubble.tsx     # Chat message display
│   ├── MessageRespon.tsx     # AI response rendering
│   ├── ActionCard.tsx        # Action cards (save/delete)
│   ├── QuestionCard.tsx      # Question display card
│   ├── ChatInterface.tsx     # Chat input interface
│   ├── Auth.tsx              # Authentication component
│   ├── UserProfile.tsx       # User profile display
│   ├── FilterControls.tsx    # Dashboard filters
│   ├── ThemeProvider.tsx     # Theme management
│   ├── ThemeButton.tsx       # Theme toggle
│   ├── CodeDisplay.tsx       # Code syntax highlighting
│   ├── markdown-renderer.tsx # Markdown rendering
│   ├── editable-field.tsx    # Inline editing
│   ├── editable-list.tsx     # List editing
│   ├── topic-editor.tsx      # Topic management
│   └── create-question-modal.tsx # Manual question creation
│
├── lib/                      # Utility libraries
│   ├── database.ts           # Supabase database types & queries
│   └── utils.ts              # Helper utilities
│
├── types/                    # TypeScript type definitions
│   └── custom.d.ts           # Custom type definitions
│
├── assets/                   # Static assets (logo, images)
├── public/                   # Public assets
├── demo/                     # Demo screenshots
├── wxt.config.ts             # WXT configuration
├── tailwind.config.ts        # TailwindCSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

---

## 🎨 Key Features

### 1. **Auto-Detection of Coding Problems**
- Automatically detects when users are on LeetCode or GeeksforGeeks
- Scrapes problem details (name, description, difficulty, topics)
- Captures user's solution code

### 2. **AI-Powered Note Generation**
The extension uses Azure OpenAI to generate structured revision notes with:
- **Overview**: Problem summary in simple terms
- **Context & Importance**: Real-world applications
- **Key Concepts**: Algorithms, data structures, patterns
- **Step-by-Step Solution**: Detailed explanation with examples
- **Canonical Solution Code**: Clean, commented code with complexity analysis
- **Interview Tips**: Best practices for discussing the problem

### 3. **Interactive Chat Interface**
- AI tutor for coding questions
- Context-aware responses based on the current problem
- Support for follow-up questions
- Code snippet handling with syntax highlighting

### 4. **Organized Dashboard**
- Filter by difficulty, topics, and tags
- Search functionality
- Progress tracking
- Clean, exportable notes

### 5. **Theme Support**
- Custom purple/pink theme
- VS Code-like syntax highlighting
- Dark/light mode toggle
- Glassmorphism design elements

### 6. **Authentication & Data Persistence**
- Google OAuth integration
- Supabase backend for data storage
- User profile management
- Cross-device synchronization

---

## 🔧 Extension Components

### **1. Background Service Worker** (`background.ts`)
- Manages extension lifecycle
- Handles authentication with Supabase
- Coordinates communication between popup, sidepanel, and content scripts

### **2. Content Script** (`content.ts`)
- Injected into coding platform pages
- Scrapes problem information
- Detects user's code submission
- Communicates with background script

### **3. Popup** (`entrypoints/popup/`)
- Quick access interface
- Displays current problem details
- "Generate Note" button

### **4. Side Panel** (`entrypoints/sidepanel/App.tsx`)
- Main AI chat interface (347 lines)
- Message history display
- Chat/Note generation toggle
- Real-time AI responses

---

## 🌐 External Services

### **AI Backend API**
- **Endpoint**: `https://algo-scribe-ai-server.vercel.app/solve`
- **Purpose**: Processes coding questions and generates AI responses
- **Input**: Question details, code, difficulty, user message
- **Output**: Structured notes or chat responses

### **Supabase Configuration**
- Authentication (Google OAuth)
- Database for storing:
  - User profiles
  - Saved questions
  - Notes and solutions
  - Tags and topics
- Real-time subscriptions

---

## 🎨 Design System

### **Theme Configuration**
- **Primary Colors**: Purple/Pink gradient
- **Accent Colors**: Purple (#8b5cf6)
- **Background**: Dark mode optimized
- **Typography**: Clean, modern sans-serif
- **Components**: shadcn/ui with custom theming

### **Component Library**
- **Radix UI Primitives**: Accessible, unstyled components
- **Custom Components**: 
  - Message bubbles with syntax highlighting
  - Action cards with hover effects
  - Editable fields for inline editing
  - Filter controls for dashboard

---

## 📊 Data Models

### **Message Type**
```typescript
type Message = {
  id: string;
  sender: "user" | "bot" | "system";
  userMessage?: string;
  botMessage?: string;
  system?: {
    question: string;
    description: string;
    code?: string;
    language?: string;
    difficulty?: string;
  };
  timestamp: Date;
  isChat: boolean;
  isStore?: boolean;
}
```

### **Question Request Type**
```typescript
type questionRequestType = {
  id?: string;
  question: string;
  description?: string;
  code?: string;
  language?: string;
  difficulty?: string;
  isChat: boolean;
}
```

---

## 🚀 Development Workflow

### **Setup & Installation**
```bash
# Clone the repository
git clone https://github.com/utkarshml/algo-scribe.git

# Navigate to project
cd algo_scribe_extension

# Install dependencies (using bun or npm)
bun install

# Set up environment variables
cp example.env .env
# Add: VITE_ALGO_BASE_URL, VITE_ALGO_SUPA_URL, VITE_ALGO_SUPA_PROJECT
```

### **Development**
```bash
# Run development server
bun dev              # Chrome (default)
bun dev:firefox      # Firefox

# Build for production
bun build            # Chrome
bun build:firefox    # Firefox

# Create distributable zip
bun zip
```

### **Loading the Extension**
1. Run `bun build`
2. Open Chrome → Extensions → Developer Mode
3. Click "Load unpacked"
4. Select the `.output/chrome-mv3` directory

---

## 🔑 Key Features Implementation

### **1. Page Content Scraping**
- Content script detects platform (LeetCode/GeeksforGeeks)
- Extracts problem metadata using DOM selectors
- Sends data to background script via `webext-bridge`

### **2. AI Note Generation Flow**
1. User clicks "Generate Note" in popup
2. Background script stores problem data
3. Side panel opens with problem context
4. User can request AI-generated notes
5. API processes request with Azure OpenAI
6. Structured markdown response displayed
7. Option to save to Supabase

### **3. Chat Functionality**
- Session-based chat (unique session ID per interaction)
- Context-aware: AI knows current problem details
- Supports both general chat and problem-specific queries
- Message history maintained in component state

### **4. Data Persistence**
- Local storage for temporary data
- Supabase for permanent storage
- User authentication state synced across extension
- Questions, notes, and metadata saved to database

---

## 🎯 AI Prompt Engineering

The extension uses a structured prompt (see `prompt.txt`) for AI responses:

### **Prompt Structure**
1. **Inputs**: question, description, difficulty, topics, user_code, language, message
2. **Conditional Behavior**:
   - If problem details provided → Generate full coding revision note
   - If only message provided → Act as coding tutor
3. **Output Format**:
   - Markdown with proper headings
   - Code blocks with syntax highlighting
   - No markdown wrapper symbols

### **Note Structure**
- Overview
- Context & Importance
- Key Concepts
- Step-by-Step Solution
- Canonical Solution Code (with complexity)
- Interview Tips

---

## 🔒 Permissions & Security

### **Chrome Extension Permissions**
- `scripting`: Inject content scripts
- `sidePanel`: Open side panel UI
- `activeTab`: Access current tab
- `tabs`: Tab management
- `storage`: Local data storage
- `host_permissions`: Access all URLs (for platform detection)

### **OAuth Configuration**
- Google OAuth 2.0
- Client ID: `741307501287-7mpuuhoicr348j1vqs9fo9q016ptdgil.apps.googleusercontent.com`
- Scopes: `openid`, `email`, `profile`

---

## 🛣️ Roadmap & Future Plans

### **Planned Features**
- ✨ GitHub sync for problems & notes
- ✨ Flashcard mode for revision
- ✨ Spaced repetition learning algorithm
- ✨ LeetCode API integration (if available)
- ✨ Team workspace / shared dashboard
- ✨ AI-powered progress reports
- 🔮 LangChain + LangGraph integration (replacing n8n)

---

## 🐛 Known Issues & Considerations

### **Browser Compatibility**
- Primary target: Chrome (Manifest V3)
- Firefox support via separate build

### **Platform Support**
- Currently supports: LeetCode, GeeksforGeeks
- Extensible architecture for adding more platforms

### **Performance**
- Efficient message passing with webext-bridge
- React Query for server state caching
- Lazy loading for heavy components

---

## 📈 Metrics & Analytics

### **Code Statistics**
- **Total Lines** (main app): ~347 (sidepanel/App.tsx)
- **Components**: 17+ custom components
- **UI Components**: 13+ shadcn/ui components
- **Dependencies**: 30+ packages

### **AI Integration**
- Backend API: Vercel-hosted
- Response time: Variable (depends on OpenAI)
- Context window: Supports full problem + conversation history

---

## 👨‍💻 Development Best Practices

### **Code Style**
- TypeScript strict mode
- React hooks with proper dependency arrays
- Memoization with `useCallback` for performance
- Component-based architecture
- CSS modules with TailwindCSS utilities

### **Error Handling**
- Try-catch blocks for API calls
- Fallback UI for loading/error states
- Console logging for debugging
- User-friendly error messages

### **Testing**
- Manual testing workflow
- Chrome DevTools for extension debugging
- Network tab monitoring for API calls

---

## 📞 Contact & Support

**Project Creator**: Utkarsh Jaiswal  
**Email**: utkarshjais8957@gmail.com  
**GitHub**: [@utkarshml](https://github.com/utkarshml/algo-scribe)  
**Demo Video**: [YouTube](https://youtu.be/i6JOeYd-PcM)

---

## 📜 License & Contributing

### **Version**: 1.0.2
### **Type**: Educational/Interview Prep Tool

⭐ **Support this project** by starring the repository!

---

## 🎓 Learning Resources

This project demonstrates:
- Chrome Extension development with WXT
- React 19 with TypeScript
- Supabase authentication & database
- AI integration with OpenAI
- Modern UI with shadcn/ui + TailwindCSS
- Cross-context communication in browser extensions
- Content script injection and DOM manipulation

---

**Last Updated**: December 2025  
**Status**: Active Development 🚀
