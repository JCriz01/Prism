import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/utils/signupSchema";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log("running signup component");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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
    } catch (error) {}
  };

  return (
    <div className="flex flex-col h-full mx-9 items-center justify-center">
      <h1 className="text-4xl">Sign Up</h1>
      <p className="text-lg">Create an account to get started</p>

      <Card className=" p-6">
        <CardContent>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div>
              <div className="flex flex-col">
                <Label htmlFor="username">username</Label>
                <Input
                  type="text"
                  id="username"
                  {...register("username")}
                  placeholder="username"
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  {...register("name")}
                  placeholder="name"
                ></Input>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="email"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-col">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  {...register("password")}
                  placeholder="password"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  placeholder="confirm password"
                />
              </div>
            </div>
            <Button className="self-center" type="submit">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
      <p>
        Already have an account? <Link to="/auth/login">Login</Link>
      </p>
    </div>
  );
}
