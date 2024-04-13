import {
  createThirdwebClient,
  getContract,
  resolveMethod,
  defineChain,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";

// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID as string,
});

const CONTRACT_ADDRESS = "0x4707D405B98b684b175BD4aC206e07c70E958922";

const contractABI = [
  {
    type: "constructor",
    name: "",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "campaigns",
    inputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        type: "address",
        name: "owner",
        internalType: "address",
      },
      {
        type: "string",
        name: "title",
        internalType: "string",
      },
      {
        type: "string",
        name: "description",
        internalType: "string",
      },
      {
        type: "uint256",
        name: "target",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "deadline",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "amountCollected",
        internalType: "uint256",
      },
      {
        type: "string",
        name: "image",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createCampaign",
    inputs: [
      {
        type: "address",
        name: "_owner",
        internalType: "address",
      },
      {
        type: "string",
        name: "_title",
        internalType: "string",
      },
      {
        type: "string",
        name: "_description",
        internalType: "string",
      },
      {
        type: "uint256",
        name: "_target",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "_deadline",
        internalType: "uint256",
      },
      {
        type: "string",
        name: "_image",
        internalType: "string",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "donateToCampaign",
    inputs: [
      {
        type: "uint256",
        name: "_campaignId",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getCampaign",
    inputs: [
      {
        type: "uint256",
        name: "_campaignId",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        type: "tuple",
        name: "",
        components: [
          {
            type: "address",
            name: "owner",
            internalType: "address",
          },
          {
            type: "string",
            name: "title",
            internalType: "string",
          },
          {
            type: "string",
            name: "description",
            internalType: "string",
          },
          {
            type: "uint256",
            name: "target",
            internalType: "uint256",
          },
          {
            type: "uint256",
            name: "deadline",
            internalType: "uint256",
          },
          {
            type: "uint256",
            name: "amountCollected",
            internalType: "uint256",
          },
          {
            type: "string",
            name: "image",
            internalType: "string",
          },
          {
            type: "address[]",
            name: "donators",
            internalType: "address[]",
          },
          {
            type: "uint256[]",
            name: "donations",
            internalType: "uint256[]",
          },
        ],
        internalType: "struct CrowdFundinAfrica.Campaign",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCampains",
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        name: "",
        components: [
          {
            type: "address",
            name: "owner",
            internalType: "address",
          },
          {
            type: "string",
            name: "title",
            internalType: "string",
          },
          {
            type: "string",
            name: "description",
            internalType: "string",
          },
          {
            type: "uint256",
            name: "target",
            internalType: "uint256",
          },
          {
            type: "uint256",
            name: "deadline",
            internalType: "uint256",
          },
          {
            type: "uint256",
            name: "amountCollected",
            internalType: "uint256",
          },
          {
            type: "string",
            name: "image",
            internalType: "string",
          },
          {
            type: "address[]",
            name: "donators",
            internalType: "address[]",
          },
          {
            type: "uint256[]",
            name: "donations",
            internalType: "uint256[]",
          },
        ],
        internalType: "struct CrowdFundinAfrica.Campaign[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDonators",
    inputs: [
      {
        type: "uint256",
        name: "_campaignId",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        type: "address[]",
        name: "",
        internalType: "address[]",
      },
      {
        type: "uint256[]",
        name: "",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "numberOfCampaigns",
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeCampaign",
    inputs: [
      {
        type: "uint256",
        name: "_campaignId",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateCampaign",
    inputs: [
      {
        type: "uint256",
        name: "_campaignId",
        internalType: "uint256",
      },
      {
        type: "string",
        name: "_title",
        internalType: "string",
      },
      {
        type: "string",
        name: "_description",
        internalType: "string",
      },
      {
        type: "uint256",
        name: "_target",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "_deadline",
        internalType: "uint256",
      },
      {
        type: "string",
        name: "_image",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// connect to your contract
export const contract = getContract({
  client,
  chain: sepolia,
  address: CONTRACT_ADDRESS,
  abi: contractABI,
});
