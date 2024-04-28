import React from "react";

function Button({
  buttonText,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 rounded-full hover:bg-blue-700 active:scale-95 duration-200 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {buttonText}
    </button>
  );
}

export default Button;
