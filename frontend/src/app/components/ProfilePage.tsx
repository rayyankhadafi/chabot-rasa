import { useState } from 'react';
import { X, User, Mail, Calendar, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import avatar1 from '../../assets/avatars/cat_1.png';
import avatar2 from '../../assets/avatars/cat_2.png';
import avatar3 from '../../assets/avatars/cat_3.png';
import avatar4 from '../../assets/avatars/cat_4.png';
import avatar5 from '../../assets/avatars/cat_5.png';
import avatar6 from '../../assets/avatars/cat_6.png';


interface ProfilePageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
];

export function ProfilePage({ open, onOpenChange, userEmail }: ProfilePageProps) {

  const getRandomAvatar = () => {
    const savedAvatar = localStorage.getItem('selectedAvatar');

    if (savedAvatar) {
      return savedAvatar;
    }

    const randomAvatar =
      avatars[Math.floor(Math.random() * avatars.length)];

    localStorage.setItem('selectedAvatar', randomAvatar);

    return randomAvatar;
  };

  const [selectedAvatar, setSelectedAvatar] = useState(
    getRandomAvatar()
  );

  if (!open) return null;

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getJoinDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 z-50 bg-background/40 backdrop-blur border-b p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Profil Saya</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-5 w-5 cursor-pointer" />
            <span className="sr-only">Tutup</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4 py-4">

          {/* Avatar utama */}
          <Avatar className="w-24 h-24">
            <img
              src={selectedAvatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </Avatar>

          {/* Info user */}
          <div>
            <h3 className="text-2xl font-semibold">
              {userEmail.split('@')[0]}
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              {userEmail}
            </p>
          </div>

          {/* Pilihan avatar */}
          <div className="grid grid-cols-3 gap-4 pt-4">

            {avatars.map((avatar, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedAvatar(avatar);
                  localStorage.setItem('selectedAvatar', avatar);
                }}
                className={`
                  rounded-full
                  overflow-hidden
                  border-2
                  transition-all
                  hover:scale-105
                  ${selectedAvatar === avatar
                    ? 'border-primary'
                    : 'border-transparent'}
                `}
              >
                <img
                  src={avatar}
                  alt={`Avatar ${index}`}
                  className="w-16 h-16 object-cover"
                />
              </button>
            ))}

          </div>

        </div>

          <Separator />

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Informasi Akun</h4>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-md bg-accent/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Nama Pengguna</div>
                  <div className="text-sm font-medium">{userEmail.split('@')[0]}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-md bg-accent/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium">{userEmail}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-md bg-accent/50">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Bergabung Sejak</div>
                  <div className="text-sm font-medium">{getJoinDate()}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* WhatsApp Chatbot */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Chatbot WhatsApp</h4>

            <a
              href="https://wa.me/62881080694481?text=Halo%20saya%20ingin%20menggunakan%20chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-md bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 group-hover:bg-green-600 transition-colors">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Buka di WhatsApp</div>
                <div className="text-sm text-muted-foreground">
                  Gunakan chatbot melalui WhatsApp
                </div>
              </div>
            </a>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button className='cursor-pointer' variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
