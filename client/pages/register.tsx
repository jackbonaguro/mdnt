import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import Button from "../components/button/button";
import Input from "../components/input/input";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
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
            <h1>Existing User?</h1>
            <p>
              Sign in to Midnight.Cash and start receiving crypto donations with
              a simple link.
            </p>
            <Link href="/login">
              <a>
                <Button color="white" text="Log In" />
              </a>
            </Link>
          </div>
        </div>
        <div className="forms__container forms__container__block">
          <div className="forms__container__block__chunk">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
              <Input
                label="Username"
                name="username"
                type="username"
                placeholder="satoshi.nakamoto"
                value={username}
                onChange={setUsername}
              />

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

              <Button text="Sign Up" />
            </form>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default Register;
