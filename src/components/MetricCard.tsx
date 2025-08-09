import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon, 
  description,
  variant = 'default' 
}: MetricCardProps) => {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return 'secondary';
    if (change > 0) return 'default';
    if (change < 0) return 'destructive';
    return 'secondary';
  };

  const cardClassName = variant === 'success' 
    ? 'border-success/20 bg-success/5' 
    : variant === 'warning'
    ? 'border-warning/20 bg-warning/5'
    : variant === 'destructive'
    ? 'border-destructive/20 bg-destructive/5'
    : '';

  return (
    <Card className={`rounded-2xl border-white/10 bg-card/60 backdrop-blur-xl hover:shadow-[0_12px_40px_rgba(155,20,64,0.15)] transition-all ${cardClassName}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xs font-medium tracking-widest uppercase text-muted-foreground/80">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-2 rounded-xl gradient-primary text-primary-foreground/90 shadow-sm">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold tracking-tight text-foreground mb-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground/80 mb-3">
            {description}
          </p>
        )}
        {change !== undefined && (
          <div className="flex items-center justify-between">
            <Badge variant={getTrendColor()} className="text-[10px] px-1.5 py-0.5 rounded-md">
              {getTrendIcon()}
              <span className="ml-1">
                {Math.abs(change)}% {changeLabel || 'vs last session'}
              </span>
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;