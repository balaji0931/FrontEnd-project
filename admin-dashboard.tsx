import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User as UserIcon, Truck, Building2, CalendarClock, Leaf, Droplets, TreePine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent 
} from "@/components/ui/chart";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");

  // Add feedback data fetching
  const { data: feedbackList, isLoading: isLoadingFeedback } = useQuery({
    queryKey: ["/api/feedback"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch feedback");
      return await res.json();
    },
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    },
  });

  const { data: wasteReports, isLoading: isLoadingReports } = useQuery({
    queryKey: ["/api/waste-reports"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch reports");
      return await res.json();
    },
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["/api/events"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch events");
      return await res.json();
    },
  });

  const { data: donations, isLoading: isLoadingDonations } = useQuery({
    queryKey: ["/api/donations"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch donations");
      return await res.json();
    },
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json();
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number, role: string }) => {
      return await apiRequest("PUT", `/api/users/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "User Updated",
        description: "User role has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const updateFeedbackMutation = useMutation({
    mutationFn: async ({ id, status, adminResponse }: { id: number, status: string, adminResponse?: string }) => {
      return await apiRequest("PUT", `/api/feedback/${id}`, { status, adminResponse });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({
        title: "Feedback Updated",
        description: "Feedback has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update feedback",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Group users by role
  const customers = users?.filter(u => u.role === 'customer') || [];
  const dealers = users?.filter(u => u.role === 'dealer') || [];
  const organizations = users?.filter(u => u.role === 'organization') || [];
  const admins = users?.filter(u => u.role === 'admin') || [];
  
  // Environmental Impact Dashboard Component
  function EnvironmentalImpactDashboard() {
    const { data: environmentalImpact, isLoading } = useQuery({
      queryKey: ["/api/environmental-impact"],
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string);
        if (!res.ok) throw new Error("Failed to fetch environmental impact data");
        return await res.json();
      },
    });

    // Chart color scheme
    const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#795548'];
    
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        {/* Environmental Impact Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Leaf className="h-12 w-12 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-dark">Carbon Offset</p>
                  <h3 className="text-2xl font-bold">{environmentalImpact?.carbonOffset || 0} kg</h3>
                  <p className="text-xs text-muted-foreground">CO₂ emissions saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Droplets className="h-12 w-12 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-dark">Water Saved</p>
                  <h3 className="text-2xl font-bold">{environmentalImpact?.waterSaved || 0} L</h3>
                  <p className="text-xs text-muted-foreground">Through recycling efforts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TreePine className="h-12 w-12 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-dark">Trees Equivalent</p>
                  <h3 className="text-2xl font-bold">{environmentalImpact?.treesEquivalent || 0}</h3>
                  <p className="text-xs text-muted-foreground">Annual CO₂ absorption</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Waste by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Waste by Category</CardTitle>
              <CardDescription>
                Distribution of recycled waste by material type
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={environmentalImpact?.wasteByCategory || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {environmentalImpact?.wasteByCategory.map((entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} kg`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Waste Collection Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Waste Collection Trend</CardTitle>
              <CardDescription>
                Monthly waste collection activity over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={environmentalImpact?.wasteCollectionTrend || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} items`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4caf50" 
                    activeDot={{ r: 8 }} 
                    name="Waste Collected"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Segregated vs Mixed Waste */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Segregated vs Mixed Waste</CardTitle>
              <CardDescription>
                Comparison of segregated and mixed waste collection
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={environmentalImpact?.monthlyWasteData || []}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="segregated" 
                    stackId="1"
                    stroke="#4caf50" 
                    fill="#4caf50" 
                    name="Segregated Waste"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mixed" 
                    stackId="1"
                    stroke="#ff9800" 
                    fill="#ff9800" 
                    name="Mixed Waste"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Donations by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Donations by Category</CardTitle>
              <CardDescription>
                Distribution of donated items by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={environmentalImpact?.donationsByCategory || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} items`} />
                  <Legend />
                  <Bar dataKey="value" fill="#2196f3" name="Donations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Social Impact Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Social Impact</CardTitle>
            <CardDescription>
              Measuring the platform's social impact on communities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {environmentalImpact?.socialImpactMetrics.map((metric: { name: string; value: number }, index: number) => (
                <div key={index} className="border rounded-lg p-4 text-center">
                  <h4 className="text-sm font-medium mb-2">{metric.name}</h4>
                  <p className="text-2xl font-bold text-primary">{metric.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F5F5F5] py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-darker mb-2">
              Admin Dashboard
            </h1>
            <p className="text-neutral-dark">
              Manage users, monitor system performance, and oversee all platform activities.
            </p>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-10 w-10 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Total Users</p>
                    <h3 className="text-2xl font-bold">{users?.length || 0}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Truck className="h-10 w-10 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Pickups Completed</p>
                    <h3 className="text-2xl font-bold">{stats?.pickupsCompleted || 0}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-10 w-10 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Items Donated</p>
                    <h3 className="text-2xl font-bold">{stats?.itemsDonated || 0}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CalendarClock className="h-10 w-10 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Events Organized</p>
                    <h3 className="text-2xl font-bold">{stats?.communityEvents || 0}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full md:w-auto">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="reports">Waste Reports</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all users registered on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Customers */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Customers ({customers.length})</h3>
                        <div className="grid gap-4">
                          {customers.map((customer) => (
                            <div key={customer.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{customer.fullName}</h4>
                                    <Badge variant="outline">Customer</Badge>
                                  </div>
                                  <p className="text-sm text-neutral-dark">{customer.email}</p>
                                  <p className="text-sm">
                                    <span className="font-medium">Username:</span> {customer.username}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Social Points:</span> {customer.socialPoints}
                                  </p>
                                </div>
                                <div className="space-x-2">
                                  <Button size="sm" variant="outline"
                                    onClick={() => updateUserRoleMutation.mutate({
                                      id: customer.id,
                                      role: 'dealer'
                                    })}
                                  >
                                    Make Dealer
                                  </Button>
                                  <Button size="sm" variant="outline"
                                    onClick={() => updateUserRoleMutation.mutate({
                                      id: customer.id,
                                      role: 'organization'
                                    })}
                                  >
                                    Make Organization
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Dealers */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Dealers ({dealers.length})</h3>
                        <div className="grid gap-4">
                          {dealers.map((dealer) => (
                            <div key={dealer.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{dealer.fullName}</h4>
                                    <Badge variant="outline">Dealer</Badge>
                                  </div>
                                  <p className="text-sm text-neutral-dark">{dealer.email}</p>
                                  <p className="text-sm">
                                    <span className="font-medium">Username:</span> {dealer.username}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Social Points:</span> {dealer.socialPoints}
                                  </p>
                                </div>
                                <div className="space-x-2">
                                  <Button size="sm" variant="outline"
                                    onClick={() => updateUserRoleMutation.mutate({
                                      id: dealer.id,
                                      role: 'customer'
                                    })}
                                  >
                                    Make Customer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Organizations */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Organizations ({organizations.length})</h3>
                        <div className="grid gap-4">
                          {organizations.map((org) => (
                            <div key={org.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{org.fullName}</h4>
                                    <Badge variant="outline">Organization</Badge>
                                  </div>
                                  <p className="text-sm text-neutral-dark">{org.email}</p>
                                  <p className="text-sm">
                                    <span className="font-medium">Username:</span> {org.username}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Social Points:</span> {org.socialPoints}
                                  </p>
                                </div>
                                <div className="space-x-2">
                                  <Button size="sm" variant="outline"
                                    onClick={() => updateUserRoleMutation.mutate({
                                      id: org.id,
                                      role: 'customer'
                                    })}
                                  >
                                    Make Customer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Admins */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Administrators ({admins.length})</h3>
                        <div className="grid gap-4">
                          {admins.map((admin) => (
                            <div key={admin.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{admin.fullName}</h4>
                                    <Badge>Admin</Badge>
                                  </div>
                                  <p className="text-sm text-neutral-dark">{admin.email}</p>
                                  <p className="text-sm">
                                    <span className="font-medium">Username:</span> {admin.username}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Waste Reports</CardTitle>
                  <CardDescription>
                    View all waste reports submitted by users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingReports ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : wasteReports && wasteReports.length > 0 ? (
                    <div className="grid gap-4">
                      {wasteReports.map((report: any) => (
                        <div key={report.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{report.title}</h3>
                                <Badge variant={
                                  report.status === "completed" ? "default" :
                                  report.status === "rejected" ? "destructive" :
                                  "outline"
                                }>
                                  {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-neutral-dark mt-1">{report.description}</p>
                              <div className="grid grid-cols-2 gap-x-4 mt-2">
                                <p className="text-sm">
                                  <span className="font-medium">User ID:</span> {report.userId}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Location:</span> {report.location.address}, {report.location.city}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Created:</span> {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Dealer:</span> {report.assignedDealerId || 'Not assigned'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-dark">
                      No waste reports found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle>Donations</CardTitle>
                  <CardDescription>
                    View all donations listed on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingDonations ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : donations && donations.length > 0 ? (
                    <div className="grid gap-4">
                      {donations.map((donation: any) => (
                        <div key={donation.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{donation.itemName}</h3>
                                <Badge variant={
                                  donation.status === "available" ? "outline" :
                                  donation.status === "completed" ? "default" :
                                  "secondary"
                                }>
                                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-neutral-dark mt-1">{donation.description}</p>
                              <div className="grid grid-cols-2 gap-x-4 mt-2">
                                <p className="text-sm">
                                  <span className="font-medium">User ID:</span> {donation.userId}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Category:</span> {donation.category}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Created:</span> {new Date(donation.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Requested By:</span> {donation.requestedByOrganizationId || 'None'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-dark">
                      No donations found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Events</CardTitle>
                  <CardDescription>
                    View all events organized by organizations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingEvents ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : events && events.length > 0 ? (
                    <div className="grid gap-4">
                      {events.map((event: any) => (
                        <div key={event.id} className="border rounded-lg p-4">
                          <div className="flex gap-4">
                            <div className="bg-primary/10 rounded-lg p-3 h-fit">
                              <CalendarClock className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{event.title}</h3>
                                  <p className="text-sm text-neutral-dark mt-1">{event.description}</p>
                                  <div className="grid grid-cols-2 gap-x-4 mt-2">
                                    <p className="text-sm">
                                      <span className="font-medium">Organizer ID:</span> {event.organizerId}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Status:</span> {event.status}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Location:</span> {event.location.address}, {event.location.city}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant={
                                  event.status === "upcoming" ? "outline" :
                                  event.status === "completed" ? "default" :
                                  event.status === "cancelled" ? "destructive" :
                                  "secondary"
                                }>
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-dark">
                      No events found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>User Feedback</CardTitle>
                  <CardDescription>
                    View and manage feedback submitted by users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingFeedback ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : feedbackList && feedbackList.length > 0 ? (
                    <div className="grid gap-4">
                      {feedbackList.map((feedback: any) => (
                        <div key={feedback.id} className="border rounded-lg p-4">
                          <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">Feedback #{feedback.id}</h3>
                                  <Badge variant={
                                    feedback.status === "unread" ? "destructive" :
                                    feedback.status === "read" ? "outline" :
                                    feedback.status === "addressed" ? "default" :
                                    "secondary"
                                  }>
                                    {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                                  </Badge>
                                  <Badge variant="outline">{feedback.feedbackType}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-2">
                                  <p className="text-sm">
                                    <span className="font-medium">From User:</span> {feedback.userId}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Created:</span> {new Date(feedback.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                {feedback.status === "unread" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => 
                                      updateFeedbackMutation.mutate({
                                        id: feedback.id,
                                        status: "read"
                                      })
                                    }
                                  >
                                    Mark as Read
                                  </Button>
                                )}
                                {feedback.status === "read" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => 
                                      updateFeedbackMutation.mutate({
                                        id: feedback.id,
                                        status: "addressed",
                                        adminResponse: "Thank you for your feedback. We have reviewed it and will take appropriate action."
                                      })
                                    }
                                  >
                                    Mark as Addressed
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-sm font-medium mb-1">Feedback Content:</p>
                              <p className="text-sm">{feedback.content}</p>
                            </div>
                            
                            {feedback.adminResponse && (
                              <div className="bg-muted p-3 rounded-md border-l-4 border-primary">
                                <p className="text-sm font-medium mb-1">Admin Response:</p>
                                <p className="text-sm">{feedback.adminResponse}</p>
                              </div>
                            )}
                            
                            {feedback.status === "read" && !feedback.adminResponse && (
                              <div className="mt-2">
                                <textarea
                                  className="w-full p-2 border rounded-md text-sm"
                                  rows={3}
                                  placeholder="Type your response here..."
                                  id={`response-${feedback.id}`}
                                ></textarea>
                                <Button 
                                  className="mt-2" 
                                  size="sm"
                                  onClick={() => {
                                    const responseElement = document.getElementById(`response-${feedback.id}`) as HTMLTextAreaElement;
                                    if (responseElement && responseElement.value) {
                                      updateFeedbackMutation.mutate({
                                        id: feedback.id,
                                        status: "addressed",
                                        adminResponse: responseElement.value
                                      });
                                    } else {
                                      toast({
                                        title: "Empty Response",
                                        description: "Please write a response before submitting.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  Send Response
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-dark">
                      No feedback found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact Analytics</CardTitle>
                  <CardDescription>
                    View detailed analytics and visualizations of the platform's environmental impact.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EnvironmentalImpactDashboard />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platform-stats">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>
                    View statistics and analytics about the platform usage.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">User Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Customers</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full"
                                      style={{ width: `${customers.length / (users?.length || 1) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{customers.length}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Dealers</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-600 rounded-full"
                                      style={{ width: `${dealers.length / (users?.length || 1) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{dealers.length}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Organizations</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-600 rounded-full"
                                      style={{ width: `${organizations.length / (users?.length || 1) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{organizations.length}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Admins</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-orange-600 rounded-full"
                                      style={{ width: `${admins.length / (users?.length || 1) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{admins.length}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">System Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">Total Waste Reports</p>
                                  <span className="font-medium">{wasteReports?.length || 0}</span>
                                </div>
                                <div className="mt-1 flex justify-between text-xs text-neutral-dark">
                                  <span>Completed: {wasteReports?.filter((r: any) => r.status === 'completed').length || 0}</span>
                                  <span>Pending: {wasteReports?.filter((r: any) => r.status === 'pending').length || 0}</span>
                                  <span>In Progress: {wasteReports?.filter((r: any) => r.status === 'in_progress').length || 0}</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">Total Donations</p>
                                  <span className="font-medium">{donations?.length || 0}</span>
                                </div>
                                <div className="mt-1 flex justify-between text-xs text-neutral-dark">
                                  <span>Available: {donations?.filter((d: any) => d.status === 'available').length || 0}</span>
                                  <span>Requested: {donations?.filter((d: any) => d.status === 'requested').length || 0}</span>
                                  <span>Completed: {donations?.filter((d: any) => d.status === 'completed').length || 0}</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">Total Events</p>
                                  <span className="font-medium">{events?.length || 0}</span>
                                </div>
                                <div className="mt-1 flex justify-between text-xs text-neutral-dark">
                                  <span>Upcoming: {events?.filter((e: any) => e.status === 'upcoming').length || 0}</span>
                                  <span>Ongoing: {events?.filter((e: any) => e.status === 'ongoing').length || 0}</span>
                                  <span>Completed: {events?.filter((e: any) => e.status === 'completed').length || 0}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}