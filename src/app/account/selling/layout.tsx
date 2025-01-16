import { CreateNewStore } from "@/components/admin/create-new-store";
import { PropsWithChildren } from "react";

export default async function SellerLayout(props: PropsWithChildren) {
  const user = 33;

  return (
    <>
      {user === Number(34) ? (
        <div className="flex flex-col gap-4">{props.children}</div>
      ) : (
        <div className="max-w-[1400px] m-auto p-6 w-full flex items-start flex-col flex-1 mb-8">
          <CreateNewStore />
        </div>
      )}
    </>
  );
}
