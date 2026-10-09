"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { withdrawApplicationAction } from "@/app/(dashboard)/tenant/applications/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WithdrawButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleWithdraw = () => {
    startTransition(async () => {
      const result = await withdrawApplicationAction(id);
      if (result.ok) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="rounded-none border-tolet/50 text-tolet hover:bg-tolet hover:text-paper"
          />
        }
      >
        Withdraw
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="display text-2xl">
            Withdraw application
          </DialogTitle>
          <DialogDescription>
            This pulls your application off the owner's desk. Only pending
            applications can be withdrawn. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            className="rounded-none"
            disabled={pending}
            onClick={() => setOpen(false)}
          >
            Keep it
          </Button>
          <Button
            className="rounded-none bg-tolet text-primary-foreground hover:bg-tolet/90"
            disabled={pending}
            onClick={handleWithdraw}
          >
            {pending ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
