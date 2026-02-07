"use client";

import { useEffect, useState } from "react";
import { tokenManager } from "@/lib/api";

interface User {
  name: string;
  role: string;
  email?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenManager.getAccessToken();
    const savedUser = tokenManager.getUser();
    if (token && savedUser) setUser(savedUser);
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    isDoctor: user?.role === "DOCTOR" || user?.role === "ADMIN",
    isAdmin: user?.role === "ADMIN",
    isPatient: user?.role === "PATIENT",
    isLoading,
  };
}
