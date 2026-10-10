"use client";

import { Ban } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type LeaseActionState,
  terminateLeaseAction,
} from "@/app/(dashboard)/owner/leases/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: LeaseActionState = { status: "idle", message: "" };

export function TerminateLeaseDialog({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    terminateLeaseAction,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      setOpen(false);
    }
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none text-destructive hover:text-destructive"
          />
        }
      >
        <Ban className="mr-1.5 h-3.5 w-3.5" />
        Terminate
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="display">Terminate lease?</DialogTitle>
          <DialogDescription>
            This ends the tenancy and frees the flat. The tenant is notified.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={id} />
          <div className="grid gap-2">
            <Label htmlFor={`terminate-${id}`}>Reason (optional)</Label>
            <Textarea
              id={`terminate-${id}`}
              name="rejectionReason"
              rows={3}
              placeholder="Lease ended by mutual agreement..."
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose
              render={
                <Button
                  variant="outline"
                  type="button"
                  className="rounded-none"
                />
              }
            >
              Keep lease
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={pending}
              className="rounded-none"
            >
              {pending ? "Terminating..." : "Terminate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
