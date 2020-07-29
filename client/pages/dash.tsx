import React, { useState } from "react";
import { motion } from "framer-motion";

import Logo from "../components/logo/logo";
import Button from "../components/button/button";
import Input from "../components/input/input";

const Dash: React.FC = () => {
  return (
    <motion.main className="page page__light">
      <div className="header">
        <Logo />
      </div>
    </motion.main>
  );
};

export default Dash;
