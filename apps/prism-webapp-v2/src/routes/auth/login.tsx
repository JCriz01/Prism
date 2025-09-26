import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginSchema from "@/utils/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/store/userStore";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginFn } from "@/lib/api/auth";
export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const setUser = useUserStore((state) => state.updateUser);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/login" });
  const [error, setError] = useState({
    message: "",
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginFn,
    retry: 0,
    onSuccess: (data) => {
      localStorage.setItem("user-token", data.token);

      queryClient.setQueryData(["auth", "session"], data.user);

      setUser({
        username: data.user.username,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatarUrl || "",
      });

      console.log("user now is:", user);
      const redirectTo = (search as any).redirect || "/";
      navigate({ to: redirectTo as any });
    },
    onError: (error) => {
      setError({
        message: error.message,
      });
    },
  });

  console.log("user is:", user);

  const submitHandler = async (formData: z.infer<typeof loginSchema>) => {
    setError({ message: "" });
    loginMutation.mutate({
      username: formData.username,
      password: formData.password,
    });
  };

  console.log("errors", errors);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#36393f] p-4">
      <Card className="w-full max-w-md bg-[#2f3136] text-white border-none shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            {/*Logo goes here*/}
            <div className="h-8 w-auto bg-rose-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription className="text-[#b9bbbe]">
            We're so excited to see you again!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-full h-full"
          >
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs font-bold uppercase text-[#b9bbbe]"
              >
                username
              </Label>
              <Input
                id="username"
                type="text"
                className="bg-[#202225] border-none text-white placeholder:text-[#72767d]"
                required
                {...register("username")}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold uppercase text-[#b9bbbe]"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-[#202225] border-none text-white placeholder:text-[#72767d]"
                required
                {...register("password")}
              />
              <Link
                href="/forgot-password"
                className="block text-xs text-[#00aff4] hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div>
              {error.message && (
                <div className="text-red-500 text-sm mb-2">{error.message}</div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-700 text-white py-2"
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </Button>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="border-[#72767d] data-[state=checked]:bg-[#5865f2] data-[state=checked]:border-[#5865f2]"
              />
              <Label htmlFor="remember" className="text-sm text-[#b9bbbe] py-2">
                Remember me
              </Label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-[#b9bbbe]">
            Need an account?{" "}
            <Link to="/auth/signup" className="text-[#00aff4] hover:underline">
              Register
            </Link>
          </div>
          <Separator className="bg-[#42464d]" />
          <div className="flex justify-center space-x-4">
            {/*
            <Link
              to="/terms"
              className="text-xs text-[#b9bbbe] hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-xs text-[#b9bbbe] hover:underline"
            >
              Privacy Policy
            </Link>
            */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
