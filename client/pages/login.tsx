import React, { useState } from "react";
import { motion } from "framer-motion";

import Button from "../components/button/button";
import Input from "../components/input/input";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <motion.main className="page">
      <div className="logo">Midnight.Cash</div>

      <div className="forms">
        <div className="forms__container forms__container__block forms__container__block--green">
          <div className="forms__container__block__chunk">
            <h1>New User?</h1>
            <p>
              Sign up for Privacy and get more control over your payments in
              just a few minutes.
            </p>
            <Button color="white" text="Get Started" />
          </div>
        </div>
        <div className="forms__container forms__container__block">
          <div className="forms__container__block__chunk">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="satoshi@midnight.cash"
                value={email}
                onChange={setEmail}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={setPassword}
              />

              <Button text="Log In" />
            </form>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default Login;
