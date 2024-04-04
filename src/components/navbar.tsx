import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import { useStateContext } from "../context/state-context-provider";
import { Button } from "./ui/button";
import { logo, menu, search, thirdweb } from "../assets";
import { navlinks } from "../constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = React.useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = React.useState(false);
  const { connect, address } = useStateContext();
  return (
    <div className="flex md:flex-row top-5 items-center flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row items-center w-full md:max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          type="text"
          placeholder="Search for campaigns"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />

        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>
      <div className="md:flex items-center hidden flex-row justify-end gap-4">
        <Button
          title={address ? "Create a campaign" : "Connect"}
          className={cn(
            "shadow-xl rounded-lg text-lg w-56  text-primary",
            address ? "bg-[#1dc071]" : "bg-[#8c6dfd]",
          )}
          onClick={() => {
            if (address) navigate({ to: "/create-campaign-details" });
            else connect();
          }}
        >
          {address ? "Create a campaign" : "Connect"}
        </Button>

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src={thirdweb}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>
      {/* Small screen navigation */}
      <div className="md:hidden flex justify-between items-center w-full relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"} transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && "bg-[#3a3a43]"}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate({ to: link.link });
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? "grayscale-0" : "grayscale"}`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"}`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <Button
              title={address ? "Create a campaign" : "Connect"}
              className={cn(
                "shadow-xl rounded-lg text-lg text-primary",
                address ? "bg-[#1dc071]" : "bg-[#8c6dfd]",
              )}
              onClick={() => {
                if (address) navigate({ to: "/create-campaign-details" });
                else connect();
              }}
            >
              {address ? "Create a campaign" : "Connect"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
