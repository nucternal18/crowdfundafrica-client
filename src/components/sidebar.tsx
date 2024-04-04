import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import { logo, sun } from "../assets";
import { navlinks } from "../constants";
import { ModeToggle } from "./mode-toggle";


type IconProps = {
  styles?: string;
  name?: string;
  link?: string;
  imgUrl?: string;
  isActive?: string;
  disabled?: boolean;
  handleClick?: () => void;
};

const Icon = ({
  styles,
  name,
  imgUrl,
  link,
  isActive,
  disabled,
  handleClick,
}: IconProps) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && "bg-[#2c2f32]"} flex justify-center items-center ${!disabled && "cursor-pointer"} ${styles}`}
    onClick={handleClick}
  >
    <Link to={link} className="[&.active]:font-bold">
      {!isActive ? (
        <img src={imgUrl} alt="fund_logo" className="w-full" />
      ) : (
        <img
          src={imgUrl}
          alt="fund_logo"
          className={`w-full ${isActive !== name && "grayscale"}`}
        />
      )}
    </Link>
  </div>
);

export function Sidebar() {
  const [isActive, setIsActive] = React.useState("dashboard");
  return (
    <div className="md:flex hidden justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                }
              }}
            />
          ))}
        </div>

        <ModeToggle />
      </div>
    </div>
  );
}
