"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  createPropertyAction,
  type FormActionState,
} from "@/app/(dashboard)/owner/properties/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: FormActionState = { status: "idle", message: "" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="figure text-xs text-destructive">{errors[0]}</p>;
}

export function PropertyForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createPropertyAction,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      if (state.propertyId)
        router.push(`/owner/properties/${state.propertyId}`);
    }
    if (state.status === "error") toast.error(state.message);
  }, [state, router]);

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Skyline Residence"
            required
          />
          <FieldError errors={fieldErrors.title} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="A quiet residential building..."
          />
          <FieldError errors={fieldErrors.description} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" placeholder="12 Road 5" required />
          <FieldError errors={fieldErrors.address} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" placeholder="Dhaka" required />
          <FieldError errors={fieldErrors.city} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="district">District</Label>
          <Input id="district" name="district" placeholder="Dhaka" required />
          <FieldError errors={fieldErrors.district} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="postalCode">Postal code</Label>
          <Input id="postalCode" name="postalCode" placeholder="1205" />
          <FieldError errors={fieldErrors.postalCode} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Housely Living"
          />
          <FieldError errors={fieldErrors.companyName} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="images">Photos</Label>
          <Input
            id="images"
            name="images"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="h-auto py-2 file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-1 file:text-paper"
          />
          <p className="text-xs text-ink-soft">
            Up to 4 photos, 5 MB each (JPG, PNG, or WEBP).
          </p>
          <FieldError errors={fieldErrors.images} />
        </div>
      </div>

      <div className="rule-top flex justify-end pt-5">
        <Button
          type="submit"
          disabled={pending}
          className="rounded-none bg-tolet px-5 text-primary-foreground hover:bg-tolet/90"
        >
          {pending ? "Creating..." : "Create property"}
        </Button>
      </div>
    </form>
  );
}
