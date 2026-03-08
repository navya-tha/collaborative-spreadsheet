"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useDocument(id: string) {
  const [cells, setCells] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, "documents", id);

    // Load initial document
    const loadDoc = async () => {
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        // Create empty document if missing
        await setDoc(docRef, { cells: {}, updatedAt: serverTimestamp() });
        setCells({});
      } else {
        setCells(snap.data()?.cells || {});
      }
      setLoaded(true);
    };

    loadDoc();

    // Listen for live updates
    const unsub = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setCells(snapshot.data()?.cells || {});
        setLoaded(true);
      }
    });

    return () => unsub();
  }, [id]);

  const updateCell = async (key: string, value: string) => {
    const updated = { ...cells, [key]: value };
    setCells(updated);
    setSaving(true);
    await updateDoc(doc(db, "documents", id), {
      cells: updated,
      updatedAt: serverTimestamp(),
    });
    setSaving(false);
  };

  return { cells, updateCell, saving, loaded };
}