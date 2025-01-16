import { CreateNewStore } from "@/components/admin/create-new-store";
import React from "react";

type Props = {};

const PageStore = (props: Props) => {
  return (
    <div className="max-w-[1400px] m-auto p-6 w-full flex items-start flex-col flex-1 mb-8">
      <CreateNewStore />
    </div>
  );
};

export default PageStore;
