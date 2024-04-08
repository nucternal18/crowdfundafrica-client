import React, { useContext, createContext, ReactNode, useMemo } from "react";
import {
  useSendTransaction,
  useReadContract,
  useActiveAccount,
  useConnect,
} from "thirdweb/react";
import { ethers } from "ethers";
import {
  PreparedTransaction,
  prepareContractCall,
  toWei,
} from "thirdweb";
import { Wallet, createWallet, injectedProvider } from "thirdweb/wallets";
import { contract, client } from "../constants/thirdweb";

/**
 * Represents a campaign object.
 */
export type Campaigns = {
  owner: string;
  title: string;
  description: string;
  target: bigint | string;
  deadline: bigint | string | Date;
  amountCollected: bigint | string;
  image: string;
  donators?: readonly string[];
  donations?: readonly bigint[];
};

/**
 * Represents the state of the application.
 */
export interface State {
  address: string;
  campaigns: Readonly<Campaigns[]> | undefined;
  parsedCampaigns: Campaigns[] | undefined;
  isReadingContract: boolean;
  isConnecting: boolean;
  connectionError?: Error | null;
  createCampaign: (form: any) => void;
  handleConnect: () => void;
  getUserCampaigns: () => void;
  donate: (pId: number, amount: string) => void;
  getDonations: (pId: number) => Promise<
    Array<{
      donator: any;
      donation: string;
    }>
  >;
}

/**
 * Context for the current state of the application.
 */
export const CurrentStateContext = createContext<State | null>(null);

/**
 * Provider component for the state context.
 * @param children - The child components.
 */
export const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const account = useActiveAccount();

  const { data: campaigns, isLoading: isReadingContract } = useReadContract({
    contract,
    method: "getCampains",
  });
  const { connect, isConnecting, error: connectionError } = useConnect();

  console.log("🚀 ~ StateContextProvider ~ campaigns:", campaigns)
  /**
   * Parses the campaigns data and returns an array of parsed campaigns.
   * @param campaigns - The campaigns data to be parsed.
   * @returns An array of parsed campaigns.
   */
  const parsedCampaigns = useMemo(() => {
    return campaigns?.map((campaign: any, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toString(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString(),
      ),
      image: campaign.image,
      pId: i,
    }));
  }, [campaigns]);

  /**
   * Provides the state context and functionality for sending transactions.
   */
  const { mutate: sendTransaction, isError } = useSendTransaction();

  const handleConnect = () => {
    connect(async () => {
      const metamask = createWallet("io.metamask"); // pass the wallet id

      // if user has metamask installed, connect to it
      let wallet: Wallet;

      if (injectedProvider("io.metamask")) {
         await metamask.connect({ client });
      } else {
        // open wallet connect modal so user can scan the QR code and connect
         await metamask.connect({
          client,
          walletConnect: { showQrModal: true },
        });
      }

      // return the wallet
      return metamask;
    });
  };

  /**
   * Publishes a campaign.
   * @param form - The campaign form data.
   */
  const publishCampaign = async (form: Partial<Campaigns>) => {
    try {
      const _owner = account?.address as string;
      const _title = form.title as string;
      const _description = form.description as string;
      const _target = form.target as bigint;
      const _deadline = BigInt(new Date(form.deadline as Date).getTime()); // Convert to bigint
      const _image = form.image as string;

      const tx = prepareContractCall({
        contract,
        method: "createCampaign",
        params: [_owner, _title, _description, _target, _deadline, _image],
      });
      console.log("🚀 ~ publishCampaign ~ tx:", tx)
      const transactionResult = await sendTransaction(tx as PreparedTransaction);

      console.log("contract call success", transactionResult);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  /**
   * Retrieves the user's campaigns.
   * @returns The user's campaigns.
   */
  const getUserCampaigns = React.useCallback(async () => {
    const filteredCampaigns = parsedCampaigns?.filter(
      (campaign: any) => campaign.owner === account?.address,
    );

    return filteredCampaigns;
  }, [parsedCampaigns]);

  /**
   * Donates to a campaign.
   * @param pId - The campaign ID.
   * @param amount - The donation amount.
   */
  const donate = async (pId: number, amount: string) => {
    const tx = prepareContractCall({
      contract,
      method: "donateToCampaign",
      params: [BigInt(pId)],
      value: toWei(amount),
    });
    const transactionHash = sendTransaction(tx as PreparedTransaction);
    return transactionHash;
  };

  /**
   * Retrieves the donations for a campaign.
   * @param pId - The campaign ID.
   * @returns The donations for the campaign.
   */
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
    return [];
  };

  return (
    <CurrentStateContext.Provider
      value={{
        address: account?.address as string,
        campaigns,
        parsedCampaigns,
        isReadingContract,
        isConnecting,
        connectionError,
        createCampaign: publishCampaign,
        getUserCampaigns,
        donate,
        getDonations,
        handleConnect,
      }}
    >
      {children}
    </CurrentStateContext.Provider>
  );
};

/**
 * Custom hook to access the state context.
 * @returns The state context.
 */
export const useStateContext = () => {
  const currentStateContext = useContext(CurrentStateContext);

  if (!currentStateContext) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider",
    );
  }

  return currentStateContext;
};
