import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <p className="scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Mosala
      </p>
    </Link>
  );
};
