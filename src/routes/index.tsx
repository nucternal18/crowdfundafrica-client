import { createFileRoute } from "@tanstack/react-router";
import { Campaigns, useStateContext } from "@/context/state-context-provider";
import DisplayCampaigns from "@/components/DisplayCampaigns";
import { Loader } from "@/components/loader";

export const Route = createFileRoute("/")({
  component: Index,
});

/**
 * Renders the index page of the application.
 *
 * @returns The JSX element representing the index page.
 */
function Index() {
  const { parsedCampaigns, isReadingContract } = useStateContext();

  if (isReadingContract) return <Loader />;
  
  return (
    <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5 container min-h-screen">
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isReadingContract}
        campaigns={parsedCampaigns as Campaigns[]}
      />
    </div>
  );
}
