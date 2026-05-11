import React from "react";
import { ChevronDown } from "lucide-react";
import { TableCell, TableCollapsibleRow } from "@components/ui-elements/Table";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { type NotificationItem } from "@types";
import { formatDateShort, formatTime, parseUTCDate } from "@lib/utils";
import { DuplicateUserCards } from "./DuplicateUserCards";
import { MatchBreakdownAnalysis } from "./MatchBreakdownAnalysis";
import { NotificationFormatter } from "@components/ui-elements/NotificationFormatter";

interface NotificationRowProps {
  notification: NotificationItem;
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (id: number) => void;
  onExpand: (id: number) => void;
  isProjectLead?: boolean;
  onMarkRead: (id: number) => void;
}

export const NotificationRow = React.memo<NotificationRowProps>(
  ({
    notification: notif,
    index,
    isSelected,
    isExpanded,
    onSelect,
    onExpand,
    isProjectLead = false,
    onMarkRead,
  }) => {
    return (
      <TableCollapsibleRow
        isOpen={isExpanded}
        onOpenChange={() => onExpand(notif.id)}
        showToggleCell={false}
        colSpan={isProjectLead ? 5 : 9}
        className={`cursor-pointer ${
          !notif.is_read ? "bg-brand-primary/5 font-semibold" : ""
        }`}
        onClick={() => {
          if (!notif.is_read) {
            onMarkRead(notif.id);
          }
        }}
        expandedContent={
          notif.match_details && (
            <div className="p-6 flex flex-col gap-8">
              <DuplicateUserCards matchDetails={notif.match_details} />
              <MatchBreakdownAnalysis scores={notif.match_details.scores} />
            </div>
          )
        }
      >
        <TableCell
          className="text-center px-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center w-full h-full">
            <Checkbox
              checked={isSelected}
              onChange={() => onSelect(notif.id)}
            />
          </div>
        </TableCell>
        <TableCell className="font-medium text-center text-muted-foreground whitespace-nowrap">
          {index}
        </TableCell>
        <TableCell>
          <Typography
            variant="body4"
            weight="bold"
            className={
              notif.title?.toLowerCase().includes("duplicate")
                ? "text-amber-500 dark:text-amber-400"
                : notif.title?.toLowerCase().includes("evaluation")
                  ? "text-emerald-500 dark:text-emerald-400"
                  : notif.title?.toLowerCase().includes("unassigned")
                    ? "text-red-500 dark:text-red-400"
                    : ""
            }
          >
            {notif.title}
          </Typography>
          <Typography
            variant="body5"
            className="text-muted-foreground line-clamp-2 mt-1"
          >
            <NotificationFormatter message={notif.message} />
          </Typography>
        </TableCell>
        {!isProjectLead && (
          <>
            <TableCell>
              <Typography
                variant="body3"
                weight="bold"
                className={
                  notif.final_score && notif.final_score >= 85
                    ? "text-red-500"
                    : "text-brand-primary"
                }
              >
                {notif.final_score ? `${notif.final_score.toFixed(1)}%` : "-"}
              </Typography>
            </TableCell>
            <TableCell>
              {notif.match_details ? (
                <div className="text-sm">
                  <span className="font-extrabold text-amber-500 dark:text-amber-400">
                    {notif.match_details.new_user.name || "-"}
                  </span>
                </div>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              {notif.match_details ? (
                <div className="text-sm">
                  <span className="font-extrabold text-slate-500 dark:text-slate-400">
                    {notif.match_details.matched_user.name || "-"}
                  </span>
                </div>
              ) : (
                "-"
              )}
            </TableCell>
          </>
        )}
        <TableCell>
          <Typography variant="body5" className="text-muted-foreground">
            {formatDateShort(parseUTCDate(notif.created_at))}{" "}
            {formatTime(parseUTCDate(notif.created_at))}
          </Typography>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            shape="square"
            color={notif.is_read ? "success" : "error"}
          >
            {notif.is_read ? "Read" : "Unread"}
          </Badge>
        </TableCell>
        {!isProjectLead && (
          <TableCell className="text-center">
            <div className="flex justify-center items-center flex-wrap gap-2">
              {notif.match_details ? (
                <Button
                  variant="ghost"
                  color="default"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand(notif.id);
                  }}
                  className="hover:bg-brand-primary/10 hover:text-brand-primary"
                  title={isExpanded ? "Collapse Details" : "Expand Details"}
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-500 ${
                      isExpanded
                        ? "rotate-180 text-brand-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
              ) : (
                <Typography
                  variant="body5"
                  className="text-muted-foreground font-medium whitespace-nowrap"
                >
                  No Action Needed
                </Typography>
              )}
            </div>
          </TableCell>
        )}
      </TableCollapsibleRow>
    );
  },
);

NotificationRow.displayName = "NotificationRow";
