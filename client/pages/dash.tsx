import React, { useState } from "react";
import { motion } from "framer-motion";
import Gravatar from "react-gravatar";

import Logo from "../components/logo/logo";
import Card from "../components/card/card";
import Modal from "../components/modal/modal";
import Input from "../components/input/input";
import copyUtil from "../utils/copy-util";

const Dash: React.FC = () => {
  const [newWallet, setNewWallet] = useState<string>("");
  const [addingWallet, addWallet] = useState<boolean>(false);
  const user = {
    tag: "ash",
    fullName: "Ash Bhimasani",
    email: "ash@bhimasani.com",
  };
  return (
    <>
      <Modal open={addingWallet} close={() => addWallet(false)}>
        <div className="card__wrapper" style={{ maxWidth: 600 }}>
          <Card
            title="Add Wallet"
            helper={{ text: "Save", onClick: () => addWallet(false) }}
          >
            <div style={{ padding: 40, paddingTop: 0 }}>
              <Input
                label="Wallet Name"
                name="new-wallet"
                type="text"
                placeholder="My Wallet"
                value={newWallet}
                onChange={setNewWallet}
                lightMode
              />
              <Input
                label="Address"
                name="wallet-address"
                type="text"
                placeholder="0x0000000000000"
                value={newWallet}
                onChange={setNewWallet}
                lightMode
              />
            </div>
          </Card>
        </div>
      </Modal>
      <motion.main className="page page__light">
        <div className="header">
          <Logo />

          <div className="account">
            <Gravatar email={user.email} size={36} className="account__icon" />
            <div className="d-flex flex-col">
              <span className="account__header">{user.fullName}</span>
              <span className="account__caption">{user.email}</span>
            </div>
          </div>

          <motion.a
            onClick={() => copyUtil("https://midnight.cash/u/ash")}
            href="https://midnight.cash/u/ash"
            target="_blank"
            rel="noreferrer noopener"
            className="net"
          >
            midnight.cash/u/ash
          </motion.a>
        </div>

        <div className="card__wrapper">
          <Card
            title="Destinations"
            helper={{ text: "Add Wallets", onClick: () => addWallet(true) }}
            labels={["Wallet", "Currency", "Address"]}
            wallets={[
              {
                icon: "/wallet-logos/coinbase.svg",
                wallet: "Coinbase",
                currency: "BCH",
                address: "qzqzzne78upqzfd40nh9at3jtsgpr9qqe5v5rcpv6e",
              },
              {
                icon: "/wallet-logos/copay-wallet.svg",
                wallet: "Copay",
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
                icon: "/wallet-logos/copay-wallet.svg",
                timestamp: "9:38 pm",
                sender: "qzqzzne78upqzfd40nh9at3jtsgpr9qqe5v5rcpv6e",
                amount: "0.1 BCH",
              },
              {
                icon: "/wallet-logos/coinbase.svg",
                timestamp: "9:38 pm",
                sender: "qzqzzne78upqzfd40nh9at3jtsgpr9qqe5v5rcpv6e",
                amount: "0.1 BCH",
              },
            ]}
          />
        </div>
      </motion.main>
    </>
  );
};

export default Dash;
