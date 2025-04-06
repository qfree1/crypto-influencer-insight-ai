
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-2 bg-background/30 backdrop-blur-sm border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo and copyright */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
              <span className="text-xs font-bold text-primary">W3D</span>
            </div>
            <span className="text-sm text-muted-foreground">
              © {currentYear} Web3D
            </span>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigate("/analyze")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Analyze
            </button>
            <a 
              href="https://twitter.com/web3d"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Twitter
            </a>
            <a 
              href="https://t.me/web3dchannel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Telegram
            </a>
          </div>
          
          {/* Token info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-5 h-5 bg-primary/20 rounded-full">
              <span className="text-[10px] font-bold text-primary">W3D</span>
            </div>
            <a 
              href="https://bscscan.com/token/0x7ed9054c48088bb8cfc5c5fbc32775b9455a13f7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              BSC: 0x7ed9...13f7
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
