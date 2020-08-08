import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import classes from "./onboard-chunk.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(classes);

import Button from "../button/button";
import Input from "../input/input";

const OnboardChunk: React.FC<{
  mode: "login" | "register";
}> = ({ mode }) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submit = () => {
    if (mode === "login") {
      fetch('/api/account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        }),
        credentials: 'include'
      }).then(res => res.json()).then(console.log).then(() => {
          window.location.replace('/dash');
      }).catch((err) => {
        console.error(err);
      });
    } else {
      fetch('/api/account/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            username,
            password
        }),
        credentials: 'include'
      }).then(res => res.json()).then(console.log).then(() => {
          window.location.replace('/dash');
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  return (
    <motion.div className={classes.forms}>
      <div
        className={cx({
          forms__container: true,
          forms__container__block: true,
          "forms__container__block--green": true,
        })}
      >
        <div className={classes.forms__container__block__chunk}>
          <h1>{mode === "login" ? "New User?" : "Existing User?"}</h1>
          <p>
            {mode === "login"
              ? "Sign up for Midnight.Cash and start receiving crypto donations with a simple link."
              : "Sign in to Midnight.Cash and start receiving crypto donations with a simple link."}
          </p>
          <Link href={`/${mode === "login" ? "register" : "login"}`}>
            <a>
              <Button
                color="white"
                text={mode === "login" ? "Get Started" : "Log In"}
              />
            </a>
          </Link>
        </div>
      </div>
      <div
        className={cx({
          forms__container: true,
          forms__container__block: true,
        })}
      >
        <div className={classes.forms__container__block__chunk}>
          <h1>{mode === "login" ? "Log In" : "Sign Up"}</h1>
          <form>
            {mode === "register" && (
              <Input
                label="Username"
                name="username"
                type="username"
                placeholder="satoshi.nakamoto"
                value={username}
                onChange={setUsername}
              />
            )}

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
            <Button
              text={mode === "login" ? "Log In" : "Sign Up"}
              onClick={submit}
            />
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardChunk;
