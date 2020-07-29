import React from "react";
import { motion } from "framer-motion";

import Logo from "../components/logo/logo";
import OnboardChunk from "../components/onboard-chunk/onboard-chunk";

const Register: React.FC = () => {
  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <motion.main className="page">
      <div className="d-flex flex-center">
        <Logo />
      </div>

      <OnboardChunk mode="register" submit={handleSubmit} />
    </motion.main>
  );
};

export default Register;
