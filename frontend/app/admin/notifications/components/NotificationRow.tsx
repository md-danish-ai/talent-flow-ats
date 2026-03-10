import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TableCell, TableCollapsibleRow } from "@components/ui-elements/Table";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { type NotificationItem } from "@lib/api";
import { DuplicateUserCards } from "./DuplicateUserCards";
import { MatchBreakdownAnalysis } from "./MatchBreakdownAnalysis";

interface NotificationRowProps {
  notification: NotificationItem;
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (id: number) => void;
  onExpand: (id: number) => void;
  getDateStr: (dateStr: string) => Date;
}

export const NotificationRow = React.memo<NotificationRowProps>(
  ({
    notification: notif,
    index,
    isSelected,
    isExpanded,
    onSelect,
    onExpand,
    getDateStr,
  }) => {
    return (
      <TableCollapsibleRow
        isOpen={isExpanded}
        onOpenChange={() => onExpand(notif.id)}
        showToggleCell={false}
        colSpan={9}
        className={`${notif.match_details ? "cursor-pointer" : ""} ${
          !notif.is_read ? "bg-brand-primary/5" : ""
        }`}
        onClick={() => notif.match_details && onExpand(notif.id)}
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
          <Typography variant="body4" weight="bold">
            {notif.title}
          </Typography>
          <Typography
            variant="body5"
            className="text-muted-foreground line-clamp-2 mt-1"
          >
            {notif.message}
          </Typography>
        </TableCell>
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
              <strong>{notif.match_details.new_user.name || "-"}</strong>
            </div>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          {notif.match_details ? (
            <div className="text-sm">
              <strong>{notif.match_details.matched_user.name || "-"}</strong>
            </div>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          <Typography variant="body5" className="text-muted-foreground">
            {getDateStr(notif.created_at).toLocaleDateString()}{" "}
            {getDateStr(notif.created_at).toLocaleTimeString()}
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
        <TableCell className="text-center">
          <div className="flex justify-center items-center flex-wrap gap-2">
            {notif.match_details && (
              <Button
                variant="outline"
                color="primary"
                size="icon"
                animate="scale"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(notif.id);
                }}
                title={isExpanded ? "Collapse Details" : "Expand Details"}
              >
                {isExpanded ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </Button>
            )}
          </div>
        </TableCell>
      </TableCollapsibleRow>
    );
  },
);

NotificationRow.displayName = "NotificationRow";
