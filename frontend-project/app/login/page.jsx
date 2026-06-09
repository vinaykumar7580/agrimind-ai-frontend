"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  loginUser,
} from "@/services/auth.service";

import {
  useAuth,
} from "@/context/AuthContext";

export default function Login() {

  const router =
    useRouter();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleLogin =
    async () => {

      try {

        const res =
          await loginUser({
            email,
            password,
          });

        login(
          res.access_token,
          res.user
        );

        router.push("/");

      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div className="max-w-md mx-auto mt-20">

      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="Password"
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <button
        onClick={handleLogin}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>

    </div>
  );
}