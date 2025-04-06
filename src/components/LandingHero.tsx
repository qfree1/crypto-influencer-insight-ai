
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, BarChart2, Zap, TrendingUp } from 'lucide-react';

const LandingHero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-background py-16 sm:py-24">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-crypto-blue/5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-crypto-purple/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-crypto-cyan/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero content */}
          <div className={`max-w-2xl transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="block text-gradient">AI-Powered</span>
              <span className="block">Crypto Influencer Risk Analysis</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Make informed decisions with real-time blockchain intelligence and social media metrics. Analyze any crypto influencer's track record before trusting their recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/analyze')} 
                size="lg"
                className="bg-crypto-gradient text-lg group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Analyzing
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/30 text-lg hover:bg-primary/5"
                onClick={() => window.open('https://docs.web3d.ai', '_blank')}
              >
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Animated feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-lg">
            <FeatureCard 
              icon={<Shield />}
              title="Rug Pull Detection"
              description="Identify potential scams before investing"
              delay={0}
              isVisible={isVisible}
            />
            <FeatureCard 
              icon={<BarChart2 />}
              title="Engagement Analysis"
              description="Real vs fake follower metrics"
              delay={200}
              isVisible={isVisible}
            />
            <FeatureCard 
              icon={<Zap />}
              title="AI Risk Scoring"
              description="Get instant risk assessment"
              delay={400}
              isVisible={isVisible}
            />
            <FeatureCard 
              icon={<TrendingUp />}
              title="Token Performance"
              description="Track promoted token history"
              delay={600}
              isVisible={isVisible}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  delay,
  isVisible
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
  isVisible: boolean;
}) => {
  return (
    <div 
      className={`crypto-card p-5 flex flex-col transition-all duration-700 delay-[${delay}ms] transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default LandingHero;
