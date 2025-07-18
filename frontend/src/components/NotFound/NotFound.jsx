import { useNavigate } from "react-router";
import style from "./NotFound.module.css";
import { useEffect, useState } from "react";
import logo from "/logo/logo.png";


export default function NotFound({ children }) {
  const [secondsLeft, setSecondsLeft] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className={style.wrap}>
    <img className={style.logo} width={200} height={190} src={logo} alt="Logo" />
      <h1 className={style.name}>dZENcode TestProject</h1>
      <div className={style.err}>
        <h2 className={style.title}>Error</h2>
        {children}
      </div>{" "}
      <p className={style.timer}>
        Redirecting to main page in {secondsLeft}{" "}
        {secondsLeft === 1 ? "second" : "seconds"}
        ...
      </p>
    </div>
  );
}
