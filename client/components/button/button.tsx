import React from "react";
import { motion } from "framer-motion";
import classes from "./button.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(classes);

const Button: React.FC<{ text: string; color?: "white", onClick: () => void }> = ({
  text,
  color,
  onClick
}) => (
  <motion.button
    type={'button'}
    whileHover={{ scale: 0.99 }}
    whileTap={{ scale: 0.97 }}
    className={cx({
      button: true,
      "h-align": true,
      button__white: color === "white",
    })}
    onClick={onClick}
  >
    {text}
  </motion.button>
);

export default Button;
