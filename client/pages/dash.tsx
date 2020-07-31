import React from "react";
import { motion } from "framer-motion";

import Logo from "../components/logo/logo";
import Card from "../components/card/card";

const Dash: React.FC = () => {
  const addWallet = (): void => {
    console.log("add wallet");
  };
  return (
    <motion.main className="page page__light">
      <div className="header">
        <Logo />

        <div className="account">
          <img
            className="account__icon"
            src="https://ash.bhimasani.com/logos/ab-logo.svg"
          />
          <div className="d-flex flex-col">
            <span className="account__header">Ash Bhimasani</span>
            <span className="account__caption">ash@bhimasani.com</span>
          </div>
        </div>

        <div className="net">
          <div className="d-flex flex-center flex-col">
            <span>Net</span>
            <h1>$1000</h1>
          </div>
        </div>
      </div>

      <div className="card__wrapper">
        <Card
          title="Destinations"
          helper={{ text: "Add Wallets", onClick: addWallet }}
          labels={["Asset", "Currency", "Address"]}
          wallets={[
            {
              icon: "https://ash.bhimasani.com/logos/bitpay-ext.svg",
              wallet: "Coinbase",
              currency: "BCH",
              address: "qzqzzne78upqzfd40nh9at3jtsgpr9qqe5v5rcpv6e",
            },
            {
              icon: "https://ash.bhimasani.com/logos/bitpay-ext.svg",
              wallet: "Coinbase",
              currency: "BCH",
              address: "qzqzzne78upqzfd40nh9at3jtsgpr9qqe5v5rcpv6e",
            },
          ]}
        />

        <Card
          title="TX History"
          labels={["Timestamp", "Sender", "Amount"]}
          transactions={[
            {
              icon: "https://ash.bhimasani.com/logos/bitpay-ext.svg",
              timestamp: "9:38 pm",
              sender: "qzqzzne78upqzfd40nh9at3jtsgpr9qqe5v5rcpv6e",
              amount: "0.1 BCH",
            },
            {
              icon: "https://ash.bhimasani.com/logos/bitpay-ext.svg",
              timestamp: "9:38 pm",
              sender: "qzqzzne78upqzfd40nh9at3jtsgpr9qqe5v5rcpv6e",
              amount: "0.1 BCH",
            },
          ]}
        />
      </div>
    </motion.main>
  );
};

export default Dash;
