import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Gravatar from "react-gravatar";

import Logo from "../components/logo/logo";
import Card from "../components/card/card";
import Modal from "../components/modal/modal";
import Input from "../components/input/input";
import copyUtil from "../utils/copy-util";
import { GetServerSideProps } from "next";
import { Http2ServerResponse } from "http2";

let decoder = new TextDecoder("utf-8");

const Dash: React.FC<{ email: String }> = ({ email }) => {
  const [newWallet, setNewWallet] = useState<string>("");
  const [addingWallet, addWallet] = useState<boolean>(false);
  const user = {
    tag: "ash",
    fullName: "Ash Bhimasani",
    email: "ash@bhimasani.com",
  };
  const [receiveSettings, setReceiveSettings] = useState([]);
  const [username, setUsername] = useState("");
  let [donationHistory, setDonationHistory] = useState<any[]>([]);

  // onLoad effect
  useEffect(() => {
    console.log(`Notification.permission: ${Notification.permission}`);
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((result) => {
        console.log(result);
      });
    }
    if (email) {
      let donationStream = fetch('/api/account/donations/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email
        }),
        credentials: 'include'
      }).then(res => {
        if (!res.body) {
          return;
        }
        let buffer = Buffer.from('');
        return res.body.pipeTo(new WritableStream({
          write(message) {
            try {
              const msg = decoder.decode(message);
              buffer = Buffer.concat([buffer, Buffer.from(msg)]);
            } catch (e) {
              console.error(e);
            }
          },
          close() {
            let bufferStr = decoder.decode(buffer);
            let split = bufferStr.split('\n');
            let donations = split.map((str) => {
              if (!str) {
                return;
              }
              try {
                const donation = JSON.parse(str);
                return donation;
              } catch (e) {
                console.error(e);
              }
            }).filter((s) => s);
            return setDonationHistory(donations);
          }
        }));
      }).catch(console.error);

      fetch("/api/account/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          email,
        }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          return Promise.resolve(res);
        })
        .then((res) => {
          setReceiveSettings(res.receiveSettings);
          if (res.username) setUsername(res.username);
        })
        .catch(console.error);
    }
  }, []);

  let icons: { [key: string]: string } = {
    'coinbase': '/wallet-logos/coinbase.svg',
    'copay': '/wallet-logos/copay-wallet.svg'
  };

  const wallets = receiveSettings
  ? receiveSettings
      .map((i) => {
        return {
          currency: i.currency,
          type: "Address",
          value: i.address,
        };
      })
      .map((i) => {
        let label = (i.currency === 'BCH') ? 'Coinbase' : 'Copay';
        let iconPath = null;
        Object.keys(icons).find((icon) => {
          if (label.toLowerCase().includes(icon)) {
            iconPath = icons[icon];
          }
        });
        return {
          icon: iconPath,
          wallet: label,
          currency: i.currency,
          address: (i.type === 'Address') ? i.value : 'Invalid'
        }
      })
  : [];

  const transactions = (donationHistory && donationHistory.length) ? donationHistory.map((i) => {
    console.log(i);
    return {
      icon: '',
      timestamp: i.transaction,
      sender: i.receivingAddress,
      amount: i.currency
    }
  }) : [];

  const invoiceUrl = username ? `midnight.cash/u/${username}` : 'midnight.cash/register';

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
            onClick={() => copyUtil('https://' + invoiceUrl)}
            href={'https://' + invoiceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="net"
          >
            {invoiceUrl}
          </motion.a>
        </div>

        <div className="card__wrapper">
          <Card
            title="Destinations"
            helper={{ text: "Add Wallets", onClick: () => addWallet(true) }}
            labels={["Wallet", "Currency", "Address"]}
            wallets={wallets}
          />

          <Card
            title="TX History"
            labels={["Timestamp", "Sender", "Amount"]}
            // transactions={[
            //   {
            //     icon: "/wallet-logos/copay-wallet.svg",
            //     timestamp: "9:38 pm",
            //     sender: "qzqzzne78upqzfd40nh9at3jtsgpr9qqe5v5rcpv6e",
            //     amount: "0.1 BCH",
            //   },
            //   {
            //     icon: "/wallet-logos/coinbase.svg",
            //     timestamp: "9:38 pm",
            //     sender: "qzqzzne78upqzfd40nh9at3jtsgpr9qqe5v5rcpv6e",
            //     amount: "0.1 BCH",
            //   },
            // ]}
            transactions={transactions}
          />
        </div>
      </motion.main>
    </>
  );
};

export default Dash;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  return {
    props: {
      name: "Midnight Cash",
      email: res.locals.email || null,
    },
  };
};