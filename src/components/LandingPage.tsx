
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Rocket, 
  Shield, 
  LineChart, 
  ChevronRight, 
  Brain,
  BrainCircuit,
  BarChart3,
  Wallet,
  AlertTriangle
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center">
        {/* Background effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-crypto-gradient opacity-20 rounded-full filter blur-3xl animate-pulse-subtle"></div>
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-12 z-10 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="inline-block">
                <div className="bg-muted px-4 py-1 rounded-full text-sm flex items-center space-x-2 mb-4 animate-pulse-subtle">
                  <span className="bg-green-500 h-2 w-2 rounded-full"></span>
                  <span>Web3 Powered Analysis</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient leading-tight">
                AI Crypto Influencer Analysis
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Verify crypto influencers before you trust them. Our AI-powered analysis checks their past performance, blockchain behavior, and credibility score.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={() => navigate('/analyze')} 
                  className="bg-crypto-gradient hover:opacity-90 px-6 py-6 h-auto text-lg group"
                >
                  Start Analyzing
                  <ChevronRight className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="px-6 py-6 h-auto text-lg border-border hover:bg-secondary/50"
                  onClick={() => {
                    const howItWorksSection = document.getElementById('how-it-works');
                    howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className={`flex justify-center transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-crypto-gradient rounded-xl opacity-20 blur-lg animate-pulse-subtle"></div>
                <Card className="crypto-card relative border-border/60 overflow-hidden backdrop-blur-sm p-4 md:p-8 max-w-md">
                  <div className="absolute inset-0 opacity-10 z-0">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-crypto-gradient rounded-full filter blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full filter blur-xl"></div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 animate-float">
                      <BrainCircuit className="text-primary w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-center text-gradient">AI Risk Analysis</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <BarChart3 className="text-primary/80" />
                        <div className="text-sm">Token history tracked</div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <AlertTriangle className="text-amber-500/80" />
                        <div className="text-sm">Rugpull detection</div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Wallet className="text-green-500/80" />
                        <div className="text-sm">Wallet analysis</div>
                      </div>
                    </div>
                    
                    <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-crypto-cyan to-crypto-magenta animate-pulse-subtle w-2/3"></div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground text-center">
                      Connect wallet to unlock full AI analysis
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-muted-foreground text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-muted rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="how-it-works" className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines blockchain data with AI analysis to provide you with accurate influencer risk profiles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-crypto-cyan/10 to-crypto-magenta/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Card className="h-full transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg overflow-hidden group-hover:border-crypto-cyan/50">
                  <div className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground flex-grow">{feature.description}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-crypto-magenta rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-crypto-cyan rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/60">
                <div className="p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-gradient">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-crypto-gradient relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-px bg-white"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to analyze influencers?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Connect your wallet to start analyzing crypto influencers. Each wallet gets one free analysis.
          </p>
          <Button 
            onClick={() => navigate('/analyze')} 
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 h-auto text-lg"
          >
            Start Now
          </Button>
        </div>
      </div>
    </div>
  );
};

// Data
const features = [
  {
    title: 'Connect Wallet',
    description: 'Connect your Web3 wallet to verify token ownership and access your free report or unlock unlimited access.',
    icon: <Wallet className="text-crypto-cyan w-6 h-6" />
  },
  {
    title: 'AI Analysis',
    description: 'Our advanced AI analyzes social media activity, promoted tokens, and blockchain behavior to generate a comprehensive risk report.',
    icon: <BrainCircuit className="text-crypto-magenta w-6 h-6" />
  },
  {
    title: 'Get Insights',
    description: 'Receive a detailed risk score and analysis to help you make informed decisions about which influencers to trust.',
    icon: <LineChart className="text-crypto-cyan w-6 h-6" />
  }
];

const stats = [
  { value: '99%', label: 'Rugpull Detection' },
  { value: '10K+', label: 'Influencers Analyzed' },
  { value: '5M+', label: 'Tokens Tracked' },
  { value: '250K+', label: 'Users Protected' }
];

export default LandingPage;
