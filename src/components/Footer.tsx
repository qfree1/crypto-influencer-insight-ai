
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 bg-background/30 backdrop-blur-sm border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and copyright */}
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/c1b8b8f0-c5bf-489f-a603-c8465207d3dd.png" 
              alt="Web3D Logo" 
              className="w-6 h-6 circle-glow" 
            />
            <span className="text-sm text-muted-foreground">
              © {currentYear} Web3D
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
