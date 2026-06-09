"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
}) {

  const router =
    useRouter();

  const { user } =
    useAuth();

  useEffect(() => {

    if (!user) {
      router.push("/login");
    }

  }, [user]);

  return children;
}