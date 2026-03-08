"use client";
import { useState, useEffect } from "react";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u || null));
    return () => unsubscribe();
  }, []);

  const login = async () => signInWithPopup(auth, provider);
  const logout = async () => signOut(auth);

  return { user, login, logout };
}