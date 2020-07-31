import React from "react";
import { motion } from "framer-motion";
import classes from "./card.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(classes);

const OnboardChunk: React.FC<{
  title: string;
  labels: string[];
  helper?: { text: string; onClick: () => void };
  wallets?: {
    icon: string;
    wallet: string;
    currency: string;
    address: string;
  }[];
  transactions?: {
    icon: string;
    timestamp: string;
    sender: string;
    amount: string;
  }[];
}> = ({ title, helper, labels, wallets, transactions }) => {
  const ellipses = (str: string): string => {
    return str.length > 12
      ? str.substr(0, 6) + "..." + str.substr(str.length - 6, str.length)
      : str;
  };
  return (
    <motion.div className={classes.card}>
      <div className={classes.card__header}>
        <span>{title}</span>
        {helper && (
          <button
            className={classes.card__header__helper}
            onClick={helper.onClick}
          >
            {helper.text}
          </button>
        )}
      </div>
      <div className={classes.card__labels}>
        {labels.map((label: string, index: number) => (
          <span key={index}>{label}</span>
        ))}
      </div>
      <div className={classes.card__body}>
        {wallets &&
          wallets.map((cell, index: number) => (
            <motion.div className={classes.card__cell} key={index}>
              <div className={classes.card__cell__primary}>
                <img className={classes.card__cell__icon} src={cell.icon} />
                {cell.wallet}
              </div>
              <span>{cell.currency}</span>
              <span>{ellipses(cell.address)}</span>
              <div className={classes.card__cell__manage}>Manage</div>
            </motion.div>
          ))}
        {transactions &&
          transactions.map((cell, index: number) => (
            <motion.div className={classes.card__cell} key={index}>
              <div className={classes.card__cell__primary}>
                <img className={classes.card__cell__icon} src={cell.icon} />
                {cell.timestamp}
              </div>
              <span>{ellipses(cell.sender)}</span>
              <span>{cell.amount}</span>
              <div className={classes.card__cell__manage}>Manage</div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
};

export default OnboardChunk;
