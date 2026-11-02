/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";


export default function CurrentYear() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <span suppressHydrationWarning>{year}</span>;
}
