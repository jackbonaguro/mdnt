import React from "react";
import Head from "next/head";
import "../styles/styles.scss";

const MidnightCash: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Midnight.Cash - Venmo for Crypto</title>
      <meta
        property="description"
        content="Get Wiggly Today"
        key="description"
      />
      <link rel="shortcut icon" href="/midnight-cash.svg" />
    </Head>
    <Component {...pageProps} />
  </>
);

export default MidnightCash;
