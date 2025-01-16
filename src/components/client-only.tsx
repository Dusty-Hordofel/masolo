"use client";

import { useEffect, useState } from "react";

interface clientOnlyProps {
  children: React.ReactNode;
}
const ClientOnly = ({ children }: clientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  return <>{children}</>;
};

export default ClientOnly;
