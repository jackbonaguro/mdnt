import React from "react";
import { motion } from "framer-motion";
import classes from "./input.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(classes);

const Input: React.FC<{
  label: string;
  value: string;
  name: string;
  type: string;
  placeholder: string;
  onChange: (value: string) => void;
  lightMode?: boolean;
}> = ({ label, value, name, type, placeholder, onChange, lightMode }) => (
  <motion.label className={cx({ label: true, light: lightMode })}>
    <motion.div className={classes.label__text}>{label}</motion.div>
    <motion.input
      className={classes.input}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </motion.label>
);

export default Input;
