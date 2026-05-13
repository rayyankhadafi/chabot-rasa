import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RegisterProps {
  onBackToLogin: () => void;
}

export function Register({ onBackToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Password tidak sama');
      return;
    }
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(
        '${import.meta.env.VITE_AUTH_URL}/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
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

    toast.success('Pendaftaran berhasil 🎉', {
      description: 'Silakan login menggunakan akun Anda.',
      duration: 2500,
    });

    setTimeout(() => {
      onBackToLogin();
    }, 1200);

    } catch (error) {
    setError('Terjadi kesalahan server');
    setLoading(false);
    }

    };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
          <CardDescription className="text-muted-foreground/70">
            Buat akun baru untuk mengakses chatbot
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
              <Label htmlFor="name" className="text-sm font-medium">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

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
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Konfirmasi Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Masukkan password lagi"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                className="h-11 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer">
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </Button>

            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground/70">
                Sudah punya akun?{" "}
              </span>
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-primary hover:underline font-medium transition-colors cursor-pointer"
              >
                Masuk di sini
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
