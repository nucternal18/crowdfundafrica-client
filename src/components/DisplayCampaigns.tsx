import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { v4 as uuidv4 } from "uuid";
import FundCard from "./fund-card";
import { loader } from "../assets";
import { Campaigns } from "@/context/state-context-provider";

type DisplayCampaignsProps = {
  title: string;
  isLoading: boolean;
  campaigns: Campaigns[];
};

const DisplayCampaigns = ({
  title,
  isLoading,
  campaigns,
}: DisplayCampaignsProps) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign: Campaigns) => {
    if (campaign) {
      navigate({
        to: `/campaign-details`,
        params: { campaign: campaign },
      });
    }
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 mt-[20px] gap-5">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campigns yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={uuidv4()}
              campaign={campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
