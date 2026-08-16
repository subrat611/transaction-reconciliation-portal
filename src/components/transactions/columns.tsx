"use client";

import { ColumnDef, tableFeatures, rowSelectionFeature } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const features = tableFeatures({
  rowSelectionFeature,
});

export type Transaction = {
  id: string;
  reqNumber: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
};

export const columns: ColumnDef<typeof features, Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center items-center w-full">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center w-full">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  {
    accessorKey: "reqNumber",
    header: "Req Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "PENDING" ? "secondary" : "default"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const dateString = row.getValue("createdAt") as string;
      const date = new Date(dateString);
      return (
        <span suppressHydrationWarning>
          {date.toLocaleString()}
        </span>
      );
    },
  },
];
