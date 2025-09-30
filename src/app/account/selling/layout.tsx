
import { CreateNewStore } from "@/components/admin/create-new-store";
/* import { currentUser } from "@/lib/auth"; */
import { PropsWithChildren } from "react";


import { auth } from "@/lib/(auth)/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ErrorState from "./error-state";
import { StoreService } from "@/services/prisma/store.service";

export default async function SellerLayout(props: PropsWithChildren) {

  const result = await StoreService.fetchUserStores();
  console.log("🚀 ~ SellerLayout ~ result:TALA", result)

  if ("redirect" in result) {
  redirect(result.redirect as string);
}


 if (!result.success) {
  return (
    <ErrorState
      title={result.title ?? "Erreur"}
      description={result.description ?? "Une erreur est survenue."}
      onRetry={() => window.location.reload()} // recharge la page
      backLabel="Retour à l’accueil"
    />
  );
}

  return (
    <>

      {result?.data?.length === 0 ? (
        <div className="max-w-[1400px] m-auto p-6 w-full flex items-start flex-col flex-1 mb-8">
          <CreateNewStore />
        </div>
      ) : (
        <div className="flex flex-col gap-4">{props.children}</div>
      )} 
    </>
  );
}
