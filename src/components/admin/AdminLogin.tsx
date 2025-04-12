
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, UserCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { authenticateAdmin } from '@/services/databaseService';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authenticateAdmin(username, password)) {
      localStorage.setItem('admin_authenticated', 'true');
      onLogin(true);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });
    } else {
      setError('Invalid username or password');
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md p-6 space-y-6 border-primary/30">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-gradient">Admin Login</h1>
        </div>
        
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This is a protected area. Only administrators can access this page.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter admin username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter admin password"
              required
            />
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          
          <Button type="submit" className="w-full bg-crypto-gradient">
            <UserCheck className="w-4 h-4 mr-2" />
            Login
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Default credentials:</p>
          <p>Username: admin / Password: 123456</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
