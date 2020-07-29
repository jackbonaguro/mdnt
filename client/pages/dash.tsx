import React from "react";
import { motion } from "framer-motion";

import Logo from "../components/logo/logo";

const Dash: React.FC = () => {
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
      </div>

      <div className="card__wrapper">
        <div className="card">
          <div className="card__header">
            <span>Destinations</span>
            <button className="card__header__helper">Add Wallet</button>
          </div>
          <div className="card__labels">
            <div>Asset</div>
            <div>Currency</div>
            <div>Address</div>
          </div>
          <div className="card__body">
            <div className="card__cell">Coinbase Wallet</div>
            <div className="card__cell">Coinbase Pro</div>
          </div>
        </div>
        <div className="card">
          <div className="card__header">TX History</div>
          <div className="card__labels">
            <div>Destinations</div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default Dash;
