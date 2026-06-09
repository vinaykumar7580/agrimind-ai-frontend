"use client";

import {
  useState,
} from "react";

import {
  registerUser,
} from "@/services/auth.service";

export default function Register() {

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleSubmit =
    async () => {

      try {

        await registerUser(form);

        alert(
          "Registration Successful"
        );

      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div className="max-w-md mx-auto mt-20">

      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Name"
        onChange={(e) =>
          setForm({
            ...form,
            name:
              e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        onChange={(e) =>
          setForm({
            ...form,
            email:
              e.target.value,
          })
        }
      />

      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="Password"
        onChange={(e) =>
          setForm({
            ...form,
            password:
              e.target.value,
          })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Register
      </button>

    </div>
  );
}