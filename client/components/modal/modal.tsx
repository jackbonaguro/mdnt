import React from "react";
import { motion } from "framer-motion";
import classes from "./modal.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(classes);

const Modal: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <motion.div className={classes.modal}>{children}</motion.div>
);

export default Modal;
