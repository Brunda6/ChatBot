import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending

    // Add user question to chat history
    setChatHistory(prev => [...prev, { type: 'question', content: currentQuestion }]);

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDBdurOttGqDpEyGzjmlHeseyE9Z0e2meI",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setChatHistory(prev => [...prev, { type: 'answer', content: aiResponse }]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-pink-100 via-purple-200 to-indigo-200">
      <div className="h-full max-w-4xl mx-auto flex flex-col p-3">
        {/* Fixed Header */}
        <header className="text-center py-4">
          <h1 className="font-serif text-5xl font-bold text-purple-700 hover:text-purple-500 transition-colors">
            Chat AI
          </h1>



        </header>

        {/* Scrollable Chat Container - Updated className */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 rounded-[50px] border-4 border-purple-400 bg-purple shadow-lg p-4 hide-scrollbar"
        >

          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center  text-center p-6">
              <div className="bg-purple-100 rounded-[50px] p-8 max-w-2xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-purple-500 mb-4">Hey there, Human! 🤖</h2>
                <p className="text-gray-700 mb-6">
                  I'm your friendly ChatBot, here to brighten your day and answer your burning questions. Here's what I can do:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500">
                    <span className="text-purple-500">🚀</span> Launch solutions to your problems at light speed!
                  </div>
                  <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500">
                    <span className="text-purple-500">🌟</span> Drop facts so random, you’ll think I’m on Wikipedia 24/7.
                  </div>
                  <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500">
                    <span className="text-purple-500">🤯</span> Solve your tech problems faster than you can say “debugging.”
                  </div>
                  <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500">
                    <span className="text-purple-500">🎨</span> Turn your dull ideas into Shakespeare-worthy masterpieces.
                  </div>
                </div>
                <p className="text-gray-600 mt-6 text-sm">
                  Go on, don’t be shy. Type your query below, hit Enter, or smash that Send button!
                </p>
              </div>

            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div key={index} className={`mb-4 ${chat.type === 'question' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-[80%] p-3 rounded-[50px] overflow-auto hide-scrollbar ${chat.type === 'question'
                    ? 'bg-purple-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                    <ReactMarkdown className="overflow-auto hide-scrollbar">{chat.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </>
          )}
          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block bg-gray-100 p-3 rounded-[80px] animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Form */}
        <form onSubmit={generateAnswer} className="bg-purple-50 rounded-[20px] shadow-lg p-4">
          <div className="flex gap-2">
            <textarea
              required
              className="flex-1 border border-purple-300 rounded-[80px] p-3 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-6 py-2 bg-purple-500 text-white rounded-[10px] hover:bg-purple-600 transition-colors ${generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
            <button
              onClick={() => setChatHistory([])}
              className="px-6 py-2 bg-purple-500 text-white rounded-[10px] hover:bg-purple-600 transition-colors ${generatingAnswer ? 'opacity-50 cursor-not-allowed"
            >
              Clear Chat
            </button>
          </div>

        </form>
      </div>


    </div>
  );
}

export default App;


// npm run build               -->  to deploy it in the netlify
// npm run dev                 -->  to run the App.jsk
