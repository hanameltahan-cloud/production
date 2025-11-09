import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import { Toaster } from "sonner";
import { LanguageProvider } from "../lib/LanguageContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
      </Head>
      <LanguageProvider>
        <Component {...pageProps} />
        <Toaster />
      </LanguageProvider>
    </>
  );
}
