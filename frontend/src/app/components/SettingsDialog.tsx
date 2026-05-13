import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4 cursor-pointer" />
          <span className="sr-only">Close</span>
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-semibold">Pengaturan</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sesuaikan pengaturan chatbot sesuai preferensi Anda.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Tampilan</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm">
                {isDarkMode ? 'Mode Gelap' : 'Mode Terang'}
              </Label>
              <Switch 
                id="dark-mode" 
                checked={isDarkMode}
                onCheckedChange={handleDarkModeToggle}
                className='cursor-pointer'
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Bahasa</h4>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm">
                Bahasa Interface
              </Label>
              <div className="flex items-center h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                Bahasa Indonesia
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className='cursor-pointer' onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}