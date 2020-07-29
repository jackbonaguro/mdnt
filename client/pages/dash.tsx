import React, { useState } from "react";
import { motion } from "framer-motion";

import Button from "../components/button/button";
import Input from "../components/input/input";

const Dash: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <motion.main className="page page__light">
      <div className="header">
        <div className="logo">Midnight.Cash</div>
      </div>
    </motion.main>
  );
};

export default Dash;
