import MoreIcon from "../assets/icons/info/more.svg";
import { useNavigate } from "react-router-dom";

interface props {
  is_to_right: boolean;
}

const More = (props: props) => {
  const navigate = useNavigate();
  return (
    <img
      onClick={() => {
        navigate(props.is_to_right ? "/profile-password" : "/profile-info");
      }}
      src={MoreIcon}
      className={`${
        props.is_to_right ? "right-28" : "left-28 rotate-180"
      } bottom-10 fixed cursor-pointer`}
    />
  );
};

export default More;
