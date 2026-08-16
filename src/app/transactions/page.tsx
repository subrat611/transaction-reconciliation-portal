import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import {
  Transaction,
  columns,
  features,
} from "@/components/transactions/columns";
import { DataTable } from "@/components/transactions/data-table";
import { headers } from "next/headers";

export default async function TransactionsPage() {
  // Construct absolute URL for the API call (required for Server Components)
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";

  // Consume the API
  const res = await fetch(`${protocol}://${host}/api/transactions`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const transactions: Transaction[] = await res.json();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <Input placeholder="Search for transactions..." className="w-64" />
        <Button>
          <Upload className="h-4 w-4" />
          Upload CSV
        </Button>
      </div>

      {/* Data Table */}
      <div className="mt-4">
        <DataTable columns={columns} data={transactions} />
      </div>
    </div>
  );
}
