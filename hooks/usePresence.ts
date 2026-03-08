"use client";
import { useEffect, useState } from "react";
import { collection, doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function usePresence(
  documentId: string,
  user: { uid: string; displayName: string } | null
) {
  const [users, setUsers] = useState<{ uid: string; displayName: string }[]>([]);

  useEffect(() => {
    if (!documentId || !user) return; // exit if no user or doc

    const presenceRef = collection(db, "documents", documentId, "presence");
    const userDoc = doc(presenceRef, user.uid);

    // Update presence for current user
    setDoc(
      userDoc,
      { displayName: user.displayName, lastSeen: serverTimestamp() },
      { merge: true }
    );

    // Listen for all active users
    const unsub = onSnapshot(presenceRef, (snap) => {
      const active: { uid: string; displayName: string }[] = [];
      snap.docs.forEach((d) => {
        const data = d.data();
        active.push({ uid: data.uid || d.id, displayName: data.displayName || "Anonymous" });
      });
      setUsers(active);
    });

    return () => {
      unsub();
      // Optionally remove user presence on unmount
      // deleteDoc(userDoc);
    };
  }, [documentId, user]);

  return users;
}