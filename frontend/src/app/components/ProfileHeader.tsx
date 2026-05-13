import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Menu } from "lucide-react";
import { Button } from './ui/button';

interface ProfileHeaderProps {
  userEmail: string;
  onLogout: () => void;
  onShowProfile: () => void;
  onShowSettings: () => void;

  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProfileHeader({ userEmail, onLogout, onShowProfile, onShowSettings, sidebarOpen, setSidebarOpen, }: ProfileHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedAvatar = localStorage.getItem('selectedAvatar');

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border/40 bg-background relative">

      <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>

      <div className="relative">
        <button
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-accent transition-all cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
        <Avatar className="w-8 h-8 shadow-sm">
          {selectedAvatar ? (
            <img
              src={selectedAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
              {getUserInitials(userEmail)}
            </AvatarFallback>
          )}
      </Avatar>
      
          <span className="hidden md:inline text-sm text-foreground">{userEmail}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-2.5 font-medium border-b border-border/50 text-sm bg-muted/30">
              Akun Saya
            </div>
            <div className="py-1.5 px-1.5">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  setShowDropdown(false);
                  onShowProfile();
                }}
              >
                Profil
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  setShowDropdown(false);
                  onShowSettings();
                }}
              >
                Pengaturan
              </button>
              <div className="border-t border-border/50 my-1.5 mx-2"></div>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors text-destructive cursor-pointer"
                onClick={() => {
                  setShowDropdown(false);
                  onLogout();
                }}
              >
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}