import GoogleIcon from "../assets/icons/button/google.svg";

interface button {
  className?: string;
  is_orange?: boolean;
  is_google_btn?: boolean;
  title: string;
  fun: () => void;
}

const Button = (props: button) => {
  return (
    <div
      onClick={() => props.fun()}
      className={`${
        props.className
      }  w-300 h-10 rounded-full flex items-center justify-around cursor-pointer transition-all hover:scale-95
      ${props.is_orange ? "bg-orange_shade" : "bg-green_shade"}
      `}
    >
      {props.is_google_btn && <img src={GoogleIcon} className="w-9" />}
      <p className="text-white">{props.title}</p>
    </div>
  );
};

export default Button;
