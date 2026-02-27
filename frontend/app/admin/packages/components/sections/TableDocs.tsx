"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCollapsibleRow,
  TableColumnToggle,
} from "@components/ui-elements/Table";
import { Typography } from "@components/ui-elements/Typography";
import { ComponentPageView } from "../ComponentPageView";
import { DocSubSection } from "../DocSubSection";

export const TableDocs = () => (
  <ComponentPageView
    title="Table"
    description="Optimized for high-density data display. This system provides a clean, row-based layout with hover highlights and consistent spacing. Supports advanced collapsible rows for nested details."
    code={`<Table>...</Table>`}
    fullSource={`import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCollapsibleRow, TableColumnToggle 
} from "@components/ui-elements/Table";
import { useState } from "react";

export default function TableDemo() {
  const [visibleColumns, setVisibleColumns] = useState(["candidate", "experience", "status"]);
  const allColumns = [
    { id: "candidate", label: "Candidate Name" },
    { id: "experience", label: "Years of Experience" },
    { id: "status", label: "Current Status" },
    { id: "appliedOn", label: "Applied On" },
  ];

  const toggleColumn = (id) => {
    setVisibleColumns(prev => 
      prev.includes(id) ? prev.filter(column => column !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <TableColumnToggle 
          columns={allColumns} 
          visibleColumns={visibleColumns} 
          onToggle={toggleColumn} 
        />
      </div>
      <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.includes("candidate") && <TableHead className="pl-6">Candidate</TableHead>}
              {visibleColumns.includes("experience") && <TableHead>Experience</TableHead>}
              {visibleColumns.includes("status") && <TableHead>Status</TableHead>}
              {visibleColumns.includes("appliedOn") && <TableHead>Applied On</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {visibleColumns.includes("candidate") && (
                <TableCell className="pl-6 font-bold text-brand-primary">Mohammed Danish</TableCell>
              )}
              {visibleColumns.includes("experience") && <TableCell>5+ Years</TableCell>}
              {visibleColumns.includes("status") && (
                <TableCell>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">Active</span>
                </TableCell>
              )}
              {visibleColumns.includes("appliedOn") && <TableCell>Oct 24, 2023</TableCell>}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}`}
  >
    <div className="w-full space-y-12">
      <DocSubSection title="Dynamic Columns (MUI Style)">
        <DynamicTableDemo />
      </DocSubSection>

      <DocSubSection title="Standard Layout">
        <Table className="border border-border rounded-xl overflow-hidden shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Candidate</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="pl-6 font-bold">Mohammed Danish</TableCell>
              <TableCell>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                  Active
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DocSubSection>
      <DocSubSection title="Collapsible Interaction">
        <Table className="border border-border rounded-xl overflow-hidden shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Resource Item</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableCollapsibleRow
              expandedContent={
                <div className="p-8 bg-muted/30 border-t border-border">
                  <Typography
                    variant="body3"
                    weight="bold"
                    className="text-foreground mb-2 block"
                  >
                    Extended Information
                  </Typography>
                  <Typography variant="body5" className="leading-relaxed">
                    This section uses Framer Motion for high-performance layout
                    transitions.
                  </Typography>
                </div>
              }
            >
              <TableCell className="font-bold">
                TalentFlow Design Tokens
              </TableCell>
              <TableCell>Synchronized</TableCell>
            </TableCollapsibleRow>
          </TableBody>
        </Table>
      </DocSubSection>
    </div>
  </ComponentPageView>
);

function DynamicTableDemo() {
  const [visibleColumns, setVisibleColumns] = React.useState([
    "candidate",
    "experience",
    "status",
  ]);

  const allColumns = [
    { id: "candidate", label: "Candidate Name" },
    { id: "experience", label: "Experience Level" },
    { id: "status", label: "Verification Status" },
    { id: "appliedOn", label: "Application Date" },
    { id: "role", label: "Applied Role" },
  ];

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((column) => column !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="body4" className="text-muted-foreground">
          Showing {visibleColumns.length} of {allColumns.length} columns
        </Typography>
        <TableColumnToggle
          columns={allColumns}
          visibleColumns={visibleColumns}
          onToggle={toggleColumn}
        />
      </div>

      <div className="border border-border rounded-2xl overflow-hidden shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.includes("candidate") && (
                <TableHead className="pl-6">Candidate</TableHead>
              )}
              {visibleColumns.includes("experience") && (
                <TableHead>Experience</TableHead>
              )}
              {visibleColumns.includes("status") && (
                <TableHead>Status</TableHead>
              )}
              {visibleColumns.includes("appliedOn") && (
                <TableHead>Applied On</TableHead>
              )}
              {visibleColumns.includes("role") && (
                <TableHead className="pr-6">Role</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((index) => (
              <TableRow key={index}>
                {visibleColumns.includes("candidate") && (
                  <TableCell className="pl-6 font-bold text-brand-primary">
                    Mohammed Danish {index}
                  </TableCell>
                )}
                {visibleColumns.includes("experience") && (
                  <TableCell>{index + 2}+ Years</TableCell>
                )}
                {visibleColumns.includes("status") && (
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                      Active
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes("appliedOn") && (
                  <TableCell>Oct 2{index}, 2023</TableCell>
                )}
                {visibleColumns.includes("role") && (
                  <TableCell className="pr-6 font-medium">
                    Software Engineer
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
