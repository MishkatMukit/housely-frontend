"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PaymentCallbackNotice({
  status,
  trxID,
}: {
  status?: string;
  trxID?: string;
}) {
  useEffect(() => {
    if (status === "success") {
      toast.success(
        trxID ? `Payment completed · ${trxID}` : "Payment completed",
      );
    } else if (status) {
      toast.error(`Payment ${status}`);
    }
  }, [status, trxID]);

  if (!status) return null;

  const success = status === "success";

  return (
    <Alert
      variant={success ? "default" : "destructive"}
      className="rule-top rounded-none"
    >
      {success ? <CheckCircle2 /> : <XCircle />}
      <AlertTitle className="display text-lg">
        {success ? "Payment completed" : "Payment not completed"}
      </AlertTitle>
      <AlertDescription>
        {success
          ? trxID
            ? `bKash transaction ${trxID} was recorded on the register.`
            : "Your bKash payment was recorded on the register."
          : "The bKash checkout did not complete. You can retry the payment below."}
      </AlertDescription>
    </Alert>
  );
}
