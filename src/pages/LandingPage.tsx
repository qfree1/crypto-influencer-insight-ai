
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Twitter, Dices, MessagesSquare, BadgeCheck, ShieldAlert } from 'lucide-react';
import LandingHero from '@/components/LandingHero';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/30 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-crypto-gradient flex items-center justify-center">
              <span className="text-white font-bold">W3D</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">Web3D Influencer Analyzer</h1>
              <p className="text-xs text-muted-foreground">Blockchain-powered risk assessment</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hidden md:flex"
              onClick={() => window.open('https://docs.web3d.ai', '_blank')}
            >
              Documentation
            </Button>
            <Button 
              variant="ghost" 
              className="hidden md:flex"
              onClick={() => window.open('https://github.com/web3d', '_blank')}
            >
              GitHub
            </Button>
            <Button 
              className="bg-crypto-gradient hover:opacity-90"
              onClick={() => navigate('/analyze')}
            >
              Launch App
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <LandingHero />
        
        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform combines blockchain analytics with AI to provide comprehensive risk assessment of crypto influencers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Twitter className="text-crypto-cyan" />}
                title="Social Analysis"
                description="We analyze social media metrics including real follower count, engagement rates, and content patterns"
              />
              
              <FeatureCard 
                icon={<Shield className="text-crypto-purple" />}
                title="Blockchain Verification"
                description="Cross-reference on-chain activity with promoted tokens to detect suspicious patterns"
              />
              
              <FeatureCard 
                icon={<Dices className="text-crypto-blue" />}
                title="AI Risk Assessment"
                description="Our AI synthesizes data points to generate a comprehensive risk score from 0-100"
              />
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Trusted By Traders</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of crypto traders who use our platform to make informed decisions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                quote="This tool saved me from investing in multiple rug pulls. The risk assessment is incredibly accurate."
                author="Alex K."
                role="DeFi Investor"
              />
              
              <TestimonialCard 
                quote="I use Web3D Analyzer before following any new crypto influencer. It's become an essential part of my DYOR process."
                author="Sarah M."
                role="Crypto Trader"
              />
              
              <TestimonialCard 
                quote="The blockchain verification feature is a game-changer. It shows you what influencers actually do with their wallets."
                author="Mike T."
                role="Blockchain Developer"
              />
            </div>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Choose Web3D Analyzer?</h2>
              </div>
              
              <div className="space-y-6">
                <BenefitItem 
                  icon={<BadgeCheck />}
                  title="Transparency First"
                  description="Our analysis methodology is fully transparent, showing exactly how we assess risk"
                />
                
                <BenefitItem 
                  icon={<ShieldAlert />}
                  title="Rug Pull Protection"
                  description="Identify high-risk influencers before they can promote scam projects to you"
                />
                
                <BenefitItem 
                  icon={<MessagesSquare />}
                  title="Community Verification"
                  description="Reports are enhanced with community input to provide the most accurate assessment"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-crypto-gradient opacity-10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to analyze crypto influencers?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Start using our platform today and make informed decisions about who to trust in the crypto space.
              </p>
              
              <Button 
                onClick={() => navigate('/analyze')} 
                size="lg"
                className="bg-crypto-gradient text-lg"
              >
                Launch App
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Web3D Influencer Analyzer &copy; 2025 - Blockchain-powered analysis of crypto influencer credibility</p>
          <p className="mt-1">This is a demo application. Always do your own research (DYOR) before making investment decisions.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="crypto-card p-6 flex flex-col items-center text-center hover-scale">
      <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role }: { quote: string; author: string; role: string }) => {
  return (
    <div className="crypto-card p-6 flex flex-col">
      <p className="italic text-muted-foreground mb-4">&ldquo;{quote}&rdquo;</p>
      <div className="mt-auto">
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

const BenefitItem = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="flex items-start p-4 rounded-lg bg-background/50 hover-scale">
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default LandingPage;
