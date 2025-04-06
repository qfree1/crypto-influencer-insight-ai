
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight, Shield, BrainCircuit } from 'lucide-react';

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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-crypto-blue/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-crypto-purple/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-crypto-cyan/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className={`glass-card p-8 md:p-12 max-w-4xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} animate-glow`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-bounce-slow">
            <BrainCircuit className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-gradient">W3D Analyzer</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            AI-Powered Crypto Influencer Analysis
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button 
              onClick={() => navigate('/analyze')} 
              size="lg"
              className="bg-crypto-gradient text-lg group relative overflow-hidden w-full py-7"
            >
              <span className="relative z-10 flex items-center">
                Connect Wallet
                <Wallet className="ml-2 w-5 h-5" />
              </span>
              <span className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
          </div>
          
          <div className="mt-10 grid grid-cols-3 gap-6 w-full">
            <FeatureIcon 
              icon={<BrainCircuit className="text-crypto-cyan" />}
              label="AI Analysis"
              delay={0}
            />
            <FeatureIcon 
              icon={<Shield className="text-crypto-purple" />}
              label="Rug Protection"
              delay={200}
            />
            <FeatureIcon 
              icon={<ArrowRight className="text-crypto-cyan" />}
              label="Risk Scoring"
              delay={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureIcon = ({ 
  icon, 
  label,
  delay
}: { 
  icon: React.ReactNode; 
  label: string;
  delay: number;
}) => {
  return (
    <div 
      className="flex flex-col items-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-full glass-effect flex items-center justify-center mb-2 animate-wave">
        {icon}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export default LandingPage;
