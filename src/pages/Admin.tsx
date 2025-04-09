
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  LogOut,
  UserCheck,
  Database,
  ListFilter,
  Trash2,
  Search
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { InfluencerData, RiskReport } from '@/types';
import { authenticateAdmin, getAllInfluencers, getAllReports, deleteInfluencer, deleteReport } from '@/services/databaseService';

// Admin login form
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

// Admin dashboard component
const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [influencers, setInfluencers] = useState<InfluencerData[]>([]);
  const [reports, setReports] = useState<RiskReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('influencers');

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setInfluencers(getAllInfluencers());
    setReports(getAllReports());
  };

  // Handle influencer deletion
  const handleDeleteInfluencer = (handle: string) => {
    if (window.confirm(`Are you sure you want to delete influencer @${handle}?`)) {
      if (deleteInfluencer(handle)) {
        toast({
          title: "Influencer Deleted",
          description: `@${handle} has been removed from the database`,
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete influencer",
          variant: "destructive",
        });
      }
    }
  };

  // Handle report deletion
  const handleDeleteReport = (id: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      if (deleteReport(id)) {
        toast({
          title: "Report Deleted",
          description: "Report has been removed from the database",
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete report",
          variant: "destructive",
        });
      }
    }
  };

  // Filter function for influencers
  const filteredInfluencers = influencers.filter(influencer => 
    influencer.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter function for reports
  const filteredReports = reports.filter(report => 
    report.influencerData.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.influencerData.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get risk level badge
  const getRiskBadge = (score: number) => {
    if (score < 30) {
      return <Badge className="bg-green-500">Low Risk</Badge>;
    } else if (score < 70) {
      return <Badge className="bg-yellow-500">Medium Risk</Badge>;
    } else {
      return <Badge className="bg-red-500">High Risk</Badge>;
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-gradient">Admin Panel</h1>
        </div>
        
        <Button onClick={onLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search influencers or reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Database stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border-primary/30">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Database Stats</h2>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Influencers</p>
              <p className="text-2xl font-bold">{influencers.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-primary/30">
          <div className="flex items-center space-x-2">
            <ListFilter className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Risk Distribution</h2>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div>
              <Badge className="bg-green-500">Low Risk</Badge>
              <p className="text-2xl font-bold">{reports.filter(r => r.riskScore < 30).length}</p>
            </div>
            <div>
              <Badge className="bg-yellow-500">Medium Risk</Badge>
              <p className="text-2xl font-bold">{reports.filter(r => r.riskScore >= 30 && r.riskScore < 70).length}</p>
            </div>
            <div>
              <Badge className="bg-red-500">High Risk</Badge>
              <p className="text-2xl font-bold">{reports.filter(r => r.riskScore >= 70).length}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="influencers" className="space-y-4">
          <Card className="border-primary/30">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Handle</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInfluencers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No influencers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInfluencers.map((influencer) => {
                    const reportCount = reports.filter(
                      r => r.influencerData.handle.toLowerCase() === influencer.handle.toLowerCase()
                    ).length;
                    
                    return (
                      <TableRow key={influencer.handle}>
                        <TableCell className="font-medium">@{influencer.handle}</TableCell>
                        <TableCell>{influencer.name}</TableCell>
                        <TableCell>{reportCount}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteInfluencer(influencer.handle)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card className="border-primary/30">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Influencer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">@{report.influencerData.handle}</TableCell>
                      <TableCell>{formatDate(report.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{report.riskScore}</span>
                          {getRiskBadge(report.riskScore)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteReport(report.id || '')}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main Admin page component
const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
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
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Admin;
