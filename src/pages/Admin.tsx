
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import AdminLogin from '@/components/admin/AdminLogin';
import ApiConfigPanel from '@/components/admin/api-config';

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
