import { CreateNewStore } from "@/components/admin/create-new-store";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function SellerLayout(props: PropsWithChildren) {
  // const user = await currentUser();
  // console.log("🚀 ~ SellerLayout ~ user:MA", user);

  // if (!user || user.role !== "USER") return redirect("/auth/login");

  return (
    <>
      <div className="flex flex-col gap-4">{props.children}</div>
      {/* {user.store.length > 0 ? (
        <div className="flex flex-col gap-4">{props.children}</div>
      ) : (
        <div className="max-w-[1400px] m-auto p-6 w-full flex items-start flex-col flex-1 mb-8">
          <CreateNewStore />
        </div>
      )} */}
    </>
  );
}
