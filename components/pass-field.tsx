"use client";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const PassField = ({
  value,
  placeholder = "Password", // Default value for placeholder
  onChange,
}: {
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        id="password"
        placeholder={placeholder} // Uses the default value if not provided
        value={value}
        onChange={onChange} // Link to the form state
        className="p-2 border rounded"
        autoComplete="off"
      />
      <div
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <EyeSlashIcon className="size-4 text-background" />
        ) : (
          <EyeIcon className="size-4 text-background" />
        )}
      </div>
    </div>
  );
};

export default PassField;
