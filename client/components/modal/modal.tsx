import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./modal.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(classes);

const modalAnimation = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
    },
  },
  exit: { opacity: 0 },
};

const childAnimation = {
  initial: {
    opacity: 0,
    rotateX: 30,
    translateY: 40,
  },
  animate: {
    opacity: 1,
    rotateX: 0,
    translateY: 0,
  },
  exit: { opacity: 0, rotateX: 0, translateY: 30 },
};

const Modal: React.FC<{
  children?: React.ReactNode;
  open: boolean;
  close: () => void;
}> = ({ children, open, close }) => {
  const content = useRef<HTMLDivElement>(null);
  const handleClick = (e): void => {
    if (content.current && !content.current.contains(e.target)) {
      close();
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={classes.modal}
          onClick={handleClick}
          variants={modalAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className="d-flex w-100"
            variants={childAnimation}
            ref={content}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
