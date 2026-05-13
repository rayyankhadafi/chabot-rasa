import { useState, useEffect } from 'react';

import { Login } from './components/Login';
import { Register } from './components/Register';

import { ChatInterface } from './components/ChatInterface';
import { ChatSidebar } from './components/ChatSidebar';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfilePage } from './components/ProfilePage';
import { SettingsDialog } from './components/SettingsDialog';

import { Toaster } from './components/ui/sonner';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userEmail, setUserEmail] = useState('');

  const [showSettings, setShowSettings] = useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const [showRegister, setShowRegister] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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

const [chats, setChats] = useState<Chat[]>([
  {
    id: '1',

    title: 'Chat Baru',

    timestamp: new Date(),

    messages: []
  }
]);

  const [activeChatId, setActiveChatId] =
    useState('1');

  const activeChat =
    chats.find(
      (chat) => chat.id === activeChatId
    );

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

    // Restore login session
  useEffect(() => {

    const savedUser =
      localStorage.getItem('user');

    if (savedUser) {

      const user =
        JSON.parse(savedUser);

      setUserEmail(user.email);

      setIsLoggedIn(true);

    }

  }, []);

  const handleLogin = (email: string) => {
    setUserEmail(email);

    setIsLoggedIn(true);
  };

  const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    setIsLoggedIn(false);

    setUserEmail('');
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleShowProfile = () => {
    setShowProfile(true);
  };

  // LOGIN / REGISTER PAGE
  if (!isLoggedIn) {

    // REGISTER PAGE
    if (showRegister) {
      return (
        <Register
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }

    // LOGIN PAGE
    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  // CHATBOT PAGE
  return (
    <div className="h-screen flex bg-background overflow-hidden">

      <ChatSidebar
        chatHistory={chats}
        setChatHistory={setChats}
        activeChat={activeChatId}
        setActiveChat={setActiveChatId}
        userEmail={userEmail}
        onLogout={handleLogout}
        onShowSettings={handleShowSettings}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">

        <ProfileHeader
          userEmail={userEmail}
          onLogout={handleLogout}
          onShowProfile={handleShowProfile}
          onShowSettings={handleShowSettings}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 overflow-hidden min-h-0">
          <ChatInterface
            messages={activeChat?.messages || []}
            setChats={setChats}
            activeChatId={activeChatId}
          />
        </div>

          <footer className="text-center text-xs text-muted-foreground py-3">
            © 2026 Chatbot Lab Informatika UAD • Developed by Rayyan
          </footer>

      </div>

      <ProfilePage
        open={showProfile}
        onOpenChange={setShowProfile}
        userEmail={userEmail}
      />

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />

      <Toaster />

    </div>
  );
}
