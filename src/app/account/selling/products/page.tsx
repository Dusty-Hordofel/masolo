import { HeadingAndSubheading } from "@/components/admin/heading-and-subheading";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const ProductsPage = (props: Props) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <HeadingAndSubheading
          heading="Products"
          subheading="View and manage your products"
        />
        <Link
          href="/account/selling/product/new"
          // className={cn(buttonVariants({ variant: "default" }), "font-medium")}
        >
          <Button>
            New Product <Plus size={18} className="ml-2" />
          </Button>
        </Link>
      </div>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
        consequuntur animi nisi fugit repellendus reprehenderit, non atque, qui
        pariatur esse eveniet. Error officiis soluta libero natus optio vel quae
        est explicabo maiores ipsa quidem, molestias aliquid expedita
        repudiandae nisi praesentium ipsum repellendus id porro harum ullam
        consequuntur fugit? Hic nisi voluptatibus perspiciatis fuga dolorum
        fugiat consequatur dolore ut sunt, ex, molestias cupiditate optio sit
        magni maxime dolores possimus adipisci! Officia nobis modi libero quos
        aperiam iure voluptate eaque totam pariatur. Facere fugit autem expedita
        cupiditate nisi ex ullam velit ipsa excepturi fugiat, ipsum quidem amet
        pariatur dolorem impedit sint facilis! Laborum, ab saepe, laboriosam
        temporibus inventore vero animi non, natus quis tenetur fugit? At ea
        corrupti quos qui repudiandae saepe magnam error similique sit
        distinctio deleniti voluptatum rem nostrum tempora culpa ratione, iure
        excepturi, quibusdam nesciunt vitae! Assumenda alias reprehenderit
        natus, dolores tempora deserunt vel accusamus ex, doloremque delectus
        id! Laborum, ea hic eligendi recusandae velit debitis quasi
        exercitationem minus ratione. Officiis fuga facere dolores eos magnam?
        Ad dolores nam neque alias. Aliquam dolores aspernatur sit tempore,
        perferendis voluptatem ut laborum iste omnis repudiandae, modi, esse
        inventore. Alias veritatis nobis consectetur itaque numquam officiis?
        Qui itaque error similique voluptas est!
      </p>
    </>
  );
};

export default ProductsPage;
