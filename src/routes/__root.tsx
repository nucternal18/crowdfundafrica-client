import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <main className="relative sm:-8 p-4 bg-background min-h-screen flex flex-row ">
      <Sidebar />
      <div className="flex-1 w-full h-full container max-w-screen-xl mx-auto px-4">
        <Navbar />
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </main>
  ),
});
