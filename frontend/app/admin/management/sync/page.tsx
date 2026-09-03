import { Metadata } from "next";
import { SyncUserListing } from "./components/SyncUserListing";

export const metadata: Metadata = {
  title: "Sync ArcCRM | Talent Flow ATS",
  description: "Sync candidates with the ArcCRM third-party system.",
};

export default function SyncPage() {
  return (
    <div className="p-6 space-y-6">
      <SyncUserListing />
    </div>
  );
}
