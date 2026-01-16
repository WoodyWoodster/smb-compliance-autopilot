"use client";

import { useState } from "react";
import { format, isPast, isToday, addDays, isBefore } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Plus,
  MoreHorizontal,
  Repeat,
  Bell,
} from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description?: string;
  frequency: "one_time" | "daily" | "weekly" | "monthly" | "quarterly" | "annually";
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: 1 | 2 | 3;
  dueDate: Date;
  completedAt?: Date;
  requirementCode?: string;
  category: string;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete Annual Risk Assessment",
    description: "Conduct comprehensive HIPAA risk assessment covering all systems",
    frequency: "annually",
    status: "overdue",
    priority: 1,
    dueDate: new Date("2026-01-05"),
    category: "Risk Management",
    requirementCode: "164.308(a)(1)(ii)(A)",
  },
  {
    id: "2",
    title: "Review Privacy Policy",
    description: "Annual review and update of Notice of Privacy Practices",
    frequency: "annually",
    status: "pending",
    priority: 1,
    dueDate: addDays(new Date(), 5),
    category: "Privacy",
    requirementCode: "164.520",
  },
  {
    id: "3",
    title: "Staff Security Training",
    description: "Conduct quarterly security awareness training for all staff",
    frequency: "quarterly",
    status: "pending",
    priority: 2,
    dueDate: addDays(new Date(), 14),
    category: "Training",
    requirementCode: "164.308(a)(5)",
  },
  {
    id: "4",
    title: "Review Audit Logs",
    description: "Monthly review of system audit logs for suspicious activity",
    frequency: "monthly",
    status: "in_progress",
    priority: 2,
    dueDate: addDays(new Date(), 3),
    category: "Technical Security",
    requirementCode: "164.312(b)",
  },
  {
    id: "5",
    title: "Test Data Backup",
    description: "Verify backup systems are working correctly",
    frequency: "monthly",
    status: "completed",
    priority: 2,
    dueDate: new Date("2026-01-10"),
    completedAt: new Date("2026-01-10"),
    category: "Contingency Planning",
    requirementCode: "164.308(a)(7)",
  },
  {
    id: "6",
    title: "Review Business Associate Agreements",
    description: "Annual review of all BAAs with vendors",
    frequency: "annually",
    status: "pending",
    priority: 1,
    dueDate: addDays(new Date(), 30),
    category: "Business Associates",
    requirementCode: "164.308(b)",
  },
  {
    id: "7",
    title: "Workstation Security Audit",
    description: "Quarterly audit of workstations for compliance",
    frequency: "quarterly",
    status: "pending",
    priority: 3,
    dueDate: addDays(new Date(), 45),
    category: "Physical Security",
    requirementCode: "164.310(b)",
  },
];

const frequencyLabels: Record<string, string> = {
  one_time: "One-time",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annually",
};

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-700",
    icon: Clock,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
};

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    frequency: "one_time" as Task["frequency"],
    priority: 2 as Task["priority"],
    category: "",
  });

  // Calculate stats
  const stats = {
    total: tasks.length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    dueThisWeek: tasks.filter(
      (t) =>
        t.status !== "completed" &&
        isBefore(t.dueDate, addDays(new Date(), 7)) &&
        !isPast(t.dueDate)
    ).length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "overdue") return task.status === "overdue";
    if (filter === "pending")
      return task.status === "pending" || task.status === "in_progress";
    if (filter === "completed") return task.status === "completed";
    if (filter === "this_week")
      return (
        task.status !== "completed" &&
        isBefore(task.dueDate, addDays(new Date(), 7))
      );
    return true;
  });

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: "completed" as const, completedAt: new Date() }
          : task
      )
    );
    toast.success("Task marked as completed!");
  };

  const handleAddTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: "pending",
      dueDate: addDays(new Date(), 7),
      category: newTask.category || "General",
    };
    setTasks((prev) => [task, ...prev]);
    setShowAddDialog(false);
    setNewTask({
      title: "",
      description: "",
      frequency: "one_time",
      priority: 2,
      category: "",
    });
    toast.success("Task added successfully!");
  };

  const getDueDateLabel = (date: Date, status: string) => {
    if (status === "completed") return "Completed";
    if (isPast(date) && !isToday(date)) return "Overdue";
    if (isToday(date)) return "Due today";
    const days = Math.ceil(
      (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 1) return "Due tomorrow";
    if (days <= 7) return `Due in ${days} days`;
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className={stats.overdue > 0 ? "border-red-200 bg-red-50" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dueThisWeek}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="overdue" className="text-red-600">
              Overdue ({stats.overdue})
            </TabsTrigger>
            <TabsTrigger value="this_week">This Week</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new compliance task
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Task description..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={newTask.frequency}
                    onValueChange={(value) =>
                      setNewTask((prev) => ({
                        ...prev,
                        frequency: value as Task["frequency"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(frequencyLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority.toString()}
                    onValueChange={(value) =>
                      setNewTask((prev) => ({
                        ...prev,
                        priority: parseInt(value) as Task["priority"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">High</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, category: e.target.value }))
                  }
                  placeholder="e.g., Training, Security, Privacy"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask} disabled={!newTask.title}>
                Add Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>{filteredTasks.length} tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No tasks found
              </div>
            ) : (
              filteredTasks.map((task) => {
                const StatusIcon = statusConfig[task.status].icon;
                const dueDateLabel = getDueDateLabel(task.dueDate, task.status);
                const isOverdue = task.status === "overdue";

                return (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 rounded-lg border p-4 ${
                      isOverdue ? "border-red-200 bg-red-50" : ""
                    } ${task.status === "completed" ? "opacity-60" : ""}`}
                  >
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={() => handleCompleteTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p
                            className={`font-medium ${
                              task.status === "completed"
                                ? "line-through"
                                : ""
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Set Reminder</DropdownMenuItem>
                            <DropdownMenuItem>View Requirement</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={statusConfig[task.status].color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[task.status].label}
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="mr-1 h-3 w-3" />
                          {dueDateLabel}
                        </Badge>
                        {task.frequency !== "one_time" && (
                          <Badge variant="secondary">
                            <Repeat className="mr-1 h-3 w-3" />
                            {frequencyLabels[task.frequency]}
                          </Badge>
                        )}
                        <Badge variant="outline">{task.category}</Badge>
                        {task.priority === 1 && (
                          <Badge variant="destructive">High Priority</Badge>
                        )}
                      </div>
                      {task.requirementCode && (
                        <p className="text-xs text-muted-foreground">
                          Related to: {task.requirementCode}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
