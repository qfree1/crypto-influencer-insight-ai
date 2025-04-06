
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight, BrainCircuit, Shield, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-brand-magenta/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-brand-purple/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className={`glass-card p-8 md:p-12 max-w-5xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} animate-glow`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Logo and title section */}
          <div className="text-center md:text-left md:w-1/2">
            <div className="flex flex-col items-center md:items-start space-y-6">
              <div className="flex items-center gap-4">
                <img 
                  src="/lovable-uploads/4207036d-b43e-4c52-b710-684edb26b137.png" 
                  alt="Web3D Logo" 
                  className="w-16 h-16 md:w-20 md:h-20 circle-glow animate-pulse-subtle"
                />
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
                  <span className="text-gradient">Web3D</span>
                </h1>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gradient">
                Influencer Analysis
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-md">
                AI-powered analysis to protect you from crypto scams. Verify influencer credibility before trusting their recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button 
                  onClick={() => navigate('/analyze')} 
                  size="lg"
                  className="bg-crypto-gradient text-lg group relative overflow-hidden w-full py-6"
                >
                  <span className="relative z-10 flex items-center">
                    Start Analysis
                    <Wallet className="ml-2 w-5 h-5" />
                  </span>
                  <span className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <FeatureItem icon={<BrainCircuit size={18} />} text="AI Analysis" />
                <FeatureItem icon={<Shield size={18} />} text="Rug Protection" />
                <FeatureItem icon={<BarChart3 size={18} />} text="Risk Scoring" />
              </div>
            </div>
          </div>
          
          {/* Robot Image Section */}
          <div className="md:w-1/2 relative mt-8 md:mt-0">
            <div className="absolute inset-0 bg-crypto-gradient opacity-20 rounded-full blur-2xl"></div>
            <div className="relative animate-float" style={{ animationDelay: '1s' }}>
              <img 
                src="/lovable-uploads/2f8f0648-0e5b-4248-86a7-27b7827c2afb.png" 
                alt="AI Robot Analyst" 
                className="w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-xl font-medium text-center mb-6 text-gradient">Powered by Advanced AI Technology</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BrainCircuit className="text-brand-magenta" />}
              title="AI Analysis"
              description="Our AI analyzes social media activity and blockchain data to detect potential scams and misleading promotions."
            />
            <FeatureCard
              icon={<Shield className="text-brand-purple" />}
              title="Fraud Detection"
              description="Identify rugpulls, pump & dumps, and other deceptive tactics before you invest."
            />
            <FeatureCard
              icon={<BarChart3 className="text-brand-magenta" />}
              title="Risk Scoring"
              description="Get a comprehensive risk score for any crypto influencer based on their past performance."
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-muted-foreground">Web3Decision &copy; 2025</p>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-primary/40 transition-all hover:shadow-lg hover:shadow-brand-primary/10 group">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default LandingPage;
