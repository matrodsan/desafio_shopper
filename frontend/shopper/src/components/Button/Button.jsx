import React from "react";
import "./Button.css";

const Button = (props) => {
  const { children, funcao = () => {}, disabled = false } = props;
  return (
    <button onClick={funcao} className="button" disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
