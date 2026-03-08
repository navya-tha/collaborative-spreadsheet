"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, onSnapshot } from "firebase/firestore";

export function usePresence(
  documentId: string,
  user: { uid: string; name: string } | null
) {
  const [users, setUsers] = useState<{ name: string; uid: string }[]>([]);

  useEffect(() => {
    if (!documentId || !user) return;

    const presenceRef = collection(db, "documents", documentId, "presence");
    const userDoc = doc(presenceRef, user.uid);

    const updatePresence = () => {
      setDoc(userDoc, { name: user.name, uid: user.uid, lastSeen: serverTimestamp() }, { merge: true });
    };
    updatePresence();
    const interval = setInterval(updatePresence, 5000);

    const unsub = onSnapshot(presenceRef, (snap) => {
      const active: any[] = [];
      const now = Date.now();
      snap.docs.forEach((d) => {
        const data = d.data();
        const lastSeen = data.lastSeen?.toMillis?.() || 0;
        if (now - lastSeen < 15000) active.push({ name: data.name, uid: data.uid });
      });
      setUsers(active);
    });

    return () => {
      clearInterval(interval);
      unsub();
    };
  }, [documentId, user]);

  return users;
}