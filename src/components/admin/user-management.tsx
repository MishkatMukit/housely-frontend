"use client";

import {
  Ban,
  CheckCircle2,
  type LucideIcon,
  ShieldPlus,
  Trash2,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type AdminActionState,
  blockUserAction,
  deleteUserAction,
  makeAdminAction,
  unblockUserAction,
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
import type { UserRole, UserStatus } from "@/types/api";

const initialState: AdminActionState = { status: "idle", message: "" };

type ActionFn = (
  prev: AdminActionState,
  formData: FormData,
) => Promise<AdminActionState>;

function ActionDialog({
  action,
  id,
  title,
  description,
  confirmLabel,
  pendingLabel,
  destructive,
  icon: Icon,
  triggerLabel,
  triggerClassName,
}: {
  action: ActionFn;
  id: string;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  destructive?: boolean;
  icon: LucideIcon;
  triggerLabel: string;
  triggerClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, initialState);

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
            variant={destructive ? "ghost" : "outline"}
            size="sm"
            className={triggerClassName}
          />
        }
      >
        <Icon className="mr-1.5 h-3.5 w-3.5" />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="display">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
            <Button
              type="submit"
              variant={destructive ? "destructive" : "default"}
              disabled={pending}
              className={
                destructive
                  ? "rounded-none"
                  : "rounded-none bg-tolet text-primary-foreground hover:bg-tolet/90"
              }
            >
              {pending ? pendingLabel : confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UserActions({
  id,
  status,
  role,
  currentUserRole,
  isSelf,
}: {
  id: string;
  status: UserStatus;
  role: UserRole;
  currentUserRole: UserRole | null;
  isSelf: boolean;
}) {
  if (isSelf) {
    return (
      <span className="figure text-xs uppercase tracking-[0.12em] text-ink-soft">
        Your account
      </span>
    );
  }

  const canMakeAdmin =
    currentUserRole === "SUPERADMIN" &&
    role !== "SUPERADMIN" &&
    role !== "ADMIN";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canMakeAdmin ? (
        <ActionDialog
          action={makeAdminAction}
          id={id}
          title="Promote to admin?"
          description="This grants the account administrative access across the platform."
          confirmLabel="Promote"
          pendingLabel="Promoting..."
          icon={ShieldPlus}
          triggerLabel="Make admin"
          triggerClassName="rounded-none"
        />
      ) : null}

      {status === "BLOCKED" ? (
        <ActionDialog
          action={unblockUserAction}
          id={id}
          title="Restore this account?"
          description="The user will be able to sign in and use the platform again."
          confirmLabel="Unblock"
          pendingLabel="Restoring..."
          icon={CheckCircle2}
          triggerLabel="Unblock"
          triggerClassName="rounded-none"
        />
      ) : (
        <ActionDialog
          action={blockUserAction}
          id={id}
          title="Block this account?"
          description="The user will be signed out and blocked from authenticated requests."
          confirmLabel="Block"
          pendingLabel="Blocking..."
          icon={Ban}
          triggerLabel="Block"
          triggerClassName="rounded-none text-destructive hover:text-destructive"
        />
      )}

      <ActionDialog
        action={deleteUserAction}
        id={id}
        title="Remove this account?"
        description="This soft-deletes the account. This action is hard to undo."
        confirmLabel="Remove"
        pendingLabel="Removing..."
        destructive
        icon={Trash2}
        triggerLabel="Delete"
        triggerClassName="rounded-none text-destructive hover:text-destructive"
      />
    </div>
  );
}
