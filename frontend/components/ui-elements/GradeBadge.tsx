import { cn, getGradeConfig } from "@lib/utils";

interface GradeBadgeProps {
  gradeLabel: string;
  value?: string; // e.g., "50%" or "0% - 39.99%"
  shape?: "curve" | "square";
  className?: string;
}

export const GradeBadge = ({
  gradeLabel,
  value,
  shape = "square",
  className,
}: GradeBadgeProps) => {
  const config = getGradeConfig(gradeLabel);
  const style = `${config.color} ${config.bg} ${config.border}`;
  const rounding = shape === "curve" ? "rounded-full" : "rounded-sm";

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-1.5 border shadow-sm transition-all duration-300",
        rounding,
        style,
        className,
      )}
    >
      <span className="font-black text-xs uppercase tracking-widest leading-none">
        {gradeLabel}
      </span>
      {value ? (
        <>
          <div
            className={cn(
              "w-1 h-3 bg-current opacity-20 mx-2 shrink-0",
              rounding,
            )}
          />
          <span className="font-bold text-xs tracking-wide leading-none whitespace-nowrap">
            {value}
          </span>
        </>
      ) : null}
    </div>
  );
};
