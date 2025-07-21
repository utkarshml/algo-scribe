import { MessageBubble } from '@/components/MessageBubble';
import { Card } from '@/components/ui/card';
import { Bot, Lightbulb } from 'lucide-react';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Message } from '@/types/custom';
import { ChatInput } from '@/components/ChatInterface';
import { supabase } from '../background';
import { User } from '@supabase/supabase-js';
import { Loader } from '../popup/App';
import { useCallback } from 'react';
import { Badge } from '@/components/ui/badge';

const sampleResponse = [
  {
    "output": {
      "question_name": "Matrix Chain Multiplication",
      "description": "Given a sequence of matrices, find the most efficient way to multiply these matrices together. The input is an array p of length n+1 where the i-th matrix has dimensions p[i-1] x p[i]. Determine the minimum number of scalar multiplications needed to multiply the chain.",
      "input_format": {
        "n": "Number of matrices in the chain",
        "arr": "Array of dimensions (size: n+1), where matrix i has dimensions p[i-1] x p[i]",
        "k": "Not applicable in this problem"
      },
      "output_format": {
        "return": "Minimum number of scalar multiplications needed to multiply the matrix chain"
      },
      "test_cases": [
        {
          "input": {
            "arr": [40, 20, 30, 10, 30]
          },
          "output": 26000,
          "explanation": "The optimal order is ((A1 x A2) x A3) x A4, which results in 26000 scalar multiplications."
        },
        {
          "input": {
            "arr": [10, 20, 30, 40, 30]
          },
          "output": 30000,
          "explanation": "The optimal multiplication sequence minimizes the scalar multiplications to 30000."
        }
      ],
      "userCode": "// C++ starter code\nint matrixChainOrder(vector<int>& p) {\n    int n = p.size() - 1;\n    // your code initializing dp table here\n    return 0;\n}",
      "topic": ["Dynamic Programming", "Matrix Chain Multiplication", "Optimization"],
      "difficulty": "Hard",
      "solution_code": "#include <iostream>\n#include <vector>\n#include <limits>\nusing namespace std;\n\n// Function to compute the minimum number of multiplications required\nint matrixChainOrder(vector<int>& p) {\n    int n = p.size() - 1; // number of matrices\n    // Create a DP table where dp[i][j] represents the minimum cost to multiply matrices i through j\n    vector<vector<long long>> dp(n + 1, vector<long long>(n + 1, 0));\n\n    // The cost is zero when multiplying one matrix (i==j)\n    // We consider subsequences of matrix chain with chain length from 2 to n\n    for (int len = 2; len <= n; len++) {\n        for (int i = 1; i <= n - len + 1; i++) {\n            int j = i + len - 1;\n            dp[i][j] = numeric_limits<long long>::max();\n            // Try all possible splits between i and j\n            for (int k = i; k < j; k++) {\n                long long cost = dp[i][k] + dp[k + 1][j] + (long long)p[i - 1] * p[k] * p[j];\n                if (cost < dp[i][j]) {\n                    dp[i][j] = cost;\n                }\n            }\n        }\n    }\n\n    // The result for the full chain multiplication is stored in dp[1][n]\n    return dp[1][n];\n}",
      "note": "Remember that matrix multiplication is associative but not commutative. The correct parenthesization significantly affects the efficiency of the multiplication process.",
      "interview_tips": [
        "Clearly explain the dynamic programming approach and how you fill the DP table using optimal substructure properties.",
        "Discuss how the decision to split at different points leads to the overall minimal multiplication cost.",
        "Be ready to talk about the time and space complexity, and why the problem is challenging due to its cubic time requirement."
      ]
    }
  }
];
type questionRequestType = {
  id?: string;
  question: string;
  description?: string;
  code?: string;
  language?: string;
  difficulty?: string;
  isChat: boolean;
}

