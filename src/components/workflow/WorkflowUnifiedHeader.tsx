import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart4, 
  AlertCircle, 
  RefreshCw, 
  RotateCcw, 
  Plus, 
  Unlock,
  Lock,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { useDate } from '@/contexts/DateContext';
import { formatDate } from '@/lib/dateUtils';
import DateSelector from '@/components/DateSelector';
import { HierarchyNode } from '../WorkflowHierarchyBreadcrumb';
import { showSuccessToast, showInfoToast, showWarningToast } from '@/lib/toast';

interface WorkflowUnifiedHeaderProps {
  workflowId: string;
  workflowTitle: string;
  hierarchyPath: HierarchyNode[];
  progress: number;
  status: string;
  isLocked: boolean;
  onToggleLock: () => void;
  onRefresh: () => void;
  taskCounts?: {
    completed: number;
    failed: number;
    rejected: number;
    pending: number;
    processing: number;
  };
  lastRefreshed?: Date;
  viewMode?: 'classic' | 'alternative' | 'stepfunction';
  onViewToggle?: (mode: 'classic' | 'alternative' | 'stepfunction') => void;
}

const WorkflowUnifiedHeader: React.FC<WorkflowUnifiedHeaderProps> = ({
  workflowId,
  workflowTitle,
  hierarchyPath,
  progress,
  status,
  isLocked,
  onToggleLock,
  onRefresh,
  taskCounts,
  lastRefreshed = new Date(),
  viewMode = 'classic',
  onViewToggle
}) => {
  const router = useRouter();
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(15);
  
  // Calculate task counts if not provided
  const defaultTaskCounts = taskCounts || {
    completed: 3,
    failed: 0,
    rejected: 0,
    pending: 2,
    processing: 1
  };
  
  // Update seconds since last refresh
  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastRefreshed.getTime()) / 1000);
      setSecondsSinceRefresh(seconds);
      
      setCountdown(prev => {
        if (prev <= 1) {
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lastRefreshed]);
  
  // Use a single color for progress indicators
  const getProgressColor = () => {
    return "bg-blue-500";
  };

  // Handle action buttons
  const handleAddAdhocStage = () => {
    showInfoToast("Add Adhoc Stage functionality would be implemented here");
  };

  const handleResetWorkflow = () => {
    showWarningToast("Reset Workflow functionality would be implemented here");
  };

  const handleReopenTollGate = () => {
    showInfoToast("Reopen Toll Gate functionality would be implemented here");
  };

  return (
    <Card className="mb-2">
      <CardHeader className="py-1.5 px-3 flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{workflowTitle}</h3>
          {status === "Active" ? (
            <div className="w-2 h-2 rounded-full bg-green-500" title="Active"></div>
          ) : (
            <Badge variant="outline" className="text-xs">
              {status}
            </Badge>
          )}
          
          {/* View toggle buttons */}
          {onViewToggle && (
            <div className="bg-muted rounded-lg p-1 flex ml-2">
              <Button
                variant={viewMode === 'classic' ? "default" : "ghost"}
                size="icon"
                onClick={() => onViewToggle('classic')}
                title="Classic View"
                className="h-6 w-6"
              >
                <Layers className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === 'alternative' ? "default" : "ghost"}
                size="icon"
                onClick={() => onViewToggle('alternative')}
                title="Modern View"
                className="h-6 w-6"
              >
                <Sparkles className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === 'stepfunction' ? "default" : "ghost"}
                size="icon"
                onClick={() => onViewToggle('stepfunction')}
                title="Step Function View"
                className="h-6 w-6"
              >
                <GitBranch className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center mr-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last refreshed: {secondsSinceRefresh}s | Auto-refresh in: {countdown}s</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={onToggleLock}
            title={isLocked ? "Locked - Click to unlock" : "Unlocked - Click to lock"}
          >
            {isLocked ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Unlock className="h-3.5 w-3.5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={handleAddAdhocStage}
            title="Add Adhoc Stage"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={handleResetWorkflow}
            title="Reset Workflow"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={handleReopenTollGate}
            title="Reopen Toll Gate"
          >
            <Unlock className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={onRefresh}
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="py-1.5 px-3">
        <div className="flex flex-col space-y-1">
          {/* Hierarchy Path with Progress - More compact */}
          <div className="flex items-center gap-1 text-xs">
            {hierarchyPath.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 px-1.5 flex items-center gap-1 hover:bg-secondary/50"
                      onClick={() => {
                        // Navigate to the appropriate level
                        if (node.level === 'app') {
                          router.push(`/application/${node.id}`);
                        } else if (index < hierarchyPath.length - 1) {
                          // If not the last node (current level), navigate to application with this level selected
                          const appNode = hierarchyPath.find(n => n.level === 'app');
                          if (appNode) {
                            router.push(`/application/${appNode.id}`);
                          }
                        }
                      }}
                    >
                      <span className="font-medium">{node.name}</span>
                      <span className="ml-1 text-muted-foreground">({node.progress}%)</span>
                    </Button>
                    
                    {/* Visual progress indicator with single color */}
                    <div className="h-0.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor()}`} 
                        style={{ width: `${node.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {index < hierarchyPath.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-muted-foreground mx-0.5" />
                  )}
                </React.Fragment>
              ))}
            </div>
          
          <div className="flex flex-wrap gap-2 mt-1 items-center justify-end">
            {/* Status Counts and Action Buttons moved to the right */}
            <div className="flex items-center gap-3">
              {/* Status Counts in a more compact layout */}
              <div className="flex gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Completed: {defaultTaskCounts.completed}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Processing: {defaultTaskCounts.processing}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Pending: {defaultTaskCounts.pending}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Failed: {defaultTaskCounts.failed + defaultTaskCounts.rejected}</span>
                </div>
              </div>
              
              {/* Separator */}
              <div className="h-5 w-px bg-gray-200"></div>
              
              {/* Action Buttons */}
              <div className="flex gap-1">
                <Link 
                  href={`/finance?workflowId=${workflowId}&workflowName=${workflowTitle}`}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 text-xs"
                  >
                    <BarChart4 className="h-3.5 w-3.5 mr-1" />
                    Finance
                  </Button>
                </Link>
                
                <Link 
                  href="/support"
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 text-xs"
                  >
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowUnifiedHeader;