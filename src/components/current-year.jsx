"use client";

import { useEffect, useState } from "react";

/* The footer is server rendered, so the year is stamped by the client after
   hydration instead of calling Date while prerendering pages. */
export default function CurrentYear() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <span suppressHydrationWarning>{year}</span>;
}
