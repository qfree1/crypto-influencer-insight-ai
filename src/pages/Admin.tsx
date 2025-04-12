
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, LogOut, UserCheck, Settings, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { authenticateAdmin } from '@/services/databaseService';

// Configuration storage key
const API_CONFIG_KEY = 'api_configuration';

// Default API configuration
const DEFAULT_API_CONFIG = {
  apiEndpoint: 'https://api.example.com/influencer-analysis',
  apiKey: '',
  timeout: 30000,
};

const AdminLogin = ({ onLogin }: { onLogin: (success: boolean) => void }) => {
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

const ApiConfigPanel = ({ onLogout }: { onLogout: () => void }) => {
  const [apiConfig, setApiConfig] = useState(DEFAULT_API_CONFIG);
  
  useEffect(() => {
    try {
      const savedApiConfig = localStorage.getItem(API_CONFIG_KEY);
      if (savedApiConfig) {
        setApiConfig(JSON.parse(savedApiConfig));
      }
    } catch (error) {
      console.error('Error loading API configuration:', error);
    }
  }, []);

  const saveApiConfig = () => {
    try {
      localStorage.setItem(API_CONFIG_KEY, JSON.stringify(apiConfig));
      toast({
        title: "API Configuration Saved",
        description: "Your API settings have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
            alt="Web3D Logo" 
            className="w-6 h-6 mr-2" 
          />
          <h1 className="text-2xl font-bold text-gradient">API Configuration</h1>
        </div>
        
        <Button onClick={onLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <Card className="p-6 border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">External API Settings</h2>
          </div>
          <Button onClick={saveApiConfig} className="bg-crypto-gradient">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">API Endpoint</label>
            <Input 
              value={apiConfig.apiEndpoint} 
              onChange={(e) => setApiConfig({...apiConfig, apiEndpoint: e.target.value})}
              placeholder="https://api.example.com/endpoint"
            />
            <p className="text-sm text-muted-foreground mt-1">
              The URL of the influencer analysis API
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">API Key</label>
            <Input 
              type="password"
              value={apiConfig.apiKey} 
              onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
              placeholder="Enter your API key"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Authentication key for accessing the API
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Timeout (ms)</label>
            <Input 
              type="number"
              value={apiConfig.timeout.toString()} 
              onChange={(e) => setApiConfig({...apiConfig, timeout: parseInt(e.target.value) || 30000})}
            />
            <p className="text-sm text-muted-foreground mt-1">
              How long to wait for API response before timing out
            </p>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md mt-4">
            <h3 className="font-medium mb-2 flex items-center">
              <img 
                src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
                alt="Web3D Logo" 
                className="w-5 h-5 mr-2" 
              />
              API Integration Guide
            </h3>
            <p className="text-sm text-muted-foreground">
              To use real data for influencer analysis, you need to connect to external APIs that provide:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
              <li>Social media metrics (followers, engagement rates)</li>
              <li>Blockchain transaction data (wallet addresses, token movements)</li>
              <li>Risk assessment algorithms</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Recommended API providers: Moralis, Alchemy, Etherscan, Twitter API, or specialized crypto influencer
              analysis platforms.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin panel",
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? (
        <ApiConfigPanel onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Admin;
