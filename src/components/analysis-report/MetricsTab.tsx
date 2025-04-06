
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TwitterMetrics } from '@/types';

interface MetricsTabProps {
  twitterMetrics: TwitterMetrics;
}

const MetricsTab = ({ twitterMetrics }: MetricsTabProps) => {
  return (
    <Card className="crypto-card">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Social Media Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <MetricItem 
                label="Total Followers" 
                value={twitterMetrics.followers.toLocaleString()} 
              />
              <MetricItem 
                label="Real Followers" 
                value={`${twitterMetrics.realFollowerPercentage}%`} 
                description="Estimated percentage of authentic accounts"
              />
              <MetricItem 
                label="Engagement Rate" 
                value={`${twitterMetrics.engagementRate}%`} 
                description="Average engagement per post relative to follower count"
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Follower Authenticity</h4>
              <div className="h-6 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${twitterMetrics.realFollowerPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bot/Inactive</span>
                <span className="text-muted-foreground">Authentic</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Promoted Tokens</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-2 font-medium">Token</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Performance</th>
                </tr>
              </thead>
              <tbody>
                {twitterMetrics.promotedTokens.map((token, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 font-medium">{token.name}</td>
                    <td>
                      <StatusBadge status={token.status} />
                    </td>
                    <td className={`
                      ${token.performancePercentage > 0 ? 'text-green-500' : 'text-red-500'}
                    `}>
                      {token.performancePercentage > 0 ? '+' : ''}
                      {token.performancePercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

const MetricItem = ({ label, value, description }: { label: string, value: string, description?: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
    {description && <p className="text-xs text-muted-foreground">{description}</p>}
  </div>
);

const StatusBadge = ({ status }: { status: 'rugpull' | 'active' | 'declined' }) => {
  const styles = {
    rugpull: 'bg-red-900/30 text-red-500',
    active: 'bg-green-900/30 text-green-500',
    declined: 'bg-yellow-900/30 text-yellow-500',
  };
  
  const labels = {
    rugpull: 'Rug Pull',
    active: 'Active',
    declined: 'Declined',
  };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default MetricsTab;
