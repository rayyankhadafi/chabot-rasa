import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';

import { ChatMessage } from './ChatMessage';

import botAvatar from '../../assets/avatars/uad_bot.png';

// =========================
// INTERFACES
// =========================

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

interface ChatInterfaceProps {
  messages: Message[];
  activeChatId: string;

  setChats: React.Dispatch<
    React.SetStateAction<Chat[]>
  >;

    setActiveChatId: (
    id: string
  ) => void;
}

// =========================
// COMPONENT
// =========================

export function ChatInterface({
  messages,
  setChats,
  activeChatId,
  setActiveChatId
}: ChatInterfaceProps) {

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  // =========================
  // FIX QUICK QUESTION
  // =========================

  const hasStartedChat =
    messages.length > 0 || isLoading;

  // =========================
  // AUTO SCROLL
  // =========================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const API_URL =
    import.meta.env.VITE_API_URL;

  // =========================
  // HANDLE SEND
  // =========================

  const handleSend = async (
    customMessage?: string
  ) => {

    const currentInput = input;

    const messageText =
      customMessage || currentInput;

    if (!messageText.trim()) return;

    let currentChatId =
    activeChatId;

    if (!currentChatId) {
      
      const newChat: Chat = {
        id: crypto.randomUUID(),
        title: "Percakapan Baru",
        timestamp: new Date(),
        messages: []
      };

      setChats((prev) => [
        newChat,
        ...prev
      ]);

      setActiveChatId(
        newChat.id
      );

      currentChatId =
        newChat.id;
    }

    // loading aktif lebih awal
    setIsLoading(true);

    // user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    // tampilkan pesan user
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                userMessage
              ]
            }
          : chat
      )
    );

    // kosongkan input
    if (!customMessage) {
      setInput('');
    }

    try {

      // request ke rasa
      const response = await fetch(
        `${API_URL}/webhooks/rest/webhook`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            sender: 'user',
            message: messageText
          })
        }
      );

      const data = await response.json();

      // =========================
      // BOT RESPONSE
      // =========================

      if (data.length > 0) {

        const combinedText = data
          .map((msg: any) =>
            msg.text || ''
          )
          .filter(Boolean)
          .join('\n\n');

        const botMessage: Message = {
          id: crypto.randomUUID(),
          text: combinedText,
          isUser: false,
          timestamp: new Date()
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    botMessage
                  ]
                }
              : chat
          )
        );

      } else {

        // fallback
        const fallbackMessage: Message = {
          id: crypto.randomUUID(),
          text:
            'Maaf, saya tidak memahami pertanyaan Anda.',
          isUser: false,
          timestamp: new Date()
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    fallbackMessage
                  ]
                }
              : chat
          )
        );
      }

    } catch (error) {

      console.error(error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text:
          'Terjadi kesalahan saat menghubungkan ke server chatbot.',
        isUser: false,
        timestamp: new Date()
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  errorMessage
                ]
              }
            : chat
        )
      );

    } finally {

      setIsLoading(false);

    }
  };

  // =========================
  // QUICK QUESTION
  // =========================

  const sendQuickMessage = (
    text: string
  ) => {

    handleSend(text);
  };

  // =========================
  // ENTER TO SEND
  // =========================

  const handleKeyDown = async (
    e: React.KeyboardEvent
  ) => {

    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {

      e.preventDefault();

      if (
        !isLoading &&
        input.trim()
      ) {
        handleSend();
      }
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">

      <ScrollArea className="flex-1 h-full scroll-smooth">

        <div className="max-w-4xl mx-auto w-full px-3 md:px-0">

          {!hasStartedChat ? (

            // =========================
            // WELCOME SCREEN
            // =========================

            <div className="flex flex-col items-center justify-center text-center min-h-[70vh] px-6">

              <img
                src={botAvatar}
                alt="UAD Bot"
                className="w-24 h-24 mb-6 drop-shadow-lg"
              />

              <h1 className="text-3xl font-bold tracking-tight mb-3">
                Selamat Datang di PRIVA
              </h1>

              <p className="text-muted-foreground max-w-xl mb-8 leading-relaxed">
                Tanyakan informasi seputar
                praktikum, responsi, jadwal,
                dan aturan laboratorium Informatika UAD.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">

                <button
                  onClick={() =>
                    sendQuickMessage(
                      'Apa aturan mengikuti responsi?'
                    )
                  }
                  className="p-4 rounded-2xl bg-muted/50 border border-border hover:bg-accent transition-all text-left cursor-pointer"
                >
                  📘 Aturan responsi
                </button>

                <button
                  onClick={() =>
                    sendQuickMessage(
                      'Kapan jadwal praktikum?'
                    )
                  }
                  className="p-4 rounded-2xl bg-muted/50 border border-border hover:bg-accent transition-all text-left cursor-pointer"
                >
                  📅 Jadwal praktikum
                </button>

                <button
                  onClick={() =>
                    sendQuickMessage(
                      'Apa saja tata tertib laboratorium?'
                    )
                  }
                  className="p-4 rounded-2xl bg-muted/50 border border-border hover:bg-accent transition-all text-left cursor-pointer"
                >
                  🧪 Tata tertib lab
                </button>

                <button
                  onClick={() =>
                    sendQuickMessage(
                      'Bagaimana cara mengikuti responsi?'
                    )
                  }
                  className="p-4 rounded-2xl bg-muted/50 border border-border hover:bg-accent transition-all text-left cursor-pointer"
                >
                  🤖 Panduan responsi
                </button>

              </div>

            </div>

          ) : (

            // =========================
            // CHAT AREA
            // =========================

            <div className="py-6 space-y-4">

              {messages.map((message) => (

                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />

              ))}

              {isLoading && messages.length > 0 && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Bot sedang mengetik...
                </div>
              )}

            </div>

          )}

          <div ref={messagesEndRef} />

        </div>

      </ScrollArea>

      {/* =========================
          INPUT AREA
      ========================= */}

      <div className="px-6 py-6 md:px-4 md:py-6 shrink-0">

        <div className="max-w-4xl mx-auto">

          <div className="flex gap-3 items-end">

            <div className="flex-1 relative">

              <Textarea
                placeholder="Ketik pesan Anda di sini..."
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="
                  min-h-14
                  max-h-50
                  resize-none
                  rounded-3xl
                  bg-muted/50
                  border
                  border-border/50
                  focus-visible:border-primary/50
                  focus-visible:ring-2
                  focus-visible:ring-primary/20
                  px-5
                  py-4
                  text-[15px]
                  leading-relaxed
                  shadow-sm
                  transition-all
                  placeholder:text-muted-foreground/50
                "
              />

            </div>

            <Button
              onClick={() => handleSend()}
              size="icon"
              disabled={isLoading}
              className="
                h-14
                w-14
                rounded-full
                shrink-0
                bg-primary
                hover:bg-primary/90
                shadow-lg
                hover:shadow-xl
                transition-all
                duration-200
                hover:scale-105
                cursor-pointer
              "
            >

              <Send className="h-5 w-5" />

            </Button>

          </div>

        </div>

      </div>

    </div>
  );
}