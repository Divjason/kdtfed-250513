import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";
import {
  Container,
  Title,
  Form,
  Input,
  Error,
  Switcher,
} from "../components/auth-components";
import GithubBtn from "../components/GithubBtn";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      console.log(e);
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container>
      <Title>Login 🕊️</Title>
      <Form onSubmit={onSubmit}>
        <Input
          value={email}
          onChange={onChange}
          type="email"
          name="email"
          autoComplete="user-email"
          placeholder="Email"
          required
        />
        <Input
          value={password}
          onChange={onChange}
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          required
        />
        <Input type="submit" value={isLoading ? "Loading" : "Log in"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{" "}
        <Link to={"/create-account"}>Create one &rarr;</Link>
      </Switcher>
      <GithubBtn />
    </Container>
  );
};

export default Login;
