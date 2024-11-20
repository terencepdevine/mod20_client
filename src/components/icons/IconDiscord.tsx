import React from "react";

type IconDiscordProps = {
  className?: string;
};

const IconDiscord: React.FC<IconDiscordProps> = ({
  className = "fill-gray-300",
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.29188 0L0.952148 3.43281V17.4625H5.71413V20H8.39267L10.9226 17.4625H14.7916L19.9998 12.2388V0H2.29188ZM18.2142 11.3438L15.2375 14.3281H10.4758L7.94588 16.8656V14.3281H3.92823V1.79062H18.2136V11.3438H18.2142ZM15.2375 5.22375V10.4475H13.4522V5.22375H15.2375ZM10.4755 5.22375V10.4475H8.69022V5.22375H10.4755Z"
      />
    </svg>
  );
};

export default IconDiscord;
