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
    <Card className={`hover:shadow-lg transition-shadow ${cardClassName}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">
            {description}
          </p>
        )}
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            <Badge variant={getTrendColor()} className="text-xs px-1 py-0">
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