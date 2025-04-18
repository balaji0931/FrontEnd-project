import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { RaiseIssueForm } from "@/components/dashboard/raise-issue-form";
import { SeekHelpForm } from "@/components/dashboard/seek-help-form";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { SocialPointsCard } from "@/components/dashboard/social-points-card";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Trophy,
  Gift,
  AlertTriangle,
  Package,
  Users,
  HeartHandshake,
  Plus,
  Filter,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WasteReport = {
  id: number;
  userId: number;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  status: string;
  isSegregated: boolean;
  createdAt: string;
  assignedDealerId: number | null;
  scheduledDate: string | null;
};

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
};

export default function DealerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending-pickups");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [openReportId, setOpenReportId] = useState<number | null>(null);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [isRaiseIssueDialogOpen, setIsRaiseIssueDialogOpen] = useState(false);
  const [isSeekHelpDialogOpen, setIsSeekHelpDialogOpen] = useState(false);

  const { data: pendingReports, isLoading: isLoadingPending } = useQuery<
    WasteReport[]
  >({
    queryKey: ["/api/waste-reports"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch reports");
      return await res.json();
    },
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch events");
      return await res.json();
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async ({ id, date }: { id: number; date: string }) => {
      return await apiRequest("PUT", `/api/waste-reports/${id}`, {
        status: "scheduled",
        assignedDealerId: user?.id,
        scheduledDate: date,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waste-reports"] });
      toast({
        title: "Pickup Accepted",
        description: "Pickup request has been accepted and scheduled.",
      });
      setOpenReportId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to accept pickup",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("PUT", `/api/waste-reports/${id}`, {
        status: "rejected",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waste-reports"] });
      toast({
        title: "Pickup Rejected",
        description: "Pickup request has been rejected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to reject pickup",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completePickupMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("PUT", `/api/waste-reports/${id}`, {
        status: "completed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waste-reports"] });
      toast({
        title: "Pickup Completed",
        description: "Pickup has been marked as completed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to complete pickup",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const progressPickupMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("PUT", `/api/waste-reports/${id}`, {
        status: "in_progress",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waste-reports"] });
      toast({
        title: "Pickup In Progress",
        description: "Pickup has been marked as in progress.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update pickup",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const pendingPickups =
    pendingReports?.filter((report) => report.status === "pending") || [];
  const acceptedPickups =
    pendingReports?.filter(
      (report) =>
        (report.status === "scheduled" || report.status === "in_progress") &&
        report.assignedDealerId === user?.id
    ) || [];
  const completedPickups =
    pendingReports?.filter(
      (report) =>
        report.status === "completed" && report.assignedDealerId === user?.id
    ) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F5F5F5] py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-darker mb-2">
              Dealer Dashboard
            </h1>
            <p className="text-neutral-dark">
              Manage pickup requests, track completed pickups, and join
              community events.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-3">
              <DashboardNav
                role="dealer"
                activeItem={activeTab}
                setActiveItem={setActiveTab}
              />
              <SocialPointsCard
                points={user?.socialPoints || 0}
                badges={["Certified Dealer", "Waste Collector"]}
              />
            </div>

            {/* Main Content */}
            <div className="md:col-span-9">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 w-full md:w-auto">
                  <TabsTrigger value="pending-pickups">
                    Pending Pickups
                  </TabsTrigger>
                  <TabsTrigger value="accepted-pickups">
                    Accepted Pickups
                  </TabsTrigger>
                  <TabsTrigger value="completed-pickups">
                    Completed Pickups
                  </TabsTrigger>
                  <TabsTrigger value="events">Community Events</TabsTrigger>
                  <TabsTrigger value="raise-issue">Raise Issue</TabsTrigger>
                  <TabsTrigger value="seek-help">Seek Help</TabsTrigger>
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                </TabsList>

                <TabsContent value="pending-pickups">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Pickup Requests</CardTitle>
                      <CardDescription>
                        Review and accept pickup requests from customers in your
                        area.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingPending ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : pendingPickups.length > 0 ? (
                        <div className="grid gap-4">
                          {pendingPickups.map((report) => (
                            <div
                              key={report.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">
                                    {report.title}
                                  </h3>
                                  <p className="text-sm text-neutral-dark mt-1">
                                    {report.description}
                                  </p>
                                  <p className="text-sm text-neutral-dark mt-2">
                                    <span className="font-medium">
                                      Location:
                                    </span>{" "}
                                    {report.location.address},{" "}
                                    {report.location.city}
                                  </p>
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">
                                      Waste Segregated:
                                    </span>{" "}
                                    {report.isSegregated ? (
                                      <span className="text-green-600">
                                        Yes
                                      </span>
                                    ) : (
                                      <span className="text-red-600">No</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-neutral-dark mt-2">
                                    Reported on{" "}
                                    {new Date(
                                      report.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Dialog
                                    open={openReportId === report.id}
                                    onOpenChange={(open) => {
                                      if (!open) setOpenReportId(null);
                                      else setOpenReportId(report.id);
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          setOpenReportId(report.id)
                                        }
                                      >
                                        Accept
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Schedule Pickup
                                        </DialogTitle>
                                        <DialogDescription>
                                          Set a date and time when you will pick
                                          up the waste.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="scheduled-date">
                                            Pickup Date & Time
                                          </Label>
                                          <Input
                                            id="scheduled-date"
                                            type="datetime-local"
                                            value={selectedDate}
                                            onChange={(e) =>
                                              setSelectedDate(e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button
                                          variant="outline"
                                          onClick={() => setOpenReportId(null)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            acceptMutation.mutate({
                                              id: report.id,
                                              date: selectedDate,
                                            })
                                          }
                                          disabled={
                                            !selectedDate ||
                                            acceptMutation.isPending
                                          }
                                        >
                                          {acceptMutation.isPending && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          )}
                                          Confirm Pickup
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      rejectMutation.mutate(report.id)
                                    }
                                    disabled={rejectMutation.isPending}
                                  >
                                    {rejectMutation.isPending && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-neutral-dark">
                          No pending pickup requests found.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="accepted-pickups">
                  <Card>
                    <CardHeader>
                      <CardTitle>Accepted Pickups</CardTitle>
                      <CardDescription>
                        Manage pickups you've accepted and track their status.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingPending ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : acceptedPickups.length > 0 ? (
                        <div className="grid gap-4">
                          {acceptedPickups.map((report) => (
                            <div
                              key={report.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">
                                      {report.title}
                                    </h3>
                                    <Badge
                                      variant={
                                        report.status === "scheduled"
                                          ? "outline"
                                          : "default"
                                      }
                                    >
                                      {report.status === "scheduled"
                                        ? "Scheduled"
                                        : "In Progress"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-neutral-dark mt-1">
                                    {report.description}
                                  </p>
                                  <p className="text-sm text-neutral-dark mt-2">
                                    <span className="font-medium">
                                      Location:
                                    </span>{" "}
                                    {report.location.address},{" "}
                                    {report.location.city}
                                  </p>
                                  <p className="text-sm text-neutral-dark mt-1">
                                    <span className="font-medium">
                                      Scheduled for:
                                    </span>{" "}
                                    {report.scheduledDate
                                      ? new Date(
                                          report.scheduledDate
                                        ).toLocaleString()
                                      : "Not scheduled"}
                                  </p>
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">
                                      Waste Segregated:
                                    </span>{" "}
                                    {report.isSegregated ? (
                                      <span className="text-green-600">
                                        Yes
                                      </span>
                                    ) : (
                                      <span className="text-red-600">No</span>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {report.status === "scheduled" ? (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        progressPickupMutation.mutate(report.id)
                                      }
                                      disabled={
                                        progressPickupMutation.isPending
                                      }
                                    >
                                      {progressPickupMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      )}
                                      Start Pickup
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        completePickupMutation.mutate(report.id)
                                      }
                                      disabled={
                                        completePickupMutation.isPending
                                      }
                                    >
                                      {completePickupMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      )}
                                      Complete Pickup
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-neutral-dark">
                          You haven't accepted any pickups yet.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed-pickups">
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Pickups</CardTitle>
                      <CardDescription>
                        View your pickup history and completed waste
                        collections.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingPending ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : completedPickups.length > 0 ? (
                        <div className="grid gap-4">
                          {completedPickups.map((report) => (
                            <div
                              key={report.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">
                                      {report.title}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className="bg-green-100 text-green-800 hover:bg-green-100"
                                    >
                                      Completed
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-neutral-dark mt-1">
                                    {report.description}
                                  </p>
                                  <p className="text-sm text-neutral-dark mt-2">
                                    <span className="font-medium">
                                      Location:
                                    </span>{" "}
                                    {report.location.address},{" "}
                                    {report.location.city}
                                  </p>
                                  <p className="text-sm text-neutral-dark mt-1">
                                    <span className="font-medium">
                                      Scheduled for:
                                    </span>{" "}
                                    {report.scheduledDate
                                      ? new Date(
                                          report.scheduledDate
                                        ).toLocaleString()
                                      : "Not scheduled"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-neutral-dark">
                          You haven't completed any pickups yet.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Events</CardTitle>
                      <CardDescription>
                        Join cleanup drives and environmental initiatives in
                        your area.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingEvents ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : events && events.length > 0 ? (
                        <div className="grid gap-4">
                          {events.map((event) => (
                            <div
                              key={event.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex gap-4">
                                <div className="bg-primary/10 rounded-lg p-3 h-fit">
                                  <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">
                                    {event.title}
                                  </h3>
                                  <p className="text-sm text-neutral-dark mt-1">
                                    {event.description}
                                  </p>
                                  <div className="flex flex-wrap gap-4 mt-2">
                                    <div className="text-sm">
                                      <span className="font-medium">Date:</span>{" "}
                                      {new Date(
                                        event.date
                                      ).toLocaleDateString()}{" "}
                                      at{" "}
                                      {new Date(event.date).toLocaleTimeString(
                                        [],
                                        { hour: "2-digit", minute: "2-digit" }
                                      )}
                                    </div>
                                    <div className="text-sm">
                                      <span className="font-medium">
                                        Location:
                                      </span>{" "}
                                      {event.location.address},{" "}
                                      {event.location.city}
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <Button size="sm">Join Event</Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-neutral-dark">
                          No upcoming events found.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="donate">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        <CardTitle>Donate Items</CardTitle>
                      </div>
                      <CardDescription>
                        Donate unused items to those in need and help reduce
                        waste
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-4">
                        <p>The donation form is available on the dedicated Donate page.</p>
                        <div className="flex justify-end mt-4">
                          <Button onClick={() => window.location.href = '/donate'}>
                            Go to Donate Page
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="raise-issue">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        <CardTitle>Report an Issue</CardTitle>
                      </div>
                      <CardDescription>
                        Help keep our environment clean by reporting issues
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RaiseIssueForm />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="seek-help">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="h-5 w-5 text-primary" />
                        <CardTitle>Request Community Help</CardTitle>
                      </div>
                      <CardDescription>
                        Ask for community support with environmental initiatives
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SeekHelpForm />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="leaderboard">
                  <Leaderboard />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Donation Dialog */}
      <Dialog
        open={isDonationDialogOpen}
        onOpenChange={setIsDonationDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Donate Items</DialogTitle>
            <DialogDescription>
              Please use the Donate page to submit donation items.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>The donation form is available on the dedicated Donate page.</p>
            <div className="flex justify-end mt-4">
              <Button onClick={() => window.location.href = '/donate'}>
                Go to Donate Page
              </Button>
            </div>
          </div>
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
    </div>
  );
}
