"use client";
import React, { useState } from "react";
import "./Switch.css"; // Import custom styles for the switch

// Define the props interface for the Switch component
interface SwitchProps {
  initialState?: boolean;
  onChange?: (newState: boolean, type: string) => void; // Updated onChange type
}

const Switch: React.FC<SwitchProps> = ({ initialState = false, onChange }) => {
  const [isOn, setIsOn] = useState<boolean>(initialState);

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(newState);

    // Determine the type based on the switch state
    const type = newState ? "file" : "text";

    // Call the onChange callback to notify parent component with the new state and type
    if (onChange) {
      onChange(newState, type);
    }
  };

  return (
    <div className="switch-container" onClick={toggleSwitch}>
      <div className={`switch ${isOn ? "on" : "off"}`}>
        <div className="switch-handle"></div>
      </div>
    </div>
  );
};

export default Switch;
