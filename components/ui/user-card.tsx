"use client";
import React, { useState } from "react";

interface Props {
  button: string;
  user: { [key: string]: any };
}

const User_Card: React.FC<Props> = ({ button, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggles the dialog visibility
  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={handleButtonClick}>{button}</button>

      {isOpen && (
        <dialog open>
          <div className="flex flex-col">
            {Object.entries(user).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {String(value)}
              </p>
            ))}
          </div>
          <button onClick={handleButtonClick}>Close</button>
        </dialog>
      )}
    </>
  );
};

export default User_Card;
