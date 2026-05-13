import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface LoginProps { 
  onLogin: (email: string) => void; 
  onShowRegister: () => void; 
}

export function Login({ onLogin, onShowRegister, }: LoginProps) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // cegah double click
  if (loading) return;

  setLoading(true);
  setError('');

  if (!email || !password) {
    setError('Email dan password wajib diisi');
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(
      'http://localhost:3000/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    // simpan token
    localStorage.setItem('token', data.token);

    // simpan user
    localStorage.setItem(
      'user',
      JSON.stringify(data.user)
    );

    toast.success('Login berhasil 🎉', {
      description: 'Selamat datang kembali!',
      duration: 2000,
    });

    setTimeout(() => {
      onLogin(email);
    }, 1000);

  } catch (error) {
    setError('Terjadi kesalahan server');
    setLoading(false);
  }
};

   return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl">Masuk ke Chatbot Lab</CardTitle>
          <CardDescription className="text-muted-foreground/70">
            Masukkan email dan password Anda untuk mengakses chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer">
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
            

            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground/70">Belum punya akun? </span>
              <button
                type="button"
                onClick={onShowRegister}
                className="text-primary hover:underline font-medium transition-colors cursor-pointer"
              >
                Daftar di sini
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    
  );
}
