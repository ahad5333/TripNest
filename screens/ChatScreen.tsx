import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Screen from '../components/Screen';
import Icon from '../components/Icon';
import geminiService from '../services/geminiService';

// Add SpeechRecognition types to the global window object to avoid TypeScript errors.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceListeningModal: React.FC<{ onStop: () => void }> = ({ onStop }) => (
  <div 
    className="fixed inset-0 bg-black/50 z-50 flex flex-col justify-center items-center backdrop-blur-sm"
    onClick={onStop}
    role="dialog"
    aria-modal="true"
    aria-label="Voice input active"
  >
    <div className="bg-white rounded-full p-6 animate-pulse">
        <Icon name="Mic" className="h-12 w-12 text-deep-ocean-blue" />
    </div>
    <p className="text-white text-xl mt-4 font-semibold">Listening...</p>
    <p className="text-gray-300 text-sm mt-1">Tap anywhere to cancel</p>
  </div>
);


const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! How can I help you plan your next trip?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speechStartTimeRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const quickReplies = [
    'Suggest a weekend trip',
    'Best restaurants nearby?',
    'Help me pack for Kyoto',
    'Translate "Where is the bathroom?" to Japanese',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = typeof messageText === 'string' ? messageText : input;
    if (textToSend.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await geminiService.sendMessage(textToSend);
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickReplyClick = (reply: string) => {
    if (isLoading) return;
    handleSendMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
        stopListening();
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    let finalTranscript = '';
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      speechStartTimeRef.current = Date.now();
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      finalTranscript = speechResult;
      setInput(speechResult); // Populate the input field
      stopListening();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
       if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone access in your browser settings.');
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      if (speechStartTimeRef.current) {
          const duration = Date.now() - speechStartTimeRef.current;
          // If user spoke for more than 3 seconds, send the message automatically.
          if (duration > 3000 && finalTranscript.trim()) {
              handleSendMessage(finalTranscript);
          }
          speechStartTimeRef.current = null;
      }
    };

    recognition.start();
};

  return (
    <>
    {isListening && <VoiceListeningModal onStop={stopListening} />}
    <Screen title="AI Assistant">
      <div className="flex flex-col h-[calc(100vh-140px)] bg-background">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-white dark:text-text-primary rounded-br-none'
                    : 'bg-surface border border-border text-text-primary rounded-bl-none'
                }`}
              >
                {/* NOTE: Using dangerouslySetInnerHTML is not ideal, but suitable here for rendering Gemini's markdown response.
                    In a production app, use a dedicated markdown renderer like 'react-markdown' for better security. */}
                <div className="text-sm prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-surface border border-border text-text-primary rounded-bl-none">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-surface border-t border-border">
          <div className="flex overflow-x-auto space-x-2 pb-3 -mb-1">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReplyClick(reply)}
                disabled={isLoading}
                className="flex-shrink-0 px-3 py-1.5 text-sm font-medium bg-background dark:bg-border text-text-primary rounded-full hover:bg-border disabled:opacity-50 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about travel..."
              className="w-full pl-4 pr-12 py-3 text-base bg-background border border-border text-text-primary rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={isLoading}
              aria-label="Chat input"
            />
            {input.trim() === '' ? (
                <button
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-text-secondary hover:text-primary disabled:text-text-secondary/50 transition-colors"
                    aria-label="Use voice input"
                >
                    <Icon name="Mic" className="h-6 w-6" />
                </button>
            ) : (
                <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-primary disabled:text-text-secondary transition-colors"
                    aria-label="Send message"
                >
                    <Icon name="ArrowRight" className="h-6 w-6" />
                </button>
            )}
          </div>
        </div>
      </div>
    </Screen>
    </>
  );
};

export default ChatScreen;