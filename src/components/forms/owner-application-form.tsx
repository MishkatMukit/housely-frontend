"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  applyOwnerAction,
  initialOwnerApplyState,
} from "@/app/(dashboard)/profile/become-owner/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="figure text-xs text-destructive">{errors[0]}</p>;
}

export function OwnerApplicationForm() {
  const [state, formAction, pending] = useActionState(
    applyOwnerAction,
    initialOwnerApplyState,
  );

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const fieldErrors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="rule-top rule-bottom bg-surface/50 px-4 py-10 text-center">
        <span className="stamp stamp-blue">Under review</span>
        <h2 className="display mt-4 text-2xl text-ink">
          Application submitted
        </h2>
        <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-soft">
          {state.message} Our team reviews owner applications by hand. You'll
          become an owner the moment it is approved.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="contactNumber">Contact number</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            placeholder="01712345678"
            required
          />
          <FieldError errors={fieldErrors.contactNumber} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="nationalIdNumber">National ID number</Label>
          <Input
            id="nationalIdNumber"
            name="nationalIdNumber"
            placeholder="1234567890"
            required
          />
          <FieldError errors={fieldErrors.nationalIdNumber} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            rows={3}
            placeholder="12 Road 5, Dhaka"
            required
          />
          <FieldError errors={fieldErrors.address} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="verificationDocuments">Verification documents</Label>
          <Input
            id="verificationDocuments"
            name="verificationDocuments"
            type="file"
            multiple
            required
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="h-auto py-2 file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-1 file:text-paper"
          />
          <p className="text-xs text-ink-soft">
            National ID and proof of ownership — 1 to 4 files, up to 5 MB each
            (JPG, PNG, WEBP, or PDF).
          </p>
          <FieldError errors={fieldErrors.verificationDocuments} />
        </div>
      </div>

      <div className="rule-top flex justify-end pt-5">
        <Button
          type="submit"
          disabled={pending}
          className="rounded-none bg-tolet px-5 text-primary-foreground hover:bg-tolet/90"
        >
          {pending ? "Submitting..." : "Submit application"}
        </Button>
      </div>
    </form>
  );
}
