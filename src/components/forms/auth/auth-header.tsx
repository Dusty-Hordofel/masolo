// import { HeadingAndSubheading } from "@/components/admin/heading-and-subheading";
import { Heading } from "@/components/ui/heading";
import React from "react";

type UserAuthHeaderProps = {
  title: string;
  // description: string;
};

const AuthHeader = ({ title }: UserAuthHeaderProps) => {
  return (
    <div className="flex flex-col space-y-2 text-center">
      <Heading size="h1" className="text-3xl lg:text-[28px] text-start">
        {title}
      </Heading>
      {/* <HeadingAndSubheading
        heading={title}
        subheading={description}
        textClassName="text-sm mb-0"
      /> */}
    </div>
  );
};

export default AuthHeader;
