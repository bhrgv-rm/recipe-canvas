"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Switch from "./Switch";
import { imageToBase64 } from "@/utils/image_uri";

const NUTRITIONAL_FACTS_OPTIONS = [
  { id: "calories", label: "Calories" },
  { id: "totalFat", label: "Total Fat (g)" },
  { id: "sugars", label: "Sugars (g)" },
  { id: "protein", label: "Protein (g)" },
  { id: "carbohydrates", label: "Carbohydrates (g)" },
  { id: "cholesterol", label: "Cholesterol (mg)" },
  { id: "sodium", label: "Sodium (mg)" },
];

export default function NewRecipe() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    ingredients: [""],
    steps: [""],
    difficulty: 1,
    cookingTime: 30,
    preparationTips: [""],
    nutritionalFacts: {
      servingSize: "",
      calories: 0,
      totalFat: 0,
      sugars: 0,
      protein: 0,
      carbohydrates: 0,
      cholesterol: 0,
      sodium: 0,
    },
  });

  // Errors state
  const [errors, setErrors] = useState({
    title: "",
    image: "",
    ingredients: "",
    steps: "",
    difficulty: "",
    cookingTime: "",
  });

  // Additional state variables
  const [switchState, setSwitchState] = useState<boolean>(false);
  const [inputType, setInputType] = useState<string>("text");
  const [selectedNutritionalFact, setSelectedNutritionalFact] =
    useState<string>("");
  const [nutritionalFactValue, setNutritionalFactValue] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Improved URL validation function
  const isValidImageUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      // Check for common image file extensions
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
        ".svg",
      ];
      return (
        (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") &&
        imageExtensions.some((ext) =>
          parsedUrl.pathname.toLowerCase().endsWith(ext)
        )
      );
    } catch {
      return false;
    }
  };

  // Handle switch change for image input type
  const handleSwitchChange = (newState: boolean, type: string) => {
    setSwitchState(newState);
    setInputType(type);
    // Reset image-related states when switching
    setFormData((prev) => ({ ...prev, image: "" }));
    setImageFile(null);
    // Clear image errors when switching
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  // Add ingredient input
  const addIngredient = () => {
    const lastIngredient =
      formData.ingredients[formData.ingredients.length - 1];
    if (lastIngredient.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ""],
      }));
    }
  };

  // Add step input
  const addStep = () => {
    const lastStep = formData.steps[formData.steps.length - 1];
    if (lastStep.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        steps: [...prev.steps, ""],
      }));
    }
  };

  // Add preparation tip input
  const addPreparationTip = () => {
    const lastTip =
      formData.preparationTips[formData.preparationTips.length - 1];
    if (lastTip.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        preparationTips: [...prev.preparationTips, ""],
      }));
    }
  };

  // Handle ingredient change
  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  // Handle step change
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData((prev) => ({
      ...prev,
      steps: newSteps,
    }));
  };

  // Handle preparation tip change
  const handlePreparationTipChange = (index: number, value: string) => {
    const newTips = [...formData.preparationTips];
    newTips[index] = value;
    setFormData((prev) => ({
      ...prev,
      preparationTips: newTips,
    }));
  };

  // Handle nutritional fact selection
  const handleNutritionalFactChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedNutritionalFact(e.target.value);
  };

  // Add nutritional fact
  const addNutritionalFact = () => {
    if (selectedNutritionalFact && nutritionalFactValue) {
      setFormData((prev) => ({
        ...prev,
        nutritionalFacts: {
          ...prev.nutritionalFacts,
          [selectedNutritionalFact]: nutritionalFactValue,
        },
      }));

      setSelectedNutritionalFact("");
      setNutritionalFactValue(0);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      if (inputType === "file" && files?.[0]) {
        try {
          setImageFile(files[0]);

          const base64Image = await imageToBase64(files[0]);
          setFormData((prev) => ({ ...prev, image: base64Image }));
          setErrors((prev) => ({ ...prev, image: "" }));
        } catch (error) {
          setSubmitError("Failed to convert image to base64.");
          setErrors((prev) => ({ ...prev, image: "Failed to process image" }));
        }
      } else if (inputType === "text") {
        // Allow typing freely, but validate on submission
        setFormData((prev) => ({ ...prev, image: value }));
        setErrors((prev) => ({ ...prev, image: "" }));
      }
      return; // Exit early for image handling
    }

    // Rest of the existing handleChange logic for other fields
    let errorMessage = "";
    switch (name) {
      case "title":
        errorMessage =
          value.length < 3 ? "Title must be at least 3 characters" : "";
        break;
      case "difficulty":
        errorMessage =
          parseInt(value) < 1 || parseInt(value) > 5
            ? "Difficulty must be between 1 and 5"
            : "";
        break;
      case "cookingTime":
        errorMessage =
          parseInt(value) <= 0 ? "Cooking time must be greater than 0" : "";
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Modify the handleSubmit function to include URL validation
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSubmitError("");
    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    const newErrors = {
      title:
        formData.title.length < 3 ? "Title must be at least 3 characters" : "",
      image:
        inputType === "text" &&
        formData.image !== "" &&
        !isValidImageUrl(formData.image)
          ? "Please enter a valid image URL (must end with .jpg, .png, etc.)"
          : "",
      ingredients: formData.ingredients.some((ing) => ing.trim() === "")
        ? "All ingredients must be filled"
        : "",
      steps: formData.steps.some((step) => step.trim() === "")
        ? "All steps must be filled"
        : "",
      difficulty:
        formData.difficulty < 1 || formData.difficulty > 5
          ? "Difficulty must be between 1 and 5"
          : "",
      cookingTime:
        formData.cookingTime <= 0 ? "Cooking time must be greater than 0" : "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      try {
        const response = await axios.post("/api/create-recipe", {
          ...formData,
          ingredients: formData.ingredients.filter((ing) => ing.trim() !== ""),
          steps: formData.steps.filter((step) => step.trim() !== ""),
          preparationTips: formData.preparationTips.filter(
            (tip) => tip.trim() !== ""
          ),
        });

        router.push("/");
      } catch (error) {
        setSubmitError(
          axios.isAxiosError(error)
            ? error.response?.data?.message || "API request failed"
            : "An unexpected error occurred"
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div className="r-title">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-2 border ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* Image Input */}
      <div className="r-image">
        <div className="mb-2 flex gap-2 items-center">
          Image URL
          <Switch initialState={switchState} onChange={handleSwitchChange} />
          Image File
        </div>
        <input
          type={inputType}
          name="image"
          placeholder="Enter Image URL (must be .jpg, .png, etc.)"
          value={inputType === "text" ? formData.image : undefined}
          onChange={handleChange}
          className={`w-full p-2 border ${
            errors.image ? "border-red-500" : "border-gray-300"
          }`}
          autoComplete="off"
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
      </div>

      {/* Ingredients Input */}
      <div className="r-ingredients">
        <label className="block mb-2">Ingredients</label>
        {formData.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Ingredient ${index + 1}`}
            value={ingredient}
            onChange={(e) => handleIngredientChange(index, e.target.value)}
            className="w-full p-2 border mb-2"
          />
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="px-4 py-2 rounded"
        >
          Add Ingredient
        </button>
        {errors.ingredients && (
          <p className="text-red-500 text-sm">{errors.ingredients}</p>
        )}
      </div>

      {/* Steps Input */}
      <div className="r-steps">
        <label className="block mb-2">Steps</label>
        {formData.steps.map((step, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Step ${index + 1}`}
            value={step}
            onChange={(e) => handleStepChange(index, e.target.value)}
            className="w-full p-2 border mb-2"
          />
        ))}
        <button type="button" onClick={addStep} className="px-4 py-2 rounded">
          Add Step
        </button>
        {errors.steps && <p className="text-red-500 text-sm">{errors.steps}</p>}
      </div>

      {/* Difficulty Input */}
      <div className="r-diff">
        <label htmlFor="diff" className="block mb-2">
          Difficulty (1 - 5)
        </label>
        <input
          type="number"
          name="difficulty"
          max="5"
          min="1"
          id="diff"
          value={formData.difficulty}
          onChange={handleChange}
          className={`w-full p-2 border ${
            errors.difficulty ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.difficulty && (
          <p className="text-red-500 text-sm">{errors.difficulty}</p>
        )}
      </div>

      {/* Cooking Time Input */}
      <div className="r-time">
        <label htmlFor="time" className="block mb-2">
          Time (in minutes)
        </label>
        <input
          type="number"
          name="cookingTime"
          id="time"
          value={formData.cookingTime}
          onChange={handleChange}
          className={`w-full p-2 border ${
            errors.cookingTime ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.cookingTime && (
          <p className="text-red-500 text-sm">{errors.cookingTime}</p>
        )}
      </div>

      {/* Preparation Tips Input */}
      <div className="r-tips">
        <label htmlFor="tips" className="block mb-2">
          Preparation Tips
        </label>
        {formData.preparationTips.map((tip, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Tip ${index + 1}`}
            value={tip}
            onChange={(e) => handlePreparationTipChange(index, e.target.value)}
            className="w-full p-2 border mb-2"
          />
        ))}
        <button
          type="button"
          onClick={addPreparationTip}
          className="px-4 py-2 rounded"
        >
          Add Tip
        </button>
      </div>

      <div className="r-nutritional-facts">
        <label className="block mb-2">Nutritional Facts</label>
        <div className="flex space-x-2">
          <select
            value={selectedNutritionalFact}
            onChange={handleNutritionalFactChange}
            className="bg-foreground text-background rounded flex-grow p-2 border"
          >
            <option value="">Select Nutritional Fact</option>
            {NUTRITIONAL_FACTS_OPTIONS.map((fact) => (
              <option key={fact.id} value={fact.id}>
                {fact.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={nutritionalFactValue}
            onChange={(e) => setNutritionalFactValue(Number(e.target.value))}
            placeholder="Value"
            className="flex-grow p-2 border"
          />
          <button
            type="button"
            onClick={addNutritionalFact}
            disabled={!selectedNutritionalFact || nutritionalFactValue === 0}
            className=" px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Fact
          </button>
        </div>

        <div className="mt-2">
          {Object.entries(formData.nutritionalFacts)
            .filter(([key, value]) => key !== "servingSize" && value !== 0)
            .map(([key, value]) => (
              <div key={key} className="text-sm text-foreground">
                {NUTRITIONAL_FACTS_OPTIONS.find((f) => f.id === key)?.label}:{" "}
                {value}
              </div>
            ))}
        </div>
      </div>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : "Submit Recipe"}
      </button>
    </form>
  );
}
