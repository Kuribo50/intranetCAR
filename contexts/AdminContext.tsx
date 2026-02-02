"use client";

import React, { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

interface AdminContextType {
  isAdmin: boolean;
  isEditor: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.role === "ADMIN";
  const isEditor = session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";
  const user = session?.user || null;

  return (
    <AdminContext.Provider value={{ isAdmin, isEditor, user }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
