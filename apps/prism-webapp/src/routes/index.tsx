import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import logoUrl from "../assets/logo.png";
// This is the initial route for the landing page of the website
export const Route = createFileRoute("/")({ component: HomeComponent });

function HomeComponent() {
  const userToken = localStorage.getItem("user-token");
  return (
    <div className="flex flex-col h-full mx-9">
      <header className=" flex justify-between mb-12">
        <Link to="/" className="flex items-center">
          <img src={logoUrl} alt="Prism Logo" />
          <div>Prism</div>
        </Link>
        <nav className="flex items-center justify-evenly grow mx-6">
          <div>Download</div>
          <div>Blog</div>
          <div> Support</div>
        </nav>
        <Button className=" self-center">
          {userToken ? (
            <Link to="/spectrums/home">
              <p>Access Prism</p>
            </Link>
          ) : (
            <Link to="/auth/login">
              <p>Login</p>
            </Link>
          )}
        </Button>
      </header>
      <main className=" w-full flex self-center justify-center items-start grow ">
        <div>A new spin on group hangout servers!</div>
        <div>Image goes here</div>
      </main>
      <footer className="flex self-center">This is a footer </footer>
    </div>
  );
}
