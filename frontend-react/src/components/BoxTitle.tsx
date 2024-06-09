import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
interface boxTitle {
  title: string;
  classname?: string;
}

const BoxTitle = (props: boxTitle) => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);

  return (
    <p
      className={`text-3xl ${is_light ? "text-black" : "text-white"} ${
        props.classname
      }`}
    >
      {props.title}
    </p>
  );
};

export default BoxTitle;
