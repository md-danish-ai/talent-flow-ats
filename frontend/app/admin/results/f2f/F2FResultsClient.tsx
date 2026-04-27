"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { MainCard } from "@components/ui-cards/MainCard";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@components/ui-elements/Table";
import { Badge } from "@components/ui-elements/Badge";
import { Avatar } from "@components/ui-elements/Avatar";
import { Eye, Users, Calendar, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { evaluationsApi } from "@lib/api/evaluations";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { Skeleton } from "@components/ui-elements/Skeleton";

import { EvaluationHistoryItem } from "@types";

export default function F2FResultsClient() {
  const [data, setData] = useState<EvaluationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await evaluationsApi.getAdminEvaluationList();
        setData(res || []);
      } catch (err) {
        console.error("Failed to fetch F2F results", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <PageContainer className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="font-black tracking-tight">
          Face-to-Face Round Results
        </Typography>
        <Typography variant="body4" className="text-muted-foreground">
          View all candidates currently in or completed the Round 2 interview
          process.
        </Typography>
      </div>

      <MainCard
        title={
          <div className="flex items-center gap-2">
            <Users size={18} className="text-brand-primary" />
            <span>Interview Evaluations</span>
          </div>
        }
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Interviewer</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-12 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <EmptyState
                      variant="search"
                      title="No F2F interviews found"
                      description="No candidates have been assigned for Round 2 yet."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={item.candidate_name}
                          variant="brand"
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-[13px] uppercase tracking-tight">
                            {item.candidate_name}
                          </span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Phone size={10} /> {item.candidate_mobile}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        color="primary"
                        className="font-bold"
                      >
                        {item.lead_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="fill"
                        color={
                          item.status === "completed" ? "success" : "warning"
                        }
                        className="uppercase tracking-widest text-[9px] font-black"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.overall_grade ? (
                        <Badge
                          variant="outline"
                          color="primary"
                          shape="square"
                          className="font-bold"
                        >
                          {item.overall_grade}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {item.verdict_name ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[13px]">
                          <ShieldCheck size={14} />
                          {item.verdict_name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">
                          Pending Decision
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/results/${item.candidate_id}`}>
                        <TableIconButton
                          iconColor="brand"
                          title="View Full Profile"
                        >
                          <Eye size={16} />
                        </TableIconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </MainCard>
    </PageContainer>
  );
}
