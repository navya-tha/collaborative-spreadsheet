"use client";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, login, logout } = useAuth();
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const q = query(collection(db, "documents"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        updatedAt: d.data().updatedAt?.toDate?.() || null,
      }));
      setDocs(list);
    });
    return () => unsub();
  }, []);

  const createDocument = async () => {
  if (!user?.uid) return;

  const docRef = await addDoc(collection(db, "documents"), {
    title: newTitle.trim() || "Untitled Document",
    owner: user.uid,      // ✅ MUST have owner
    cells: {},            // empty spreadsheet
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  setNewTitle("");
  router.push(`/document/${docRef.id}`);
};

  const deleteDocument = async (id: string) => {
    if (!confirm("Delete this sheet?")) return;
    await deleteDoc(doc(db, "documents", id));
  };

  const updateTitle = async (id: string, title: string) => {
    await updateDoc(doc(db, "documents", id), { title, updatedAt: serverTimestamp() });
  };

  if (!user)
    return (
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-3xl font-bold mb-6">Please Log In</h1>
        <button
          onClick={login}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login with Google
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center mt-20 p-6">
      <h1 className="text-3xl font-bold mb-6">Spreadsheet Dashboard</h1>

      <div className="mb-6 flex gap-2 items-center">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter document title"
          className="border px-3 py-2 rounded outline-none w-64"
        />
        <button
          onClick={createDocument}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create New Document
        </button>
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-2">All Documents</h2>
        {docs.length === 0 && <p>No documents yet.</p>}

        <ul>
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex justify-between items-center p-3 border-b hover:bg-gray-50"
            >
              <input
                value={d.title}
                onChange={(e) => updateTitle(d.id, e.target.value)}
                className="border-b border-gray-300 text-lg font-medium outline-none"
              />
              <span className="text-sm text-gray-500">
                Last updated: {d.updatedAt ? d.updatedAt.toLocaleString() : "N/A"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/document/${d.id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Open
                </button>
                <button
                  onClick={() => deleteDocument(d.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}