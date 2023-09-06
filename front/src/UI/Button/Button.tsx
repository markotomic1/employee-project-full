import "./button.scss";
import { ReactNode } from "react";

const Button = (props: {
  children: string | ReactNode;
  type?: "submit" | "button";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <button
      type={props.type || "button"}
      className={props.className + " button"}
      disabled={props.disabled}
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </button>
  );
};

export default Button;
