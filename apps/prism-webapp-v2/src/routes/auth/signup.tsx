import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/utils/signupSchema";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [agreed, setAgreed] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  console.log("running signup component");
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });
  const name = watch("name");
  const email = watch("email");
  const username = watch("username");
  const password = watch("password");
  const navigate = useNavigate();

  const submitHandler = async (formData: z.infer<typeof signupSchema>) => {
    console.log("running signup btn handler");
    console.log(formData);

    try {
      const res = await fetch(`http://localhost:5200/api/users/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        navigate({ to: "/" });
      }
      if (!res.ok) {
        console.log("error in signup");
        setError("username", {
          message: data.error.message,
        });
      }
    } catch (error) {}
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#36393f] p-4">
      <div className="w-full max-w-md rounded-md bg-[#2f3136] p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-white">
            Create an account
          </h1>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-bold uppercase text-[#b9bbbe]"
            >
              Name
            </Label>
            <Input
              id="name"
              type="text"
              required
              {...register("name")}
              className="border-[#202225] bg-[#202225] text-white focus-visible:ring-[#5865f2]"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-bold uppercase text-[#b9bbbe]"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              {...register("email")}
              className="border-[#202225] bg-[#202225] text-white focus-visible:ring-[#5865f2]"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-xs font-bold uppercase text-[#b9bbbe]"
            >
              Username
            </Label>
            <Input
              id="username"
              required
              {...register("username")}
              className="border-[#202225] bg-[#202225] text-white focus-visible:ring-[#5865f2]"
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
              required
              {...register("password")}
              className="border-[#202225] bg-[#202225] text-white focus-visible:ring-[#5865f2]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-[#b9bbbe]">
              Date of Birth
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Select value={month} onValueChange={setMonth} required>
                <SelectTrigger className="border-[#202225] bg-[#202225] text-white focus:ring-[#5865f2]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="bg-[#2f3136] text-white">
                  {months.map((m, i) => (
                    <SelectItem
                      key={m}
                      value={m}
                      className="focus:bg-[#5865f2]"
                    >
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={day.toString()} onValueChange={setDay} required>
                <SelectTrigger className="border-[#202225] bg-[#202225] text-white focus:ring-[#5865f2]">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent className="bg-[#2f3136] text-white">
                  {days.map((d) => (
                    <SelectItem
                      key={d}
                      value={d.toString()}
                      className="focus:bg-[#5865f2]"
                    >
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={year.toString()} onValueChange={setYear} required>
                <SelectTrigger className="border-[#202225] bg-[#202225] text-white focus:ring-[#5865f2]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-[#2f3136] text-white">
                  {years.map((y) => (
                    <SelectItem
                      key={y}
                      value={y.toString()}
                      className="focus:bg-[#5865f2]"
                    >
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-start space-x-2 pt-2">
            {errors.username && (
              <div className="text-red-500 text-sm">
                {errors.username.message}
              </div>
            )}
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1 border-[#72767d] data-[state=checked]:bg-[#5865f2] data-[state=checked]:text-white"
            />
            <Label htmlFor="terms" className="text-sm text-[#b9bbbe]">
              I have read and agree to Prism's{" "}
              <Link href="#" className="text-[#00aff4] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#00aff4] hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-700 text-white "
            disabled={
              !name ||
              !email ||
              !username ||
              !password ||
              !month ||
              !day ||
              !year ||
              !agreed
            }
          >
            Continue
          </Button>

          <div className="pt-2 text-center text-sm">
            <Link to="/auth/login" className="text-[#00aff4] hover:underline">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
