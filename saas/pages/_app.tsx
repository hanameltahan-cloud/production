import type { AppProps } from "next/app";
import Head from "next/head";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "../styles/globals.css";
import { Toaster } from "sonner";
import { LanguageProvider } from "../lib/LanguageContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        cssLayerName: "clerk",
      }}
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
      </Head>
      <LanguageProvider>
        {/* Auth Header */}
        <div className="fixed top-3 left-3 sm:left-4 z-50">
          <SignedOut>
            <SignInButton
              mode="modal"
              forceRedirectUrl="/"
              fallbackRedirectUrl="/"
            >
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-md shadow-lg hover:shadow-xl transition-all">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 sm:w-9 sm:h-9",
                },
              }}
            />
          </SignedIn>
        </div>

        <Component {...pageProps} />
        <Toaster />
      </LanguageProvider>
    </ClerkProvider>
  );
}
