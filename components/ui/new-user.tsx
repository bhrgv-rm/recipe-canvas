"use client";
import { useState } from "react";
import axios from "axios";
import PassField from "../pass-field";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import saltAndHashPassword from "@/utils/salt_hash"; // Assuming this function hashes the password

interface FormData {
  name: string;
  email: string;
  username: string;
  password: string;
  image?: string;
}

export default function NewUser() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    username: "",
    password: "",
    image: "",
  });

  const [loading, setLoading] = useState<boolean>(false); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true); // Set loading state to true on form submission
    setError(null); // Reset error state

    // Hash the password before sending the form data to the server
    const hashedPassword = saltAndHashPassword(formData.password);

    try {
      // Create user with the hashed password
      const dataToSend = { ...formData, password: hashedPassword }; // Replace password with hashed one
      await axios.post("/api/create-user", dataToSend);

      // Sign in with credentials after the user is created
      const result = await signIn("credentials", {
        redirect: false, // Don't redirect automatically
        email: formData.email,
        password: hashedPassword, // Send hashed password for sign-in
      });

      if (result?.ok) {
        router.push("/"); // Redirect to the home page if login is successful
      } else {
        setError(result?.error || "Unknown error during sign-in.");
      }
    } catch (error) {
      setError(
        "Error creating user: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <div className="create-user">
      <h1 className="mb-3">Create Account</h1>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <PassField value={formData.password} onChange={handleChange} />
        <PassField
          placeholder="Re-Enter Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL (Optional)"
          value={formData.image}
          onChange={handleChange}
          autoComplete="off"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}{" "}
          {/* Show loading text on submit */}
        </button>
      </form>
    </div>
  );
}
