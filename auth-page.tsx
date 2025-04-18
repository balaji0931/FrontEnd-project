import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema, addressSchema } from "@shared/schema";
import { Loader2, UserCircle2, Leaf } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
// Extended schema for client-side validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const passwordRequirements = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

const registerSchema = insertUserSchema
  .extend({
    password: passwordRequirements,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    address: addressSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`);
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
      phone: "",
      role: "customer",
      address: {
        basicAddress: "",
        city: "",
        pinCode: "",
        village: "",
      },
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const verifyEmail = async (email: string) => {
    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setEmailVerified(true);
      toast({
        title: "Success",
        description: "Email verified successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    if (!emailVerified) {
      toast({
        title: "Error",
        description: "Please verify your email first",
        variant: "destructive",
      });
      return;
    }

    // Remove confirmPassword as it's not needed in the API
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-10 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left side - Auth Forms */}
            <div>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">
                    Welcome to Green Path
                  </CardTitle>
                  <CardDescription className="text-center">
                    Join our community of environmental enthusiasts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue={activeTab}
                    onValueChange={setActiveTab}
                    className="mt-2"
                  >
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login">
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">Username or Email</Label>
                            <Input
                              id="username"
                              placeholder="Enter your username or email"
                              {...loginForm.register("username")}
                            />
                            {loginForm.formState.errors.username && (
                              <p className="text-sm text-red-500">
                                {loginForm.formState.errors.username.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Enter your password"
                              {...loginForm.register("password")}
                            />
                            {loginForm.formState.errors.password && (
                              <p className="text-sm text-red-500">
                                {loginForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <a
                              href="#"
                              className="text-sm text-primary hover:underline"
                            >
                              Forgot password?
                            </a>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                              </>
                            ) : (
                              "Log in"
                            )}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>

                    {/* Register Tab */}
                    <TabsContent value="register">
                      <form
                        onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      >
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              placeholder="Enter your full name"
                              {...registerForm.register("fullName")}
                            />
                            {registerForm.formState.errors.fullName && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.fullName.message}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="Your email address"
                                  {...registerForm.register("email")}
                                  disabled={emailVerified}
                                />
                                {!emailVerified && !otpSent && (
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      verifyEmail(
                                        registerForm.getValues("email")
                                      )
                                    }
                                  >
                                    Verify
                                  </Button>
                                )}
                              </div>
                              {registerForm.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                  {registerForm.formState.errors.email.message}
                                </p>
                              )}
                              {otpSent && !emailVerified && (
                                <div className="mt-2">
                                  <Label htmlFor="otp">Enter OTP</Label>
                                  <div className="flex gap-2">
                                    <InputOTP
                                      value={otp}
                                      onChange={setOtp}
                                      maxLength={6}
                                    >
                                      <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                      </InputOTPGroup>
                                    </InputOTP>
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        verifyOtp(
                                          registerForm.getValues("email"),
                                          otp
                                        )
                                      }
                                    >
                                      Verify OTP
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                placeholder="Your phone number"
                                {...registerForm.register("phone")}
                              />
                              {registerForm.formState.errors.phone && (
                                <p className="text-sm text-red-500">
                                  {registerForm.formState.errors.phone.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              placeholder="Choose a username"
                              {...registerForm.register("username")}
                            />
                            {registerForm.formState.errors.username && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.username.message}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="password">Password</Label>
                              <Input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                {...registerForm.register("password")}
                              />
                              {registerForm.formState.errors.password && (
                                <p className="text-sm text-red-500">
                                  {
                                    registerForm.formState.errors.password
                                      .message
                                  }
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">
                                Confirm Password
                              </Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                {...registerForm.register("confirmPassword")}
                              />
                              {registerForm.formState.errors
                                .confirmPassword && (
                                <p className="text-sm text-red-500">
                                  {
                                    registerForm.formState.errors
                                      .confirmPassword.message
                                  }
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Address</Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <Input
                                  placeholder="House number, street name"
                                  {...registerForm.register(
                                    "address.basicAddress"
                                  )}
                                />
                                {registerForm.formState.errors.address
                                  ?.basicAddress && (
                                  <p className="text-sm text-red-500">
                                    {
                                      registerForm.formState.errors.address
                                        .basicAddress.message
                                    }
                                  </p>
                                )}
                              </div>
                              <div>
                                <Input
                                  placeholder="City"
                                  {...registerForm.register("address.city")}
                                />
                                {registerForm.formState.errors.address
                                  ?.city && (
                                  <p className="text-sm text-red-500">
                                    {
                                      registerForm.formState.errors.address.city
                                        .message
                                    }
                                  </p>
                                )}
                              </div>
                              <div>
                                <Input
                                  placeholder="PIN Code"
                                  {...registerForm.register("address.pinCode")}
                                />
                                {registerForm.formState.errors.address
                                  ?.pinCode && (
                                  <p className="text-sm text-red-500">
                                    {
                                      registerForm.formState.errors.address
                                        .pinCode.message
                                    }
                                  </p>
                                )}
                              </div>
                              <div className="col-span-2">
                                <Input
                                  placeholder="Village/Rural Area (if applicable)"
                                  {...registerForm.register("address.village")}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Register as</Label>
                            <RadioGroup
                              defaultValue="customer"
                              className="flex gap-4"
                              onValueChange={(value) =>
                                registerForm.setValue(
                                  "role",
                                  value as
                                    | "customer"
                                    | "dealer"
                                    | "organization"
                                )
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="customer"
                                  id="customer"
                                />
                                <Label htmlFor="customer">Customer</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dealer" id="dealer" />
                                <Label htmlFor="dealer">Dealer</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="organization"
                                  id="organization"
                                />
                                <Label htmlFor="organization">
                                  Organization
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                  {activeTab === "login" ? (
                    <p>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-primary font-medium hover:underline"
                        onClick={() => setActiveTab("register")}
                      >
                        Register
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-primary font-medium hover:underline"
                        onClick={() => setActiveTab("login")}
                      >
                        Log in
                      </button>
                    </p>
                  )}
                </CardFooter>
              </Card>
            </div>

            {/* Right side - Hero */}
            <div className="hidden md:flex flex-col justify-center bg-gradient-to-r from-primary to-[#558B2F] rounded-lg p-8 text-white">
              <div className="flex justify-center mb-6">
                <Leaf className="h-20 w-20" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-center">
                Join the Green Path Movement
              </h2>
              <p className="text-lg mb-6 text-center">
                Be part of a community working together to create a cleaner,
                greener world through responsible waste management and
                donations.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">2500+</div>
                  <div className="text-sm">Waste Pickups</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">4000+</div>
                  <div className="text-sm">Items Donated</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">5000+</div>
                  <div className="text-sm">Active Members</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-start mb-2">
                  <UserCircle2 className="h-6 w-6 mr-2 shrink-0" />
                  <p className="italic">
                    "Green Path has transformed how our community deals with
                    waste. It's not just a platform, it's a movement!"
                  </p>
                </div>
                <p className="text-right text-sm">- Ananya S., Volunteer</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
