
"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type ApplyState,
  applyAction,
} from "@/app/(public)/properties/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Flat } from "@/types/api";

const initialState: ApplyState = { success: false, message: "" };

export function ApplyDialog({
  propertyTitle,
  flats,
}: {
  propertyTitle: string;
  flats: Flat[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    applyAction,
    initialState,
  );

  useEffect(() => {
    if (state.message && !state.success) toast.error(state.message);
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            className="w-full rounded-none bg-ink text-paper hover:bg-ink/90"
          />
        }
      >
        Apply for this flat
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="display text-2xl">Application</DialogTitle>
          <DialogDescription>
            File your details against {propertyTitle}. The owner sees your name
            and answers either way.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="flatId">Flat</Label>
            <select
              id="flatId"
              name="flatId"
              required
              defaultValue=""
              className="h-9 w-full rounded-none border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                Select an available flat
              </option>
              {flats.map((flat) => (
                <option key={flat.id} value={flat.id}>
                  {flat.flatNumber}
                  {flat.variant?.name ? ` · ${flat.variant.name}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="monthlyIncome">Monthly income (optional)</Label>
            <Input
              id="monthlyIncome"
              name="monthlyIncome"
              type="number"
              min={0}
              step="any"
              placeholder="80000"
              className="rounded-none"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="employment">Employment (optional)</Label>
            <Input
              id="employment"
              name="employment"
              placeholder="Software Engineer"
              className="rounded-none"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Message to the owner (optional)</Label>
            <Textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Tell the owner why this flat suits you."
              className="rounded-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Submitting..." : "Submit application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
