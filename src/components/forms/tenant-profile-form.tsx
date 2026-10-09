"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  initialProfileState,
  updateProfileAction,
} from "@/app/(dashboard)/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TenantProfile } from "@/types/api";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="figure text-xs text-destructive">{errors[0]}</p>;
}

export function TenantProfileForm({ profile }: { profile: TenantProfile }) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialProfileState,
  );
  const locked = profile.status === "INACTIVE";

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const fieldErrors = state.fieldErrors ?? {};
  const user = profile.user;

  return (
    <form action={formAction} className="grid gap-6">
      {locked ? (
        <p className="rule-top bg-tolet/10 px-4 py-3 text-sm text-tolet">
          This tenant profile is inactive and cannot be edited. Contact support.
        </p>
      ) : null}

      <fieldset disabled={locked || pending} className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" defaultValue={profile.name} />
            <FieldError errors={fieldErrors.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactNumber">Contact number</Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              defaultValue={profile.contactNumber ?? ""}
              placeholder="01712345678"
            />
            <FieldError errors={fieldErrors.contactNumber} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="employmentStatus">Employment</Label>
            <Input
              id="employmentStatus"
              name="employmentStatus"
              defaultValue={profile.employmentStatus ?? ""}
              placeholder="Software Engineer"
            />
            <FieldError errors={fieldErrors.employmentStatus} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              defaultValue={user.gender ?? ""}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            >
              <option value="">Prefer not to say</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <FieldError errors={fieldErrors.gender} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nationalIdNumber">National ID</Label>
            <Input
              id="nationalIdNumber"
              name="nationalIdNumber"
              defaultValue={user.nationalIdNumber ?? ""}
            />
            <FieldError errors={fieldErrors.nationalIdNumber} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={user.address ?? ""}
            />
            <FieldError errors={fieldErrors.address} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="aboutMe">About me</Label>
          <Textarea
            id="aboutMe"
            name="aboutMe"
            rows={4}
            defaultValue={profile.aboutMe ?? ""}
            placeholder="A short note about you as a tenant."
          />
          <FieldError errors={fieldErrors.aboutMe} />
        </div>

        <div className="rule-top flex justify-end pt-5">
          <Button
            type="submit"
            disabled={locked || pending}
            className="rounded-none bg-ink px-5 text-paper hover:bg-ink/90"
          >
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
