"use client";
import SpreadsheetGrid from "@/components/SpreadsheetGrid";
import { useParams } from "next/navigation";
import { useDocument } from "@/hooks/useDocument";

export default function DocumentPage() {
  const params = useParams();
  const documentId = params?.id;

  const { loaded } = useDocument(documentId || ""); // track loading

  if (!documentId) return <div className="flex justify-center mt-20">Loading spreadsheet...</div>;
  if (!loaded) return <div className="flex justify-center mt-20">Loading spreadsheet...</div>; // wait for Firestore

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">The Spreadsheet</h1>
      <SpreadsheetGrid documentId={documentId} />
    </div>
  );
}