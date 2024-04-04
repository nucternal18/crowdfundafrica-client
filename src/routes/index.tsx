import { createFileRoute } from "@tanstack/react-router";
import { ConnectWallet } from "@thirdweb-dev/react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5 container min-h-screen">
      <div className="text-4xl font-extrabold px-4 ">
        <h1 className="title">Welcome to CrowdFundAfrica</h1>
      </div>
    </div>
  );
}
