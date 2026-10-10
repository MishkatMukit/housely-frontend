"use client";

import { Check, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type AdminActionState,
  approveOwnerAction,
  rejectOwnerAction,
} from "@/app/(dashboard)/admin/actions";
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

const actionButton =
  "rounded-none bg-tolet px-4 text-primary-foreground hover:bg-tolet/90";

const initialState: AdminActionState = { status: "idle", message: "" };

function ApproveDialog({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    approveOwnerAction,
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
        render={<Button variant="outline" size="sm" className="rounded-none" />}
      >
        <Check className="mr-1.5 h-3.5 w-3.5" />
        Approve
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="display">Approve this owner?</DialogTitle>
          <DialogDescription>
            The applicant becomes an owner and can list properties. A welcome
            email is sent on approval.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
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
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending} className={actionButton}>
              {pending ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    rejectOwnerAction,
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
        <X className="mr-1.5 h-3.5 w-3.5" />
        Reject
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="display">
            Reject this application?
          </DialogTitle>
          <DialogDescription>
            The applicant sees your reason by email. Be clear about what needs
            fixing.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={id} />
          <div className="grid gap-2">
            <Label htmlFor={`reason-${id}`}>Reason</Label>
            <Textarea
              id={`reason-${id}`}
              name="rejectionReason"
              rows={3}
              placeholder="Verification documents are not clear..."
              required
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
              Cancel
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={pending}
              className="rounded-none"
            >
              {pending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function OwnerReviewActions({ id }: { id: string }) {
  return (
    <div className="flex items-center gap-2">
      <ApproveDialog id={id} />
      <RejectDialog id={id} />
    </div>
  );
}
