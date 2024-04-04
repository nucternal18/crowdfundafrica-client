import {
  createFileRoute,
 useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { useStateContext } from "../context/state-context-provider";
import { CountBox } from "../components/count-box";
import { Button } from "@/components/ui/button";
import { Loader } from "../components/loader";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";

export const Route = createFileRoute("/campaign-details")({
  component: CampaignDetails,
});

function CampaignDetails() {
    const selected = useRouterState({
      select: (state) => state.location,
    });
    const navigate = useNavigate();
  const { donate, getDonations, smartContract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState<
    {
      donator: any;
      donation: string;
    }[]
  >([]);

  const remainingDays = daysLeft(selected.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(selected.pId);

    setDonators(data);
  }

//   useEffect(() => {
//     if(smartContract) fetchDonators();
//   }, [smartContract, address])

  const handleDonate = async () => {
    setIsLoading(true);

    donate(state.pId, amount); 

    navigate({to: '/'})
    setIsLoading(false);
  }

  return <div>{isLoading && <Loader />}</div>;
}
