"use client";
import * as React from "react";
import Link from "next/link";
import { DashboardIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { User } from "better-auth";
import { signOut } from "@/lib/(auth)/better-auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserAccountMenuProps
  extends React.ComponentPropsWithRef<typeof DropdownMenuTrigger>,
    ButtonProps {
  user: User | null;
}

export function UserAccountMenu({
  user,
  className,
  ...props
}: UserAccountMenuProps) {
  const route = useRouter();

  if (!user) return;

  const initials = `${user.name?.slice(0, 2) ?? ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("size-8 rounded-full", className)}
          {...props}
        >
          <Avatar className="size-8">
            <AvatarImage src={user.image as string} alt={user.name ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <React.Suspense fallback={<SkeletonMenuItems />}>
          <UserAccountMenuItems />
        </React.Suspense>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div
            className="cursor-pointer"
            onClick={async () => {
              try {
                await signOut();

                toast("Sign out success!", {
                  description:
                    "You have been signed out. Redirecting to the homepage...",
                });

                route.push("/");
              } catch (error) {
                toast("Error!", {
                  description: `${error}`,
                });
              }
            }}
          >
            <ExitIcon className="mr-2 size-4" aria-hidden="true" />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SkeletonMenuItems() {
  return (
    <div className="flex flex-col space-y-1.5 p-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-full rounded-sm" />
      ))}
    </div>
  );
}

function UserAccountMenuItems() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link href={"/user"} className="cursor-pointer">
          <DashboardIcon className="mr-2 size-4" aria-hidden="true" />
          Dashboard
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/user" className="cursor-pointer">
          <Icons.credit className="mr-2 size-4" aria-hidden="true" />
          Billing
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/user" className="cursor-pointer">
          <GearIcon className="mr-2 size-4" aria-hidden="true" />
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
