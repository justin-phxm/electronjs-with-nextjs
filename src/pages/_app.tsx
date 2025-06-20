import { DistributionSystemProvider } from "@/lib/hooks/DistributionSystemContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DistributionSystemProvider>
      <Component {...pageProps} />;
    </DistributionSystemProvider>
  );
}
