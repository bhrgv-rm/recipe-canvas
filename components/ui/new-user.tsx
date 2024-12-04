"use client";
import { useState } from "react";
import axios from "axios";
import PassField from "../pass-field";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import saltAndHashPassword from "@/utils/salt_hash"; // Import the hashing function

interface FormData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  image?: string;
}

export default function NewUser() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Hash the password before sending it
      const hashedPassword = await saltAndHashPassword(formData.password);

      const dataToSend = {
        ...formData,
        password: hashedPassword, // Send the hashed password
        confirmPassword: undefined, // Exclude confirmPassword from the data sent to the backend
      };
      console.table(dataToSend);

      // Create user via API (Backend will handle user creation)
      await axios.post("/api/create-user", dataToSend);

      // Sign in with credentials after user is created
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password, // Use plain password to authenticate
      });

      if (result?.ok) {
        router.push("/"); // Redirect to home page on success
      } else {
        setError(result?.error || "Unknown error during sign-in.");
      }
    } catch (error) {
      setError(
        "Error creating user: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user">
      <h1 className="mb-3">Create Account</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <PassField
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          name="password"
        />
        <PassField
          placeholder="Re-Enter Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
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
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
