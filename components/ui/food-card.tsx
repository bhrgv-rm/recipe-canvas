import React from "react";
import "@/components/components.css";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
interface RecipeProps {
  id: string;
  title: string;
  image: string;
  ingredients: string[];
  steps: string[];
  nutritionalFacts?: Record<string, string>;
  difficulty?: number;
  cookingTime?: number;
  preparationTips: string[];
  createdAt: string;
  updatedAt: string;
}

const RecipeCard: React.FC<{ recipe: RecipeProps }> = ({ recipe }) => {
  return (
    <div className="w-1/2 flex mx-auto max-h-[75dvh] bg-background text-foreground shadow-lg rounded overflow-hidden border border-foreground relative">
      <XMarkIcon className="cursor-pointer right-3 top-3 absolute size-5 text-foreground bg-background rounded" />
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-1/2 object-cover"
      />

      {/* Recipe Content (Right Side) */}
      <div className="right w-1/2 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold">{recipe.title}</h2>

        {/* Difficulty, Time & Nutritional Facts */}
        <div className="flex justify-between items-center mt-2 text-sm">
          <div className="flex items-center">
            <span className="mr-1">Difficulty:</span>
            <span className="font-medium">
              {recipe.difficulty ? recipe.difficulty : "N/A"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">Time</span>
            <span className="font-medium">
              - {recipe.cookingTime ? recipe.cookingTime + " mins" : "N/A"}
            </span>
          </div>
        </div>
        <div className="mt-4 text-xs">
          <p>Created: {new Date(recipe.createdAt).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
        </div>

        {/* Ingredients */}
        <div className="mt-4">
          <h3 className="text-lg font-medium ">Ingredients:</h3>
          <ul className="list-disc pl-6 space-y-1">
            {recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))
            ) : (
              <li>No ingredients listed</li>
            )}
          </ul>
        </div>

        {/* Preparation Tips */}
        {recipe.preparationTips.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Preparation Tips:</h3>
            <ul className="list-disc pl-6 space-y-1">
              {recipe.preparationTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps */}
        <div className="mt-4">
          <h3 className="text-lg font-medium">Steps:</h3>
          <ol className="list-decimal pl-6 space-y-2">
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Nutritional Facts (optional) */}
        {recipe.nutritionalFacts && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Nutritional Facts:</h3>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(recipe.nutritionalFacts, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
