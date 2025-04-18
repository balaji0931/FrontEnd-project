import { Header } from "@/components/layout/header";
import { Link, useLocation } from "wouter";
import { Footer } from "@/components/layout/footer";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SchedulePickupForm } from "@/components/dashboard/schedule-pickup-form";
import { DonationForm } from "@/components/dashboard/donation-form";
import { RaiseIssueForm } from "@/components/dashboard/raise-issue-form";
import { SeekHelpForm } from "@/components/dashboard/seek-help-form";
import { HelpRequestsList } from "@/components/dashboard/help-requests-list";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { SocialPointsCard } from "@/components/dashboard/social-points-card";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock,
  Calendar,
  Loader2,
  MapPin,
  Package,
  BadgeCheck,
  Clock,
  AlertCircle,
  Trash2,
  Gift,
  Plus,
  Trophy,
  Filter,
  Upload,
  Info,
  Check,
  AlertTriangle,
  MapPinned,
  Users,
  HeartHandshake,
  Megaphone,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: {
    address: string;
    city: string;
  };
  status: string;
  organizerId?: number;
  maxParticipants?: number;
};

export default function CustomerDashboard() {
  console.log("CustomerDashboard: Starting component render");
  const { user } = useAuth();
  console.log("CustomerDashboard: User from auth:", user);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isWasteReportDialogOpen, setIsWasteReportDialogOpen] = useState(false);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [isSchedulePickupDialogOpen, setIsSchedulePickupDialogOpen] =
    useState(false);
  const [isRaiseIssueDialogOpen, setIsRaiseIssueDialogOpen] = useState(false);
  const [isSeekHelpDialogOpen, setIsSeekHelpDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedWasteReport, setSelectedWasteReport] = useState<any>(null);
  const [isWasteReportDetailsOpen, setIsWasteReportDetailsOpen] = useState(false);

  // Fetch waste reports
  const { data: wasteReports, isLoading: isLoadingReports } = useQuery({
    queryKey: ["/api/waste-reports"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch reports");
      return await res.json();
    },
  });

  // Fetch donations
  const { data: donations, isLoading: isLoadingDonations } = useQuery({
    queryKey: ["/api/donations"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch donations");
      return await res.json();
    },
  });

  // Fetch events
  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch events");
      return await res.json();
    },
  });

  // Fetch issues
  const { data: issues, isLoading: isLoadingIssues } = useQuery({
    queryKey: ["/api/issues"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch issues");
      return await res.json();
    },
  });

  // Fetch help requests
  const { data: helpRequests, isLoading: isLoadingHelpRequests } = useQuery({
    queryKey: ["/api/help-requests"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch help requests");
      return await res.json();
    },
  });

  // Form for feedback
  const feedbackForm = useForm({
    resolver: zodResolver(
      z.object({
        rating: z.string().min(1, "Please select a rating"),
        comments: z
          .string()
          .min(10, "Please provide more details in your feedback"),
        feedbackType: z.string().min(1, "Please select a feedback type"),
      }),
    ),
    defaultValues: {
      rating: "",
      comments: "",
      feedbackType: "",
    },
  });

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: any) => {
      const feedbackData = {
        ...data,
        userId: user?.id,
        createdAt: new Date().toISOString(),
      };

      const response = await apiRequest("POST", "/api/feedback", feedbackData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      });
      feedbackForm.reset();
      setIsFeedbackDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit feedback",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Join event mutation
  const joinEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await apiRequest(
        "POST",
        `/api/events/${eventId}/participants`,
        {
          userId: user?.id,
          eventId,
        },
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've secondaryfully joined the event.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to join event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle joining an event
  const handleJoinEvent = (eventId: number) => {
    joinEventMutation.mutate(eventId);
  };

  // Handle feedback submission
  const onFeedbackSubmit = (data: any) => {
    submitFeedbackMutation.mutate(data);
  };

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === "dashboard") {
      return (
        <>
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.fullName || "Customer"}!
            </h1>
            <p className="text-neutral-dark">
              Here's what's happening with your Green Path account.
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card
              className="bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition-shadow duration-300 cursor-pointer border-0"
              onClick={() => setIsSchedulePickupDialogOpen(true)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                  <Trash2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Schedule Pickup</p>
                  <p className="text-xs text-gray-500">Book a slot</p>
                </div>
              </CardContent>
            </Card>

            <Link href="/donate">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-shadow duration-300 cursor-pointer border-0">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full">
                    <Gift className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Donate Items</p>
                    <p className="text-xs text-gray-500">Help others</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Card
              className="bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-md transition-shadow duration-300 cursor-pointer border-0"
              onClick={() => setIsRaiseIssueDialogOpen(true)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Raise Issue</p>
                  <p className="text-xs text-gray-500">Report problems</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-shadow duration-300 cursor-pointer border-0"
              onClick={() => setActiveTab("leaderboard")}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">My Points</p>
                  <p className="text-xs text-gray-500">
                    {user?.socialPoints || 0} points
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events Section */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>Upcoming Events</CardTitle>
                </div>
                {events && events.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("events")}
                  >
                    View All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : events && events.length > 0 ? (
                <div className="grid gap-4">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge
                          variant={
                            event.status === "upcoming"
                              ? "default"
                              : event.status === "ongoing"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {event.description.substring(0, 100)}...
                      </p>
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location.city}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t flex justify-end">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleJoinEvent(event.id)}
                          disabled={joinEventMutation.isPending}
                        >
                          {joinEventMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Joining...
                            </>
                          ) : (
                            "Join Event"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <AlertCircle className="mx-auto h-10 w-10 mb-2 text-gray-400" />
                  <p>No upcoming events found at the moment.</p>
                  <p className="text-sm mt-1">
                    Check back later or create your own event!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Requests Section */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Help Requests</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSeekHelpDialogOpen(true)}
                  >
                    <HeartHandshake className="h-4 w-4 mr-1" />
                    Request Help
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("help-others")}
                  >
                    View All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingHelpRequests ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : helpRequests && helpRequests.length > 0 ? (
                <div className="grid gap-4">
                  {helpRequests.slice(0, 2).map((request: any) => (
                    <div
                      key={request.id}
                      className={`border rounded-lg p-4 ${
                        request.isUrgent ? "border-red-300 bg-red-50/30" : ""
                      }`}
                    >
                      {request.isUrgent && (
                        <Badge variant="destructive" className="mb-2">
                          Urgent
                        </Badge>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{request.title}</h3>
                        <div className="text-sm text-gray-500">
                          {new Date(request.date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {request.description.substring(0, 80)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{request.location}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("help-others")}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Users className="mx-auto h-10 w-10 mb-2 text-gray-400" />
                  <p>No help requests at the moment.</p>
                  <p className="text-sm mt-1">
                    Ask for community assistance or volunteer to help others!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Recent Activity */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Your Recent Activity</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex"
                  onClick={() => {
                    if (wasteReports && wasteReports.length > 0) {
                      setActiveTab("waste-reports");
                    } else if (donations && donations.length > 0) {
                      setActiveTab("donations");
                    }
                  }}
                  disabled={
                    !(wasteReports && wasteReports.length > 0) &&
                    !(donations && donations.length > 0)
                  }
                >
                  View All Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingReports || isLoadingDonations || isLoadingIssues ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (wasteReports && wasteReports.length > 0) ||
                (donations && donations.length > 0) ||
                (issues && issues.length > 0) ? (
                <div className="space-y-4">
                  {wasteReports &&
                    wasteReports.slice(0, 1).map((report: any) => (
                      <div
                        key={report.id}
                        className="flex items-start gap-3 pb-3 border-b"
                      >
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{report.title}</h4>
                            <Badge
                              variant={
                                report.status === "completed"
                                  ? "secondary"
                                  : report.status === "in_progress"
                                    ? "default"
                                    : report.status === "scheduled"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                  {donations &&
                    donations.slice(0, 1).map((donation: any) => (
                      <div
                        key={donation.id}
                        className="flex items-start gap-3 pb-3 border-b"
                      >
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Gift className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{donation.itemName}</h4>
                            <Badge
                              variant={
                                donation.status === "completed"
                                  ? "secondary"
                                  : donation.status === "matched"
                                    ? "default"
                                    : donation.status === "requested"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {donation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                  {issues &&
                    issues.slice(0, 1).map((issue: any) => (
                      <div
                        key={issue.id}
                        className="flex items-start gap-3 pb-3 border-b"
                      >
                        <div className="bg-primary/10 p-2 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{issue.title}</h4>
                            <Badge
                              variant={
                                issue.status === "resolved"
                                  ? "secondary"
                                  : issue.status === "in_progress"
                                    ? "default"
                                    : issue.isUrgent
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {issue.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                  <div className="flex justify-center pt-2 sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (wasteReports && wasteReports.length > 0) {
                          setActiveTab("waste-reports");
                        } else if (donations && donations.length > 0) {
                          setActiveTab("donations");
                        } else if (issues && issues.length > 0) {
                          setActiveTab("raise-issue");
                        }
                      }}
                    >
                      View All Activity
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <AlertCircle className="mx-auto h-10 w-10 mb-2 text-gray-400" />
                  <p>
                    No activity found. Start by scheduling a pickup or reporting
                    an issue!
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSchedulePickupDialogOpen(true)}
                    >
                      Schedule Pickup
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDonationDialogOpen(true)}
                    >
                      Donate Items
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRaiseIssueDialogOpen(true)}
                    >
                      Raise Issue
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-primary" />
                <CardTitle>Your Environmental Impact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-1">
                    {wasteReports?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-dark">Waste Reports</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-1">
                    {donations?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-dark">Donations</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-1">
                    {user?.socialPoints || 0}
                  </div>
                  <div className="text-sm text-neutral-dark">Points</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Environmental Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        CO2 Emission Saved
                      </span>
                      <Badge
                        variant="outline"
                        className="text-green-600 bg-green-50"
                      >
                        +2.5kg
                      </Badge>
                    </div>
                    <div className="font-semibold">12.5 kg</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Waste Recycled
                      </span>
                      <Badge
                        variant="outline"
                        className="text-blue-600 bg-blue-50"
                      >
                        +3kg
                      </Badge>
                    </div>
                    <div className="font-semibold">47 kg</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline">See Detailed Impact</Button>
            </CardFooter>
          </Card>
        </>
      );
    } else if (activeTab === "waste-reports") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Waste Reports</h1>
              <p className="text-neutral-dark">
                Manage your waste pickups and recycling
              </p>
            </div>
            <Button onClick={() => setIsSchedulePickupDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Pickup
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Reports</CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingReports ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : wasteReports && wasteReports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wasteReports.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.title}
                        </TableCell>
                        <TableCell>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.status === "completed"
                                ? "secondary"
                                : report.status === "in_progress"
                                  ? "default"
                                  : report.status === "scheduled"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedWasteReport(report);
                              setIsWasteReportDetailsOpen(true);
                            }}
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Trash2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    No waste reports yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    Start reporting waste for pickup and recycling to earn
                    social points and help the environment.
                  </p>
                  <Button onClick={() => setIsSchedulePickupDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule a Pickup
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    } else if (activeTab === "donations") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Donations</h1>
              <p className="text-neutral-dark">
                Manage your items for donation
              </p>
            </div>
            <Link href="/donate">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Donation
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Donations</CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Donations</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="matched">Matched</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDonations ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : donations && donations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation: any) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">
                          {donation.itemName}
                        </TableCell>
                        <TableCell>{donation.category}</TableCell>
                        <TableCell>
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              donation.status === "completed"
                                ? "secondary"
                                : donation.status === "matched"
                                  ? "default"
                                  : donation.status === "requested"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {donation.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Gift className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No donations yet</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    Donate unused items to those in need. Your contributions can
                    make a significant impact on someone's life.
                  </p>
                  <Link href="/donate">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Donate an Item
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    } else if (activeTab === "events") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Community Events</h1>
              <p className="text-neutral-dark">
                Join events and cleanup drives in your area
              </p>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="upcoming">Upcoming Events</SelectItem>
                <SelectItem value="ongoing">Ongoing Events</SelectItem>
                <SelectItem value="completed">Past Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Join local events, earn points, and make a difference in your
                  community
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEvents ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : events && events.length > 0 ? (
                  <div className="grid gap-4">
                    {events.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-gray-600 my-2">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarClock className="h-4 w-4 mr-1" />
                                <span>
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{event.location.city}</span>
                              </div>
                              <Badge
                                variant={
                                  event.status === "upcoming"
                                    ? "outline"
                                    : event.status === "ongoing"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {event.status}
                              </Badge>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleJoinEvent(event.id)}
                            disabled={joinEventMutation.isPending}
                          >
                            {joinEventMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Joining...
                              </>
                            ) : (
                              "Join Event"
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      No upcoming events
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                      Check back later for community events, or contact an
                      organization to suggest a new event.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Joined Events</CardTitle>
                <CardDescription>
                  Events you have joined and your participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    You haven't joined any events yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    Participate in community events to earn points and make an
                    impact!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    } else if (activeTab === "raise-issue") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Raise Issue</h1>
              <p className="text-neutral-dark">
                Report environmental issues and illegal dumping
              </p>
            </div>
            <Button onClick={() => setIsRaiseIssueDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Issue
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Report an Issue</CardTitle>
              <CardDescription>
                Help keep our environment clean by reporting issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RaiseIssueForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Reported Issues</CardTitle>
              <CardDescription>
                Track the status of issues you've reported
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingIssues ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : issues && issues.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Reported</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue: any) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">
                          {issue.title}
                        </TableCell>
                        <TableCell>{issue.issueType}</TableCell>
                        <TableCell>
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              issue.status === "resolved"
                                ? "secondary"
                                : issue.status === "in_progress"
                                  ? "default"
                                  : issue.isUrgent
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertTriangle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    No issues reported yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Help keep our environment clean by reporting waste
                    management issues in your area.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    } else if (activeTab === "seek-help") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Request Community Help</h1>
              <p className="text-neutral-dark">
                Ask for assistance with environmental initiatives
              </p>
            </div>
            <Button onClick={() => setIsSeekHelpDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Seek Community Help</CardTitle>
              <CardDescription>
                Request assistance for cleanup drives, recycling initiatives,
                and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SeekHelpForm />
            </CardContent>
          </Card>
        </div>
      );
    } else if (activeTab === "help-others") {
      return <HelpRequestsList />;
    } else if (activeTab === "pickup-history") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Pickup History</h1>
              <p className="text-neutral-dark">
                Track your past and upcoming waste pickups
              </p>
            </div>
            <Button onClick={() => setIsSchedulePickupDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Pickup
            </Button>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Pickups</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingReports ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : wasteReports &&
                    wasteReports.filter((r: any) =>
                      ["pending", "scheduled"].includes(r.status),
                    ).length > 0 ? (
                    <div className="space-y-4">
                      {wasteReports
                        .filter((r: any) =>
                          ["pending", "scheduled"].includes(r.status),
                        )
                        .map((report: any) => (
                          <div
                            key={report.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{report.title}</h3>
                              <Badge
                                variant={
                                  report.status === "scheduled"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {report.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Pickup Date
                                </p>
                                <p className="mt-1">
                                  {report.scheduledDate
                                    ? new Date(
                                        report.scheduledDate,
                                      ).toLocaleDateString()
                                    : "Not scheduled yet"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Location
                                </p>
                                <p className="mt-1 text-sm">
                                  {report.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">
                        No upcoming pickups
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                        Schedule a pickup to have your waste collected and
                        recycled properly.
                      </p>
                      <Button
                        onClick={() => setIsSchedulePickupDialogOpen(true)}
                      >
                        Schedule Pickup
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Pickups</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingReports ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : wasteReports &&
                    wasteReports.filter((r: any) => r.status === "completed")
                      .length > 0 ? (
                    <div className="space-y-4">
                      {wasteReports
                        .filter((r: any) => r.status === "completed")
                        .map((report: any) => (
                          <div
                            key={report.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{report.title}</h3>
                              <Badge variant="secondary">Completed</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Pickup Date
                                </p>
                                <p className="mt-1">
                                  {report.completedDate
                                    ? new Date(
                                        report.completedDate,
                                      ).toLocaleDateString()
                                    : new Date(
                                        report.createdAt,
                                      ).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Location
                                </p>
                                <p className="mt-1 text-sm">
                                  {report.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Check className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">
                        No completed pickups
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        Your completed pickups will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cancelled" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cancelled Pickups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      No cancelled pickups
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      Your cancelled pickups will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      );
    } else if (activeTab === "leaderboard") {
      return <Leaderboard />;
    } else if (activeTab === "give-feedback") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Give Feedback</h1>
              <p className="text-neutral-dark">
                Share your experience and help us improve
              </p>
            </div>
            <Button onClick={() => setIsFeedbackDialogOpen(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              New Feedback
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Feedback</CardTitle>
              <CardDescription>
                Help us improve our services by sharing your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...feedbackForm}>
                <form
                  onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={feedbackForm.control}
                    name="feedbackType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feedback Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select feedback type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">
                              General Feedback
                            </SelectItem>
                            <SelectItem value="pickup">
                              Pickup Service
                            </SelectItem>
                            <SelectItem value="donation">
                              Donation System
                            </SelectItem>
                            <SelectItem value="issue">
                              Issue Reporting
                            </SelectItem>
                            <SelectItem value="events">
                              Community Events
                            </SelectItem>
                            <SelectItem value="app">
                              Application Experience
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={feedbackForm.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Rate your experience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">
                              Excellent ⭐⭐⭐⭐⭐
                            </SelectItem>
                            <SelectItem value="4">Good ⭐⭐⭐⭐</SelectItem>
                            <SelectItem value="3">Average ⭐⭐⭐</SelectItem>
                            <SelectItem value="2">
                              Below Average ⭐⭐
                            </SelectItem>
                            <SelectItem value="1">Poor ⭐</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={feedbackForm.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comments</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please share your thoughts, suggestions, or concerns..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your feedback helps us improve our services and user
                          experience.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={submitFeedbackMutation.isPending}
                  >
                    {submitFeedbackMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  console.log("CustomerDashboard: Before render");
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-3">
              <DashboardNav
                role="customer"
                activeItem={activeTab}
                setActiveItem={setActiveTab}
              />

              <SocialPointsCard
                points={user?.socialPoints || 0}
                badges={["Beginner", "Waste Warrior"]}
              />
            </div>

            {/* Main Content */}
            <div className="md:col-span-9">{renderContent()}</div>
          </div>
        </div>
      </main>

      {/* Schedule Pickup Dialog */}
      <Dialog
        open={isSchedulePickupDialogOpen}
        onOpenChange={setIsSchedulePickupDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Waste Pickup</DialogTitle>
          </DialogHeader>
          <SchedulePickupForm />
        </DialogContent>
      </Dialog>

      {/* Donation Dialog */}
      <Dialog
        open={isDonationDialogOpen}
        onOpenChange={setIsDonationDialogOpen}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Donate an Item</DialogTitle>
          </DialogHeader>
          <DonationForm />
        </DialogContent>
      </Dialog>

      {/* Raise Issue Dialog */}
      <Dialog
        open={isRaiseIssueDialogOpen}
        onOpenChange={setIsRaiseIssueDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Raise an Issue</DialogTitle>
          </DialogHeader>
          <RaiseIssueForm />
        </DialogContent>
      </Dialog>

      {/* Seek Help Dialog */}
      <Dialog
        open={isSeekHelpDialogOpen}
        onOpenChange={setIsSeekHelpDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Community Help</DialogTitle>
          </DialogHeader>
          <SeekHelpForm />
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Give Feedback</DialogTitle>
          </DialogHeader>
          <Form {...feedbackForm}>
            <form
              onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)}
              className="space-y-6"
            >
              <FormField
                control={feedbackForm.control}
                name="feedbackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">
                          General Feedback
                        </SelectItem>
                        <SelectItem value="pickup">Pickup Service</SelectItem>
                        <SelectItem value="donation">
                          Donation System
                        </SelectItem>
                        <SelectItem value="issue">Issue Reporting</SelectItem>
                        <SelectItem value="events">Community Events</SelectItem>
                        <SelectItem value="app">
                          Application Experience
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={feedbackForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rate your experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">Excellent ⭐⭐⭐⭐⭐</SelectItem>
                        <SelectItem value="4">Good ⭐⭐⭐⭐</SelectItem>
                        <SelectItem value="3">Average ⭐⭐⭐</SelectItem>
                        <SelectItem value="2">Below Average ⭐⭐</SelectItem>
                        <SelectItem value="1">Poor ⭐</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={feedbackForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please share your thoughts, suggestions, or concerns..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFeedbackDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitFeedbackMutation.isPending}
                >
                  {submitFeedbackMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Footer />
      
      {/* Waste Report Details Dialog */}
      <Dialog 
        open={isWasteReportDetailsOpen} 
        onOpenChange={(open) => {
          setIsWasteReportDetailsOpen(open);
          if (!open) setSelectedWasteReport(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Waste Report Details</DialogTitle>
            <DialogDescription>
              View detailed information about your waste report
            </DialogDescription>
          </DialogHeader>
          
          {selectedWasteReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedWasteReport.title}</h3>
                  <p className="text-sm text-neutral-dark mt-1">{selectedWasteReport.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="font-medium text-sm">Status: </span>
                      <Badge
                        variant={
                          selectedWasteReport.status === "completed"
                            ? "secondary"
                            : selectedWasteReport.status === "in_progress"
                              ? "default"
                              : selectedWasteReport.status === "scheduled"
                                ? "outline"
                                : "secondary"
                        }
                      >
                        {selectedWasteReport.status.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    <div>
                      <span className="font-medium text-sm">Created: </span>
                      <span>{new Date(selectedWasteReport.createdAt).toLocaleString()}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-sm">Location: </span>
                      <span>
                        {typeof selectedWasteReport.location === 'string' 
                          ? selectedWasteReport.location 
                          : `${selectedWasteReport.location.address}, ${selectedWasteReport.location.city}`}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-sm">Waste Segregated: </span>
                      {selectedWasteReport.isSegregated ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </div>
                    
                    {selectedWasteReport.assignedDealerId && (
                      <div>
                        <span className="font-medium text-sm">Assigned Dealer: </span>
                        <span>Dealer #{selectedWasteReport.assignedDealerId}</span>
                      </div>
                    )}
                    
                    {selectedWasteReport.scheduledDate && (
                      <div>
                        <span className="font-medium text-sm">Scheduled for: </span>
                        <span>{new Date(selectedWasteReport.scheduledDate).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Processing Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedWasteReport.status !== "pending" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        {selectedWasteReport.status !== "pending" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span>1</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`font-medium ${selectedWasteReport.status !== "pending" ? "text-green-600" : ""}`}>
                          Report Submitted
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedWasteReport.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedWasteReport.status === "scheduled" || selectedWasteReport.status === "in_progress" || selectedWasteReport.status === "completed" 
                          ? "bg-green-100 text-green-600" 
                          : selectedWasteReport.status === "rejected" 
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-400"
                      }`}>
                        {selectedWasteReport.status === "scheduled" || selectedWasteReport.status === "in_progress" || selectedWasteReport.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : selectedWasteReport.status === "rejected" ? (
                          <XCircle className="h-5 w-5" />
                        ) : (
                          <span>2</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`font-medium ${
                          selectedWasteReport.status === "scheduled" || selectedWasteReport.status === "in_progress" || selectedWasteReport.status === "completed" 
                            ? "text-green-600" 
                            : selectedWasteReport.status === "rejected" 
                              ? "text-red-600"
                              : ""
                        }`}>
                          {selectedWasteReport.status === "rejected" ? "Rejected" : "Scheduled for Pickup"}
                        </p>
                        {selectedWasteReport.scheduledDate && (
                          <p className="text-xs text-gray-500">
                            {new Date(selectedWasteReport.scheduledDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedWasteReport.status === "in_progress" || selectedWasteReport.status === "completed" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {selectedWasteReport.status === "in_progress" || selectedWasteReport.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span>3</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`font-medium ${selectedWasteReport.status === "in_progress" || selectedWasteReport.status === "completed" ? "text-green-600" : ""}`}>
                          Pickup In Progress
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedWasteReport.status === "completed" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {selectedWasteReport.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span>4</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`font-medium ${selectedWasteReport.status === "completed" ? "text-green-600" : ""}`}>
                          Completed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWasteReportDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
