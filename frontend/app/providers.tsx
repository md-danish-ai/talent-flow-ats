"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { queryClientConfig } from "@lib/react-query/query-client";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
