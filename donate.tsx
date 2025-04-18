import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarIcon, InfoIcon } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const donationSchema = z.object({
  donationType: z.string().min(1, "Please select a donation type"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please provide your complete address"),
  city: z.string().min(2, "Please provide your city"),
  pinCode: z.string().min(5, "Please provide a valid PIN code"),
  description: z
    .string()
    .min(10, "Please provide a description of the donation items"),
  condition: z.string().min(1, "Please select the condition of the item"),
  quantity: z.string().min(1, "Please specify the quantity"),
  isPacked: z.string().min(1, "Please indicate if items are packed"),
  isUrgent: z.boolean().default(false),
  date: z.date({
    required_error: "Please select a date for pickup",
  }),
  timeSlot: z.string().min(1, "Please select a time slot"),
  additionalNotes: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

export default function DonatePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donationType: "",
      name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: "",
      city: "",
      pinCode: "",
      description: "",
      condition: "",
      quantity: "",
      isPacked: "",
      isUrgent: false,
      timeSlot: "",
      additionalNotes: "",
    },
  });

  const createDonationMutation = useMutation({
    mutationFn: async (data: DonationFormValues) => {
      const formData = {
        itemName: data.donationType,
        description: data.description,
        category: data.donationType,
        userId: user?.id,
        images: [],
        status: "available",
        condition: data.condition,
        quantity: parseInt(data.quantity) || 1,
        location: {
          basicAddress: data.address,
          city: data.city,
          pinCode: data.pinCode,
        },
        scheduledDate: data.date,
        scheduledTimeSlot: data.timeSlot,
        isPacked: data.isPacked === "yes",
        isUrgent: data.isUrgent,
        additionalNotes: data.additionalNotes,
      };

      const response = await apiRequest("POST", "/api/donations", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Donation submitted successfully",
        description:
          "Thank you for your donation. We'll contact you to arrange a pickup.",
      });
      form.reset();
      setDate(undefined);
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit donation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DonationFormValues) => {
    createDonationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-r from-pink-500 to-purple-700">
        <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
          <div className="max-w-3xl mx-auto text-center px-4">
            <div className="bg-pink-500 p-5 mb-8 rounded-lg">
              <p className="text-xl">
                "One person's clutter is another's treasure. Donate your unused
                items and spread joy."
              </p>
            </div>
            <h1 className="text-4xl font-bold mb-6">Donate Now</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-20 relative z-10 bg-white rounded-lg shadow-lg p-8 mb-12">
        <p className="text-lg mb-6">
          Please fill out the form below, and we'll contact you to arrange a
          pickup.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-pink-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-center mb-4">
                Donation Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Left column fields */}
                <FormField
                  control={form.control}
                  name="donationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donation Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Donation Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="clothing">
                            Clothing & Accessories
                          </SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="books">
                            Books & Educational Materials
                          </SelectItem>
                          <SelectItem value="toys">Toys & Games</SelectItem>
                          <SelectItem value="household">Household Items</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Condition</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like_new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter quantity"
                          type="number"
                          min="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Mobile Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                {/* Right column fields */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your complete address for pickup"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pinCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PIN Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PIN code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isPacked"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Are items packed and ready for pickup?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="p1" />
                            <Label htmlFor="p1">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="p2" />
                            <Label htmlFor="p2">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isUrgent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is this an urgent donation?</FormLabel>
                        <FormDescription>
                          Urgent donations will be prioritized for pickup
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description of item(s) to be donated"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg mt-6 mb-6">
              <h3 className="font-bold mb-2">Pickup Schedule</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Pickup Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setDate(date);
                          }}
                          disabled={(date) => {
                            // Disable past dates and Sundays
                            return (
                              date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                              date.getDay() === 0
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Pickup is not available on Sundays
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time Slot</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="8:00 AM - 10:00 AM">
                          8:00 AM - 10:00 AM
                        </SelectItem>
                        <SelectItem value="10:00 AM - 12:00 PM">
                          10:00 AM - 12:00 PM
                        </SelectItem>
                        <SelectItem value="12:00 PM - 2:00 PM">
                          12:00 PM - 2:00 PM
                        </SelectItem>
                        <SelectItem value="2:00 PM - 4:00 PM">
                          2:00 PM - 4:00 PM
                        </SelectItem>
                        <SelectItem value="4:00 PM - 6:00 PM">
                          4:00 PM - 6:00 PM
                        </SelectItem>
                        <SelectItem value="6:00 PM - 8:00 PM">
                          6:00 PM - 8:00 PM
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special instructions for pickup?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-lg py-6"
              disabled={createDonationMutation.isPending}
            >
              {createDonationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Donate Now <span className="ml-1">❤️</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">Why Donate?</h2>
        <p className="mb-4">
          Your unused items can make a big difference in someone's life. By
          donating, you're helping those in need and reducing waste.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Help families and children in need.</li>
          <li>Reduce clutter and promote sustainability.</li>
          <li>Give items a second life instead of ending up in landfills.</li>
          <li>Support community development and resource sharing.</li>
          <li>
            Tax deductions may be available for your charitable contributions.
          </li>
        </ul>
      </div>
      <Footer />
    </div>
  );
}
