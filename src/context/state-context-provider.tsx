import React, { useContext, createContext, ReactNode } from "react";
import {
  useSendTransaction,
  useReadContract,
  useActiveAccount,
} from "thirdweb/react";
import { ethers } from "ethers";
import { prepareContractCall, prepareTransaction, toWei } from "thirdweb";
import { contract } from "../constants/thirdweb";

export interface State {
  address: string;
  createCampaign: (form: any) => void;
  getCampaigns: () => void;
  getUserCampaigns: () => void;
  donate: (pId: number, amount: string) => void;
  getDonations: (pId: number) => Promise<
    Array<{
      donator: any;
      donation: string;
    }>
  >;
}

export const CurrentStateContext = createContext<State | null>(null);

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const account = useActiveAccount();
  const { data: campaigns, isLoading: isReadingContract } = useReadContract({
    contract,
    method: "getCampains",
  });

  const parsedCampaigns = campaigns?.map((campaign: any, i: number) => ({
    owner: campaign.owner,
    title: campaign.title,
    description: campaign.description,
    target: ethers.utils.formatEther(campaign.target.toString()),
    deadline: campaign.deadline.toNumber(),
    amountCollected: ethers.utils.formatEther(
      campaign.amountCollected.toString(),
    ),
    image: campaign.image,
    pId: i,
  }));

  const { mutate: sendTransaction, isError } = useSendTransaction();

  const publishCampaign = async (form: any) => {
    try {
      const _owner = account?.address as string;
      const _title = form.title;
      const _description = form.description;
      const _target = form.target;
      const _deadline = BigInt(new Date(form.deadline).getTime()); // Convert to bigint
      const _image = form.image;

      const tx = prepareContractCall({
        contract,
        method: "createCampaign",
        params: [_owner, _title, _description, _target, _deadline, _image],
      });
      const transactionResult = sendTransaction(tx);

      console.log("contract call success", transactionResult);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getUserCampaigns = React.useCallback(async () => {
    const filteredCampaigns = parsedCampaigns?.filter(
      (campaign: any) => campaign.owner === account?.address,
    );

    return filteredCampaigns;
  }, [parsedCampaigns]);

  const donate = async (pId: number, amount: string) => {
    const tx = prepareContractCall({
      contract,
      method: "donateToCampaign",
      params: [BigInt(pId)],
    });
    const transactionHash = sendTransaction(tx);
    return transactionHash;
  };

  const getDonations = async (pId: number) => {
    const donations = prepareContractCall({
      contract,
      method: "getDonators",
      params: [BigInt(pId)],
    });
    const numberOfDonations = donations.value;
    console.log("🚀 ~ getDonations ~ numberOfDonations:", numberOfDonations);

    const parsedDonations = [];

    // for (let i = 0; i < numberOfDonations; i++) {
    //   parsedDonations.push({
    //     donator: donations[0][i],
    //     donation: ethers.utils.formatEther(donations[1][i].toString()),
    //   });
    // }

    // return parsedDonations;
  };

  return (
    <CurrentStateContext.Provider
      value={{
        address,
        smartContract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </CurrentStateContext.Provider>
  );
};

export const useStateContext = () => {
  const currentStateContext = useContext(CurrentStateContext);

  if (!currentStateContext) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider",
    );
  }

  return currentStateContext;
};
