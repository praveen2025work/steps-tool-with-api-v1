import React from 'react';
import StatCard from './StatCard';
import ComplianceChart from './ComplianceChart';
import PriorityApprovals from './PriorityApprovals';
import { Layers, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for pending approvals
const mockApprovals = [
  {
    id: "approval-1",
    title: "Daily Named PNL Approval",
    priority: "high" as const,
    dueDate: "Today",
    assignee: "John Doe"
  },
  {
    id: "approval-2",
    title: "Monthly Regulatory Report",
    priority: "high" as const,
    dueDate: "Tomorrow",
    assignee: "Jane Smith"
  },
  {
    id: "approval-3",
    title: "Risk Assessment Update",
    priority: "medium" as const,
    dueDate: "In 2 days",
    assignee: "Mike Johnson"
  },
  {
    id: "approval-4",
    title: "Compliance Documentation",
    priority: "medium" as const,
    dueDate: "In 3 days",
    assignee: "Sarah Williams"
  },
  {
    id: "approval-5",
    title: "Quarterly Review",
    priority: "low" as const,
    dueDate: "Next week",
    assignee: "Robert Brown"
  }
];

const ManagementBoard = () => {
  return (
    <div className="space-y-4">
      {/* Tabbed Management Board */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="w-full justify-start mb-2">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Period: Current</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                  title="Total Applications"
                  value="3"
                  description="3 active applications"
                  trend={{ value: 5.2, isPositive: true }}
                  icon={<Layers className="h-5 w-5 text-primary" />}
                />
                <StatCard
                  title="In Progress"
                  value="1"
                  description="Current processes"
                  trend={{ value: 2.4, isPositive: true }}
                  icon={<Activity className="h-5 w-5 text-blue-500" />}
                />
                <StatCard
                  title="Completed"
                  value="1"
                  description="Finished processes"
                  trend={{ value: 12.5, isPositive: true }}
                  icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                />
                <StatCard
                  title="Compliance Rate"
                  value="94%"
                  description="Regulatory adherence"
                  trend={{ value: 0.8, isPositive: false }}
                  icon={<ShieldAlert className="h-5 w-5 text-yellow-500" />}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-0">
          <ComplianceChart complianceRate={94} />
        </TabsContent>
        
        <TabsContent value="approvals" className="mt-0">
          <PriorityApprovals
            highPriority={3}
            mediumPriority={7}
            lowPriority={2}
            items={mockApprovals}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagementBoard;