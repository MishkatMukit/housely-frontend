import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  APPROVED: "stamp-green",
  ACTIVE: "stamp-green",
  COMPLETED: "stamp-green",
  AVAILABLE: "stamp-green",
  REJECTED: "stamp-red",
  FAILED: "stamp-red",
  TERMINATED: "stamp-red",
  CANCELLED: "stamp-red",
  OCCUPIED: "stamp-red",
  PENDING: "stamp-blue",
  INACTIVE: "stamp-blue",
  WITHDRAWN: "stamp-blue",
  MAINTENANCE: "stamp-blue",
  UNAVAILABLE: "stamp-blue",
};

const LABEL: Record<string, string> = {
  WITHDRAWN: "Withdrawn",
  MONTHLY_RENT: "Monthly rent",
  ADVANCE: "Advance",
};

export function StatusStamp({ status }: { status: string }) {
  return (
    <span className={cn("stamp", TONE[status] ?? "stamp-blue")}>
      {LABEL[status] ?? status}
    </span>
  );
}
