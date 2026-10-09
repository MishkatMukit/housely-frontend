"use client";

import { LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { logoutAction } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import type { User, UserRole } from "@/types/api";

function dashboardPath(role: UserRole) {
  if (role === "ADMIN" || role === "SUPERADMIN") return "/admin";
  if (role === "OWNER") return "/owner";
  return "/tenant";
}

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    setAuth(user, null);
  }, [user, setAuth]);

  const handleLogout = async () => {
    await logoutAction();
    clearAuth();
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  };

  const initials = user.name?.slice(0, 2).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="relative h-9 w-9 rounded-full" />
        }
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.imageUrl ?? undefined} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(dashboardPath(user.role))}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <UserIcon className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
