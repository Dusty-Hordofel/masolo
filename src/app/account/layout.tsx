import { PropsWithChildren } from "react";
import { singleLevelNestedRoutes } from "../data/routes";
import NavBar from "@/components/ui/navbar";

export default async function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <NavBar showSecondAnnouncementBar={false} />
      {children}
    </div>
  );
}

export type MenuItems = { name: string; href: string; group: Groups }[];
type Groups = "buying" | "selling";

const menuItems: MenuItems = [
  {
    name: "Profile",
    href: singleLevelNestedRoutes.account.profile,
    group: "selling",
  },
  {
    name: "Products",
    href: singleLevelNestedRoutes.account.products,
    group: "selling",
  },
  {
    name: "Orders",
    href: singleLevelNestedRoutes.account.orders,
    group: "selling",
  },
  {
    name: "Payments",
    href: singleLevelNestedRoutes.account.payments,
    group: "selling",
  },
  {
    name: "Your purchases",
    href: singleLevelNestedRoutes.account["your-purchases"],
    group: "buying",
  },
];
