"use client";

import type React from "react";
import { useRef } from "react";
import html2canvas from "html2canvas";
interface MacroNutrient {
  name: string;
  amount: number;
  unit: string;
  dailyValue?: number;
}

interface MacroNutrientLabelProps {
  servingSize: string;
  calories: number;
  macros: MacroNutrient[];
  name: string;
  value: number;
  unit: string;
}

const MacroNutrientLabel: React.FC<MacroNutrientLabelProps> = ({
  servingSize,
  calories,
  macros,
}) => {
  const labelRef = useRef<HTMLDivElement>(null);

  const downloadAsImage = async () => {
    if (labelRef.current) {
      const canvas = await html2canvas(labelRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "macro-nutrient-label.png";
      link.click();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="header">
        <h1 className="text-2xl font-bold">Nutrition Facts</h1>
      </div>
      <div ref={labelRef} className="content bg-white p-4 rounded-md">
        <div className="border-b-2 border-black pb-2 mb-2">
          <p className="text-sm">Serving Size {servingSize}</p>
        </div>
        <div className="border-b-8 border-black pb-2 mb-2">
          <p className="text-3xl font-bold">Calories {calories}</p>
        </div>
        <div className="text-right text-sm mb-2">% Daily Value*</div>
        {macros.map((macro, index) => (
          <div
            key={index}
            className="flex justify-between border-t border-gray-300 py-1"
          >
            <span>
              <strong>{macro.name}</strong> {macro.amount}
              {macro.unit}
            </span>
            {macro.dailyValue && (
              <span>
                <strong>{macro.dailyValue}%</strong>
              </span>
            )}
          </div>
        ))}
        <div className="text-xs mt-4">
          * Percent Daily Values are based on a 2,000 calorie diet.
        </div>
      </div>
      <div>
        <button onClick={downloadAsImage} className="w-full">
          Download as Image
        </button>
      </div>
    </div>
  );
};

export default MacroNutrientLabel;
