import { Avatar, AvatarFallback } from './ui/avatar';
import botAvatar from '../../assets/avatars/uad_bot.png';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  const selectedAvatar = localStorage.getItem('selectedAvatar');
  return (
    <div className={`flex gap-4 py-5 px-6 ${isUser ? 'flex-row-reverse' : ''} hover:bg-accent/20 transition-colors group`}>
      <Avatar className="w-9 h-9 shrink-0 shadow-sm">
        {isUser ? (
          selectedAvatar ? (
            <img
              src={selectedAvatar}
              alt="User Avatar"
              className="w-full h-full object-cover"/>
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              U
            </AvatarFallback>
          )
        ) : (
            <img
              src={botAvatar}
              alt="AI Bot"
              className="w-full h-full object-cover"/>
        )}
      </Avatar>
      <div className={`flex flex-col gap-2 ${isUser ? 'max-w-[75%]' : 'max-w-[85%]'} ${isUser ? 'items-end' : ''}`}>
        <div className={`rounded-3xl px-5 py-3.5 shadow-sm ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/60 border border-border/30'
        }`}>
          <p className="text-[13px] leading-[1.6] whitespace-pre-wrap">{message}</p>
        </div>
        <span className="text-[13px] text-muted-foreground/50 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {timestamp.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}