function App() {
  const sessionId = useRef(`sid-${Math.random().toString(36).substring(2, 10)}`).current;
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionRequest, setQuestionRequest] = useState<questionRequestType | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isChat, setIsChat] = useState(true)
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isQuestionAvailable , setIsQuestionAvailable] = useState(false);
  const [user, setUser] = useState<User | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    browser.runtime.sendMessage({ type: 'SET_PAGE_INFO' }, (resp) => {
      if (resp.data.action === 'gen_note') {
        setQuestionRequest(resp.data);
        setIsQuestionAvailable(false)
        if (resp.data.code && resp.data.language) {
          setMessages(pre => [...pre, { id: crypto.randomUUID(), sender: "system", system: { question: resp.data.question, description: resp.data.description, code: resp.data.code, language: resp.data.language, difficulty: resp.data.difficulty }, timestamp: new Date(), isStore: false }])
        } else {
          setMessages(pre => [...pre, { id: crypto.randomUUID(), sender: "system", system: { question: resp.data.question, description: resp.data.description, difficulty: resp.data.difficulty }, timestamp: new Date(), isStore: false }])
        }
      }else{
        setIsChat(true);
      }
    });
  }, [])

  useEffect(() => {
    async function fetchSession() {
      try {
        const { supabaseToken:  session  } = await browser.storage.local.get('supabaseToken');
        if (session) {
          const { error } = await supabase.auth.setSession(session);
          if (!error) {
            setUser(session.user);
          } else {
            console.error("Supabase session error:", error);
          }
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const chatHandler = () => {
    setIsChat(!isChat)
    setIsQuestionAvailable(!isQuestionAvailable)
  }

  const sendMessageRequest = async (
  requestBody: any
): Promise<any> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const resp = await response.json();
    const output = resp?.response;
    if (output.isChat) {
      return {
        id: crypto.randomUUID(),
        sender: "bot",
        botMessage: output.return ?? "No response generated",
        timestamp: new Date(),
        isChat : true,
      };
    } else {
      return {
        id: crypto.randomUUID(),
        sender: "bot",
        botMessage: output ?? "No response generated",
        questionResponse: output ?? null,
        timestamp: new Date(),
        isChat : false,
      };
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    return {
      id: sessionId,
      sender: "bot",
      botMessage: "Error fetching response",
      timestamp: new Date(),
      isChat : true,
    };
  }
};
const generateNote = async () =>{
    setIsTyping(true);
    const text : string = "Generate Note";
    setMessages((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      sender: "user",
      userMessage: text,
      timestamp: new Date(),
      isChat: false,
    },
  ]);
  const botResponse = await sendMessageRequest({
        id: sessionId,
        question_name: questionRequest?.question,
        description: questionRequest?.description,
        user_code: questionRequest?.code,
        language: questionRequest?.language,
        difficulty: questionRequest?.difficulty,
        message: "Generate Note",
        isChat: false,
      });
  setMessages((prev) => [...prev, botResponse]);
  setIsTyping(false);
};
const handleSendMessage = useCallback(async () => {
  if (!inputValue.trim()) return;
  
  setIsTyping(true);
  setInputValue("");
  setMessages((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      sender: "user",
      userMessage: inputValue,
      timestamp: new Date(),
      isChat: isChat,
    },
  ]);

  const requestBody = {
        id: sessionId,
        question_name: questionRequest?.question,
        description: questionRequest?.description,
        user_code: questionRequest?.code,
        language: questionRequest?.language,
        difficulty: questionRequest?.difficulty,
        message: inputValue,
        isChat: isChat,
      };
  const botResponse = await sendMessageRequest(requestBody);

  setMessages((prev) => [...prev, botResponse]);
  setIsTyping(false);
}, [inputValue, sessionId, questionRequest]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  if (loading) {
    return (
      <div className='flex justify-content items-center w-full h-[100vh]'>
        <Loader />
      </div>
    )
  }
  if (!user) {
    return (
      <div className='flex justify-content bg-[rgb(10,10,10)] items-center w-full h-[100vh]'>
        <h2 className='text-xl text-center text-purple-800 w-full font-bold'>Please Login First</h2>
      </div>
    )
  }
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto overflow-y-auto 
       bg-[rgb(10,10,10)] ">
      {/* Header */}
      <Card className="flex items-start  justify-between p-4 rounded-none border-none  shadow-md bg-[rgb(23,22,22)] ">
        <div className="flex  items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div >
            <h1 className="text-xl text-start font-semibold text-white bg-clip-text">AI Chat Assistant</h1>
            <p className="text-xs text-start text-white bg-clip-text">Powered by Algo-Scribe</p>
          </div>
        </div>
      </Card>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        * {messages.map((message) => (
          <MessageBubble user_id={user.id}  generatedHandler={generateNote} sessionId={sessionId} message={message}
            key={message.id} />
        ))}

 
        {isTyping && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
     <div ref={chatEndRef} ></div>
      </div>
      {/* Input Area */}
      <Card className="p-4 rounded-tl-2xl gap-2 rounded-tr-2xl   border-none   bg-[rgb(23,22,22)] ">
        <div className="options">
          <Badge variant={"default"} onClick={chatHandler} style={{ opacity: 0.8 }} className={` px-4 py-1 cursor-pointer ${isChat == true ? "bg-blue-600 font-semibold"  : "bg-white/20"} border rounded-full border-[rgb(85,85,85)] hover:bg-blue-400 text-white`}  >
          <Lightbulb className='font-bold' />  <span >Chat</span>
          </Badge>
        </div>
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
        />
        <span className='text-pink-500 font-bo'>For more lines, use shift+enter and for code, use triple backticks</span>
      </Card>

      
    </div>
  )
}

export default App;