'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Issue, IssueStatus, UrgencyLevel } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Bot, CheckCircle2, Clock, Info, ShieldAlert, TriangleAlert, Wrench } from 'lucide-react';

type IssueCardProps = {
  issue: Issue;
  onStatusChange: (id: string, status: IssueStatus) => void;
};

const statusConfig: { [key in IssueStatus]: { variant: 'default' | 'secondary' | 'outline' | 'destructive' | null | undefined, className?: string, icon: React.ReactNode } } = {
  Pending: {
    variant: 'secondary',
    icon: <Clock className="h-3.5 w-3.5" />,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200/80 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800/80',
  },
  'In Progress': {
    variant: 'secondary',
    icon: <Wrench className="h-3.5 w-3.5" />,
    className: 'bg-blue-100 text-blue-800 border-blue-200/80 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800/80',
  },
  Resolved: {
    variant: 'secondary',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: 'bg-green-100 text-green-800 border-green-200/80 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800/80',
  },
};

const urgencyConfig: { [key: string]: { icon: React.ReactNode; className: string } } = {
  Low: {
    icon: <Info className="h-4 w-4" />,
    className: 'text-blue-500 dark:text-blue-400',
  },
  Medium: {
    icon: <TriangleAlert className="h-4 w-4" />,
    className: 'text-yellow-600 dark:text-yellow-400',
  },
  High: {
    icon: <ShieldAlert className="h-4 w-4" />,
    className: 'text-orange-600 dark:text-orange-400',
  },
  Critical: {
    icon: <ShieldAlert className="h-4 w-4" />,
    className: 'text-red-600 dark:text-red-500',
  },
};


export function IssueCard({ issue, onStatusChange }: IssueCardProps) {
    const currentStatusConfig = statusConfig[issue.status];
    const currentUrgencyConfig = urgencyConfig[issue.urgencyLevel] || { icon: <Info />, className: 'text-gray-500'};

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl bg-card">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-lg font-medium leading-tight font-headline">Issue Report</CardTitle>
            <Badge
                variant={currentStatusConfig.variant}
                className={cn('shrink-0 flex items-center gap-1.5', currentStatusConfig.className)}
            >
                {currentStatusConfig.icon}
                <span className="font-semibold">{issue.status}</span>
            </Badge>
        </div>
        <CardDescription>
          Reported {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-foreground/80">{issue.description}</p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ai-analysis">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>AI Analysis</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 text-sm">
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-2 text-foreground/90">Urgency Level</h4>
                <div className={cn("flex items-center gap-2 font-bold", currentUrgencyConfig.className)}>
                  {currentUrgencyConfig.icon}
                  <span>{issue.urgencyLevel}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1 text-foreground/90">Suggested Solutions</h4>
                <p className="text-foreground/70">{issue.suggestedSolutions}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      {issue.status !== 'Resolved' && (
        <>
            <Separator />
            <CardFooter className="flex gap-2 pt-6">
                {issue.status === 'Pending' && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange(issue.id, 'In Progress')}
                    className="w-full"
                >
                    <Wrench className="mr-2 h-4 w-4" />
                    Mark as In Progress
                </Button>
                )}
                {issue.status === 'In Progress' && (
                <Button
                    size="sm"
                    onClick={() => onStatusChange(issue.id, 'Resolved')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Resolved
                </Button>
                )}
            </CardFooter>
        </>
      )}
    </Card>
  );
}
