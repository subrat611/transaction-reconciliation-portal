"use client";

import { useState } from "react";
import { ColumnDef, flexRender, useTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Transaction, features } from "./columns";
import { triggerReconciliation } from "@/app/actions/transactions";
import { toast } from "sonner";

interface DataTableProps {
  columns: ColumnDef<typeof features, Transaction, any>[];
  data: Transaction[];
}

export function DataTable({ columns, data }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({});

  const table = useTable({
    data,
    columns,
    features,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const selectedCount = Object.keys(rowSelection).length;

  const handleFailSelected = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const reqNumbers = selectedRows.map((row) => row.original.reqNumber);

    if (reqNumbers.length === 0) return;

    const result = await triggerReconciliation(reqNumbers);

    if (result.success) {
      toast(`Job triggered successfully! Job ID: ${result.jobId}`);
      setRowSelection({});
    } else {
      alert(`Failed to trigger job: ${result.error}`);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {selectedCount} of {table.getRowModel().rows.length} row(s) selected.
        </div>
        {selectedCount > 0 && (
          <Button variant="destructive" size="sm" onClick={handleFailSelected}>
            Fail Selected ({selectedCount})
          </Button>
        )}
      </div>
      <div className="rounded-md border min-h-fit max-h-[calc(100vh-280px)] overflow-auto relative">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-r last:border-r-0"
                      style={{
                        width:
                          header.column.id === "select" ? "50px" : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-r last:border-r-0 py-3"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
