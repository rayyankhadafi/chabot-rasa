import {
  Plus,
  Settings,
  LogOut,
  MessageSquare,
  MoreVertical,
  Trash2,
  Pencil
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

import {
  useState,
  useEffect,
  useRef
} from 'react';

import logo from '../../assets/logo/logo.png';

// =========================
// INTERFACES
// =========================

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

interface ChatSidebarProps {
  userEmail: string;

  onLogout: () => void;

  onShowSettings: () => void;

  chatHistory: ChatHistory[];

  setChatHistory: React.Dispatch<
    React.SetStateAction<ChatHistory[]>
  >;

  activeChat: string;

  setActiveChat: (id: string) => void;

  sidebarOpen: boolean;

  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

// =========================
// COMPONENT
// =========================

export function ChatSidebar({
  userEmail,
  onLogout,
  onShowSettings,

  chatHistory,
  setChatHistory,

  activeChat,
  setActiveChat,

  sidebarOpen,
  setSidebarOpen,

}: ChatSidebarProps) {

  const [showLogoutConfirm, setShowLogoutConfirm] =
  useState(false);

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const [editingChatId, setEditingChatId] =
    useState<string | null>(null);

  const [editedTitle, setEditedTitle] =
    useState('');

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  // =========================
  // CLOSE MENU WHEN CLICK OUTSIDE
  // =========================

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };

  }, []);

  // =========================
  // NEW CHAT
  // =========================

  const handleNewChat = () => {

    const newChat: ChatHistory = {

      id: crypto.randomUUID(),

      title: `Chat ${chatHistory.length + 1}`,

      timestamp: new Date(),

      messages: []
    };

    setChatHistory((prev) => [
      newChat,
      ...prev,
    ]);

    setActiveChat(newChat.id);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =========================
  // DELETE CHAT
  // =========================

  const handleDeleteChat = (
    chatId: string
  ) => {

    const updatedChats =
      chatHistory.filter((chat) => {
        return chat.id !== chatId;
      });

    setChatHistory(updatedChats);

    // pindah active chat
    if (activeChat === chatId) {

      if (updatedChats.length > 0) {

        setActiveChat(
          updatedChats[0].id
        );

      }
    }

    setOpenMenuId(null);
  };

  // =========================
  // RENAME CHAT
  // =========================

  const handleRenameChat = (
    chatId: string
  ) => {

    if (!editedTitle.trim()) return;

    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title: editedTitle
            }
          : chat
      )
    );

    setEditingChatId(null);
  };

  // =========================
  // UI
  // =========================

  return (

    <div
      className={`fixed md:relative z-50 top-0 left-0 w-[95vw] max-w-60 bg-sidebar border-r border-sidebar-border h-dvh shrink-0 flex flex-col 
        overflow-hidden min-h-0 shadow-sm transition-transform duration-300
        ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }
      `}
    >

      {/* =========================
          HEADER
      ========================= */}

      <div className="px pt-3 pb-3 shrink-0">

        <div className="flex flex-col items-start">

          <img src={logo} alt="Logo" className="h-12 w-auto object-contain"/>

        </div>

      </div>

      {/* =========================
          NEW CHAT BUTTON
      ========================= */}

      <div className="px-3 pb-4 shrink-0">

        <Button
          onClick={handleNewChat}
          className="
            w-full
            justify-start
            gap-3
            h-10
            border
            border-sidebar-border
            bg-transparent
            hover:bg-sidebar-accent
            text-sidebar-foreground
            font-normal
            rounded-xl
            shadow-sm
            hover:shadow
            transition-all
            cursor-pointer
          "
          variant="ghost"
        >

          <Plus className="h-4 w-4" />

          <span className="text-sm">
            Chat
          </span>

        </Button>

      </div>

      {/* =========================
          CHAT HISTORY
      ========================= */}

      <ScrollArea className="flex-1 min-h-0 px-3">

        <div className="pb-3">

          {/* TITLE */}
          <div className="px-3 pb-2.5">

            <h2 className="text-[11px] font-medium text-sidebar-foreground/30 uppercase tracking-wider">
              Riwayat
            </h2>

          </div>

          {/* CHAT LIST */}
          <div className="space-y-1">

            {chatHistory.map((chat) => (
              
              
              <div
                key={chat.id}
                onClick={() =>
                  setActiveChat(chat.id)
                }
                className={`
                  w-full
                  max-w-full
                  overflow-hidden
                  text-left
                  px-3
                  py-2.5
                  rounded-xl
                  text-xs
                  transition-all
                  duration-200
                  group
                  cursor-pointer
                  ${
                    activeChat === chat.id
                      ? 'bg-sidebar-accent text-sidebar-foreground'
                      : 'bg-transparent text-sidebar-foreground/55 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                  }
                `}
              >

                <div className="flex items-center justify-between gap-2 min-w-0">

                  {/* LEFT */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">

                    <MessageSquare
                      className={`
                        h-3.5
                        w-3.5
                        shrink-0
                        transition-opacity
                        ${
                          activeChat === chat.id
                            ? 'opacity-70'
                            : 'opacity-30 group-hover:opacity-50'
                        }
                      `}
                    />

                    {editingChatId === chat.id ? (

                      <input
                        autoFocus
                        value={editedTitle}
                        onChange={(e) =>
                          setEditedTitle(e.target.value)
                        }
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        onKeyDown={(e) => {

                          if (e.key === 'Enter') {
                            handleRenameChat(chat.id);
                          }

                          if (e.key === 'Escape') {
                            setEditingChatId(null);
                          }

                        }}
                        onBlur={() =>
                          handleRenameChat(chat.id)
                        }
                        className="
                          flex-1
                          min-w-0
                          bg-transparent
                          outline-none
                          text-sidebar-foreground
                          text-xs
                        "
                      />

                    ) : (

                      <div className="flex-1 min-w-0 overflow-hidden">

                        <span
                          title={chat.title}
                          className="
                            block
                            w-full
                            truncate
                            text-left
                          "
                        >
                          {chat.title}
                        </span>

                      </div>

                    )}

                  </div>
                  {/* MENU */}
                  <div
                    className="relative shrink-0 ml-1"
                    >

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === chat.id
                            ? null
                            : chat.id
                        );
                      }}
                      className={`
                        transition-all
                        duration-200
                        p-1
                        rounded-md
                        hover:bg-sidebar-accent
                        cursor-pointer
                        ${
                          activeChat === chat.id
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }
                      `}
                    >

                      <MoreVertical className="h-3.5 w-3.5" />

                    </button>

                    {/* DROPDOWN */}
                    {openMenuId === chat.id && (

                      <div 
                        ref={menuRef}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                      className="
                        absolute
                        right-0
                        top-7
                        z-50
                        w-40
                        rounded-xl
                        border
                        border-sidebar-border
                        bg-sidebar
                        shadow-xl
                        p-1
                      ">

                        {/* RENAME */}
                        <button
                          onClick={(e) => {

                            e.stopPropagation();

                            setEditingChatId(chat.id);

                            setEditedTitle(chat.title);

                            setOpenMenuId(null);
                          }}
                          className="
                            w-full
                            flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            text-xs
                            rounded-lg
                            hover:bg-sidebar-accent
                            transition-colors
                            cursor-pointer
                          "
                        >

                          <Pencil className="h-3.5 w-3.5" />

                          Ganti Nama

                        </button>

                        {/* DELETE */}
                        <button
                          onClick={(e) => {

                            e.stopPropagation();

                            handleDeleteChat(chat.id);
                          }}
                          className="
                            w-full
                            flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            text-xs
                            rounded-lg
                            hover:bg-red-500/10
                            hover:text-red-500
                            transition-colors
                            cursor-pointer
                          "
                        >

                          <Trash2 className="h-3.5 w-3.5" />

                          Hapus Chat

                        </button>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </ScrollArea>

      {/* =========================
          FOOTER
      ========================= */}

      <div className="p-3 space-y-1 shrink-0 border-t border-sidebar-border">

        <Button
          variant="ghost"
          className="
            w-full
            justify-start
            h-9
            text-[13px]
            text-sidebar-foreground/50
            hover:bg-sidebar-accent
            hover:text-sidebar-foreground
            font-normal
            rounded-xl
            transition-all
            cursor-pointer
          "
          onClick={onShowSettings}
        >

          <Settings className="mr-2.5 h-3.5 w-3.5" />

          Pengaturan

        </Button>

        <Button
          variant="ghost"
          className="
            w-full
            justify-start
            h-9
            text-[13px]
            text-sidebar-foreground/50
            hover:bg-sidebar-accent
            hover:text-sidebar-foreground
            font-normal
            rounded-xl
            transition-all
            cursor-pointer
          "
          onClick={() => setShowLogoutConfirm(true)}
        >

          <LogOut className="mr-2.5 h-3.5 w-3.5" />

          Keluar

        </Button>

      </div>
        <Dialog
          open={showLogoutConfirm}
          onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-md">

          <DialogHeader>
            <DialogTitle>
              Konfirmasi Logout
            </DialogTitle>

            <DialogDescription>
              Apakah Anda yakin ingin keluar?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">

            <Button
              variant="outline" className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() =>
                setShowLogoutConfirm(false)
              }
            >
              Batal
            </Button>

            <Button
              variant="destructive" className="cursor-pointer hover:opacity-90 transition-all"
              onClick={() => {
                setShowLogoutConfirm(false);
                onLogout();
              }}
            >
              Keluar
            </Button>

          </div>

      </DialogContent>
    </Dialog>
    </div>
  );
}