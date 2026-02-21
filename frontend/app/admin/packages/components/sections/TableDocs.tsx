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
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCollapsibleRow 
} from "@components/ui-elements/Table";

export default function TableDemo() {
  return (
    <div className="space-y-8">
      {/* Basic Table */}
      <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Candidate</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="pl-6 font-bold text-brand-primary">Mohammed Danish</TableCell>
              <TableCell>5+ Years</TableCell>
              <TableCell>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">Active</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Collapsible Table Section */}
      <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Advanced Details</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableCollapsibleRow 
              expandedContent={
                <div className="p-6 bg-muted/20 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Last Updated</p>
                      <p className="text-sm font-bold">2 hours ago</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Assigned To</p>
                      <p className="text-sm font-bold text-brand-primary">Senior Recruitment Team</p>
                    </div>
                  </div>
                </div>
              }
            >
              <TableCell className="font-bold">Project Architecture Review</TableCell>
              <TableCell>Engineering</TableCell>
            </TableCollapsibleRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}`}
  >
    <div className="w-full space-y-12">
      <DocSubSection title="Standard Layout">
        <Table className="border border-border rounded-xl overflow-hidden shadow-sm">
          <TableHeader>
            <TableRow className="bg-slate-950">
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
            <TableRow className="bg-slate-950">
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
