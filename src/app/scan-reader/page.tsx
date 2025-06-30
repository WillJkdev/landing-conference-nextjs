import ScanReaderClient from "@/components/dashboard/ScanReaderClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ScanPage() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return redirect("/");
  }

  return (
    <div className="p-4 text-center">
      <ScanReaderClient />
    </div>
  );
}
