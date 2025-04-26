import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginSchema from "@/utils/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/store/userStore";
import { z } from "zod";
export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const setUser = useUserStore((state) => state.updateUser);
  const navigate = useNavigate();
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

  const submitHandler = async (formData: z.infer<typeof loginSchema>) => {
    try {
      const res = await fetch("http://localhost:5200/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log(data);

      //store Token in local storage
      if (data.token) {
        localStorage.setItem("user-token", data.token);
        console.log("setting user token, ", data.token);

        //setting user in userStore
        setUser(data.user);

        //redirecting to actual web application root path.
        navigate({ to: "/spectrums/home" });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col h-full mx-9 items-center justify-center">
      <h1 className="text-4xl">Login</h1>
      <p className="text-lg">Get back in the action!</p>

      <Card className=" p-6">
        <CardContent>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col">
              <Label htmlFor="username">username</Label>
              <Input
                type="text"
                id="username"
                {...register("username")}
                placeholder="username"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                {...register("password")}
                placeholder="password"
              />
            </div>

            <Button className="self-center" type="submit">
              Log in
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
