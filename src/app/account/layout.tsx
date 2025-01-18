import { PropsWithChildren } from "react";
import { singleLevelNestedRoutes } from "../data/routes";
import NavBar from "@/components/ui/navbar";
import { ContentWrapper } from "@/components/ui/content-wrapper";
import { Heading } from "@/components/ui/heading";
import { Line } from "@/components/ui/line";
import { SecondaryMenu } from "@/components/secondary-menu";
import { PaymentConnectionStatus } from "@/components/admin/payment-connection-status";
import { Footer } from "@/components/footer";

export default async function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <NavBar showSecondAnnouncementBar={false} />
      <div>
        <div className="bg-secondary py-2 md:px-6 border-b border-border">
          <ContentWrapper className="flex items-center justify-between">
            <Heading size="h2">Your Account</Heading>
            <div className="p-[1px] bg-gray-400 rounded-full">
              {/* <UserButton afterSignOutUrl={process.env.NEXT_PUBLIC_APP_URL} /> */}
            </div>
          </ContentWrapper>
        </div>
        <div>
          <ContentWrapper className="w-full py-2 flex items-center justify-between">
            <SecondaryMenu menuItems={menuItems} />
            <PaymentConnectionStatus />
          </ContentWrapper>
        </div>
        <Line />
      </div>
      <ContentWrapper className="w-full flex items-start flex-col flex-1 mb-8">
        <div className="w-full">{children}</div>
      </ContentWrapper>

      <Footer />
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
