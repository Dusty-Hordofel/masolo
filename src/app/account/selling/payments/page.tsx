import { HeadingAndSubheading } from "@/components/admin/heading-and-subheading";
import { InfoCard } from "@/components/admin/info-card";
import { Button } from "@/components/ui/button";
import {
  createAccountLink,
  getStripeAccountDetails,
  hasConnectedStripeAccount,
  updateStripeAccountStatus,
} from "@/server-actions/stripe/account";
import { CreditCard } from "lucide-react";
import { CreateConnectedAccount } from "./components/create-connected-account";

// "b4d35aad-f0bd-41d7-827f-1c8a82bef234"
type Props = {};

const PaymentsPage = async (props: Props) => {
  await updateStripeAccountStatus("b4d35aad-f0bd-41d7-827f-1c8a82bef234");

  //   console.log("🚀 ~ PaymentsPage ~ momo:", momo);
  const connectedStripeAccount = await hasConnectedStripeAccount();
  console.log(
    "🚀 ~ PaymentsPage ~ connectedStripeAccount:",
    connectedStripeAccount
  );

  const storeId = "b4d35aad-f0bd-41d7-827f-1c8a82bef234";
  // const storeId = Number(await getStoreId());

  const stripeAccountDetails = await getStripeAccountDetails(storeId);
  console.log(
    "🚀 ~ PaymentsPage ~ stripeAccountDetails:",
    stripeAccountDetails
  );

  return (
    <>
      <HeadingAndSubheading
        heading="Payments"
        subheading="View your payouts and manage your payment settings"
      />
      {connectedStripeAccount ? (
        <div>
          <div className="p-2 px-4 border bg-secondary border-border text-gray-700 rounded-md">
            <span className="font-semibold">Payment status:</span> Stripe
            account connected
          </div>
          <div className="border border-border p-4 rounded-md mt-4">
            <p className="font-semibold text-gray-700">Stripe Details</p>
            <p>
              {/* Currency: {stripeAccountDetails?.default_currency.toUpperCase()} */}
            </p>
            {/* <p>Country: {stripeAccountDetails?.country}</p>
            <p>Account Email: {stripeAccountDetails?.email}</p> */}
            <a
              href="https://www.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="mt-4">
                Update in Stripe
              </Button>
            </a>
          </div>
        </div>
      ) : (
        <InfoCard
          heading="Payments aren't setup yet"
          subheading="Link your stripe account to start accepting orders"
          icon={<CreditCard size={36} className="text-gray-600" />}
          button={
            // pass server action from server component to client component - work around for nextjs/server actions bug with clerk.
            // calling the server action inside the client component causes a clerk error of "Error: Clerk: auth() and currentUser() are only supported in App Router (/app directory)"
            <CreateConnectedAccount createAccountLink={createAccountLink} />
          }
        />
      )}
    </>
  );
};

export default PaymentsPage;
