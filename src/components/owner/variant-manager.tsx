"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  addFlatsAction,
  createVariantAction,
  deleteFlatAction,
  deleteVariantAction,
  initialFormState,
  updateFlatAction,
  updateVariantAction,
} from "@/app/(dashboard)/owner/properties/actions";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusStamp } from "@/components/dashboard/status-stamp";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Flat, VariantWithCount } from "@/types/api";

const FLAT_STATUSES = ["AVAILABLE", "MAINTENANCE", "UNAVAILABLE"] as const;

function taka(value?: string | number | null) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `৳${amount.toLocaleString("en-BD")}` : "—";
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="figure text-xs text-destructive">{errors[0]}</p>;
}

const actionButton =
  "rounded-none bg-tolet px-4 text-primary-foreground hover:bg-tolet/90";

function CreateVariantDialog({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createVariantAction,
    initialFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      setOpen(false);
      formRef.current?.reset();
    }
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const fe = state.fieldErrors ?? {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className={actionButton} />}>
        <Plus className="mr-1.5 h-4 w-4" />
        New variant
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="display">New variant</DialogTitle>
          <DialogDescription>
            Define a unit type. Flats can be issued from any variant.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="grid gap-4">
          <input type="hidden" name="propertyId" value={propertyId} />
          <div className="grid gap-2">
            <Label htmlFor="cv-name">Name</Label>
            <Input
              id="cv-name"
              name="name"
              placeholder="3 Bedroom Apartment"
              required
            />
            <FieldError errors={fe.name} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cv-bedrooms">Bedrooms</Label>
              <Input
                id="cv-bedrooms"
                name="bedrooms"
                type="number"
                min={0}
                defaultValue={2}
                required
              />
              <FieldError errors={fe.bedrooms} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cv-bathrooms">Bathrooms</Label>
              <Input
                id="cv-bathrooms"
                name="bathrooms"
                type="number"
                min={0}
                defaultValue={1}
                required
              />
              <FieldError errors={fe.bathrooms} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cv-size">Size (sqft)</Label>
              <Input
                id="cv-size"
                name="sizeSqft"
                type="number"
                min={50}
                placeholder="1200"
              />
              <FieldError errors={fe.sizeSqft} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cv-units">Units</Label>
              <Input
                id="cv-units"
                name="totalUnits"
                type="number"
                min={1}
                max={100}
                defaultValue={1}
                required
              />
              <FieldError errors={fe.totalUnits} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cv-rent">Monthly rent</Label>
              <Input
                id="cv-rent"
                name="rentAmount"
                type="number"
                min={1}
                placeholder="25000"
                required
              />
              <FieldError errors={fe.rentAmount} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cv-advance">Advance</Label>
              <Input
                id="cv-advance"
                name="advanceAmount"
                type="number"
                min={0}
                defaultValue={0}
                required
              />
              <FieldError errors={fe.advanceAmount} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cv-prefix">Flat number prefix</Label>
            <Input
              id="cv-prefix"
              name="flatNumberPrefix"
              placeholder="A"
              maxLength={10}
            />
            <FieldError errors={fe.flatNumberPrefix} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cv-images">Photos</Label>
            <Input
              id="cv-images"
              name="images"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="h-auto py-2 file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-1 file:text-paper"
            />
            <FieldError errors={fe.images} />
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
            <Button type="submit" disabled={pending} className={actionButton}>
              {pending ? "Creating..." : "Create variant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditVariantDialog({
  propertyId,
  variant,
}: {
  propertyId: string;
  variant: VariantWithCount;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateVariantAction,
    initialFormState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      setOpen(false);
    }
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const fe = state.fieldErrors ?? {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm" className="rounded-none" />}
      >
        <Pencil className="mr-1.5 h-3.5 w-3.5" />
        Edit
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="display">Edit variant</DialogTitle>
          <DialogDescription>{variant.name}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={variant.id} />
          <input type="hidden" name="propertyId" value={propertyId} />
          <div className="grid gap-2">
            <Label htmlFor={`ev-name-${variant.id}`}>Name</Label>
            <Input
              id={`ev-name-${variant.id}`}
              name="name"
              defaultValue={variant.name}
              required
            />
            <FieldError errors={fe.name} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`ev-bed-${variant.id}`}>Bedrooms</Label>
              <Input
                id={`ev-bed-${variant.id}`}
                name="bedrooms"
                type="number"
                min={0}
                defaultValue={variant.bedrooms}
                required
              />
              <FieldError errors={fe.bedrooms} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`ev-bath-${variant.id}`}>Bathrooms</Label>
              <Input
                id={`ev-bath-${variant.id}`}
                name="bathrooms"
                type="number"
                min={0}
                defaultValue={variant.bathrooms}
                required
              />
              <FieldError errors={fe.bathrooms} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`ev-size-${variant.id}`}>Size (sqft)</Label>
              <Input
                id={`ev-size-${variant.id}`}
                name="sizeSqft"
                type="number"
                min={50}
                defaultValue={variant.sizeSqft}
                required
              />
              <FieldError errors={fe.sizeSqft} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`ev-rent-${variant.id}`}>Monthly rent</Label>
              <Input
                id={`ev-rent-${variant.id}`}
                name="rentAmount"
                type="number"
                min={1}
                defaultValue={Number(variant.rentAmount)}
                required
              />
              <FieldError errors={fe.rentAmount} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`ev-adv-${variant.id}`}>Advance</Label>
              <Input
                id={`ev-adv-${variant.id}`}
                name="advanceAmount"
                type="number"
                min={0}
                defaultValue={Number(variant.advanceAmount)}
                required
              />
              <FieldError errors={fe.advanceAmount} />
            </div>
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
            <Button type="submit" disabled={pending} className={actionButton}>
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddFlatsDialog({
  propertyId,
  variant,
}: {
  propertyId: string;
  variant: VariantWithCount;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    addFlatsAction,
    initialFormState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      setOpen(false);
    }
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const fe = state.fieldErrors ?? {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm" className="rounded-none" />}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add flats
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="display">Issue flats</DialogTitle>
          <DialogDescription>
            Generate flats under {variant.name}.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="variantId" value={variant.id} />
          <input type="hidden" name="propertyId" value={propertyId} />
          <div className="grid gap-2">
            <Label htmlFor={`af-count-${variant.id}`}>How many flats</Label>
            <Input
              id={`af-count-${variant.id}`}
              name="count"
              type="number"
              min={1}
              max={100}
              defaultValue={1}
              required
            />
            <FieldError errors={fe.count} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`af-prefix-${variant.id}`}>
              Flat number prefix
            </Label>
            <Input
              id={`af-prefix-${variant.id}`}
              name="flatNumberPrefix"
              placeholder="A"
              maxLength={10}
            />
            <FieldError errors={fe.flatNumberPrefix} />
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
            <Button type="submit" disabled={pending} className={actionButton}>
              {pending ? "Adding..." : "Add flats"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditFlatDialog({
  propertyId,
  flat,
}: {
  propertyId: string;
  flat: Flat;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateFlatAction,
    initialFormState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      setOpen(false);
    }
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const fe = state.fieldErrors ?? {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon-sm" title="Edit flat" />}
      >
        <Pencil className="h-3.5 w-3.5" />
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="display">Edit flat</DialogTitle>
          <DialogDescription>Flat {flat.flatNumber}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={flat.id} />
          <input type="hidden" name="propertyId" value={propertyId} />
          <div className="grid gap-2">
            <Label htmlFor={`ef-num-${flat.id}`}>Flat number</Label>
            <Input
              id={`ef-num-${flat.id}`}
              name="flatNumber"
              defaultValue={flat.flatNumber}
              required
            />
            <FieldError errors={fe.flatNumber} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`ef-status-${flat.id}`}>Status</Label>
            <select
              id={`ef-status-${flat.id}`}
              name="status"
              defaultValue={flat.status}
              className="h-9 w-full rounded-none border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
            >
              {FLAT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <FieldError errors={fe.status} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`ef-rent-${flat.id}`}>Rent override</Label>
              <Input
                id={`ef-rent-${flat.id}`}
                name="rentOverride"
                type="number"
                min={1}
                placeholder="Leave blank to clear"
                defaultValue={
                  flat.rentOverride ? Number(flat.rentOverride) : ""
                }
              />
              <FieldError errors={fe.rentOverride} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`ef-adv-${flat.id}`}>Advance override</Label>
              <Input
                id={`ef-adv-${flat.id}`}
                name="advanceOverride"
                type="number"
                min={0}
                placeholder="Leave blank to clear"
                defaultValue={
                  flat.advanceOverride ? Number(flat.advanceOverride) : ""
                }
              />
              <FieldError errors={fe.advanceOverride} />
            </div>
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
            <Button type="submit" disabled={pending} className={actionButton}>
              {pending ? "Saving..." : "Save flat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteControl({
  title,
  description,
  onConfirm,
}: {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
      setOpen(false);
      toast.success("Deleted");
    } catch {
      toast.error("Could not delete. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            title={title}
            className="text-destructive hover:text-destructive"
          />
        }
      >
        <Trash2 className="h-3.5 w-3.5" />
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="display">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
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
            Keep it
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            className="rounded-none"
            onClick={handleConfirm}
          >
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VariantBlock({
  propertyId,
  variant,
  flats,
}: {
  propertyId: string;
  variant: VariantWithCount;
  flats: Flat[];
}) {
  return (
    <section className="rule-top bg-surface/40">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="display text-xl text-ink">{variant.name}</h2>
            <span className="stamp stamp-blue">
              {variant._count?.flats ?? flats.length} flats
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {variant.bedrooms} bed · {variant.bathrooms} bath ·{" "}
            {variant.sizeSqft ? `${variant.sizeSqft} sqft` : "size n/a"}
          </p>
          <p className="figure mt-1 text-sm text-ink">
            {taka(variant.rentAmount)} / mo · advance{" "}
            {taka(variant.advanceAmount)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AddFlatsDialog propertyId={propertyId} variant={variant} />
          <EditVariantDialog propertyId={propertyId} variant={variant} />
          <DeleteControl
            title="Delete variant?"
            description="This removes the variant and its flats. This cannot be undone."
            onConfirm={async () => {
              const fd = new FormData();
              fd.set("id", variant.id);
              fd.set("propertyId", propertyId);
              await deleteVariantAction(fd);
            }}
          />
        </div>
      </div>

      {flats.length === 0 ? (
        <p className="border-t border-ink/10 px-5 py-5 text-sm text-ink-soft">
          No flats issued yet — add flats to make this variant rentable.
        </p>
      ) : (
        <div className="overflow-x-auto border-t border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="figure text-left text-xs uppercase tracking-[0.12em] text-ink-soft">
                <th className="px-5 py-3 font-normal">Flat</th>
                <th className="px-5 py-3 font-normal">Status</th>
                <th className="px-5 py-3 font-normal">Rent</th>
                <th className="px-5 py-3 font-normal">Advance</th>
                <th className="px-5 py-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flats.map((flat) => (
                <tr key={flat.id} className="border-t border-ink/5">
                  <td className="px-5 py-3 text-ink">{flat.flatNumber}</td>
                  <td className="px-5 py-3">
                    <StatusStamp status={flat.status} />
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {flat.rentOverride ? taka(flat.rentOverride) : "Default"}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {flat.advanceOverride
                      ? taka(flat.advanceOverride)
                      : "Default"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <EditFlatDialog propertyId={propertyId} flat={flat} />
                      <DeleteControl
                        title="Delete flat?"
                        description={`Remove flat ${flat.flatNumber} from the register.`}
                        onConfirm={async () => {
                          const fd = new FormData();
                          fd.set("id", flat.id);
                          fd.set("propertyId", propertyId);
                          await deleteFlatAction(fd);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function VariantManager({
  propertyId,
  variants,
  flats,
}: {
  propertyId: string;
  variants: VariantWithCount[];
  flats: Flat[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="figure text-xs uppercase tracking-[0.16em] text-ink-soft">
          Variants & flats
        </h2>
        <CreateVariantDialog propertyId={propertyId} />
      </div>

      {variants.length === 0 ? (
        <EmptyState
          eyebrow="No variants"
          title="Define your first unit type"
          description="Add a bedroom variant, then issue flats from it."
        />
      ) : (
        <div className="space-y-6">
          {variants.map((variant) => (
            <VariantBlock
              key={variant.id}
              propertyId={propertyId}
              variant={variant}
              flats={flats.filter((flat) => flat.variantId === variant.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
