import DarkIcon from "../assets/icons/theme/dark.svg";
import LightIcon from "../assets/icons/theme/light.svg";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import { toggleTheme } from "../cache/redux-toolkit/features/themeSlice";

const Theme = () => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);
  const dispatch = useDispatch();

  return (
    <section
      className="fixed top-10 right-28 cursor-pointer"
      onClick={() => {
        dispatch(toggleTheme());
      }}
    >
      <img
        className="w-16 h-16"
        src={is_light ? LightIcon : DarkIcon}
        title={`Switch to ${is_light ? "dark" : "light"} theme`}
      />
    </section>
  );
};

export default Theme;
