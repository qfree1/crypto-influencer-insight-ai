
import { useEffect, useState } from 'react';

interface RiskScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const RiskScore = ({ score, size = 'md', showLabel = true }: RiskScoreProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Normalize score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Determine risk level and colors
  const getRiskLevel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };
  
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getProgressColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Determine size classes
  const sizeClasses = {
    sm: {
      container: 'w-10 h-10', // Slightly smaller to prevent overflow
      text: 'text-xs font-bold',
      label: 'text-xs',
    },
    md: {
      container: 'w-32 h-32',
      text: 'text-3xl',
      label: 'text-sm',
    },
    lg: {
      container: 'w-40 h-40',
      text: 'text-4xl',
      label: 'text-base',
    },
  };

  // Animate the score on mount
  useEffect(() => {
    const duration = 1500; // Animation duration in ms
    const interval = 20; // Update interval in ms
    const steps = duration / interval;
    const increment = normalizedScore / steps;
    
    let current = 0;
    let timer: number | null = null;
    
    const animate = () => {
      current += increment;
      if (current >= normalizedScore) {
        setAnimatedScore(normalizedScore);
        if (timer) clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    };
    
    timer = window.setInterval(animate, interval);
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [normalizedScore]);

  // Calculate stroke dash offset for circle animation
  const radius = size === 'sm' ? 35 : 40; // Adjust radius for small size
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={`relative ${sizeClasses[size].container} mx-auto overflow-visible`}>
      {/* Background circle */}
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />
        {/* Foreground circle with animation */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className={getProgressColor(normalizedScore)}
          style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
        />
      </svg>
      
      {/* Score and label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${sizeClasses[size].text} ${getRiskColor(normalizedScore)}`}>
          {animatedScore}
        </span>
        {showLabel && size !== 'sm' && (
          <span className={`${sizeClasses[size].label} text-muted-foreground`}>
            {getRiskLevel(normalizedScore)}
          </span>
        )}
      </div>
    </div>
  );
};

export default RiskScore;
