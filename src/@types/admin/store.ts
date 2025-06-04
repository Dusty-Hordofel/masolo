import { Payment, Store } from "@prisma/client";

export type StoreWithPayment = Store & { payments: Payment[] };
