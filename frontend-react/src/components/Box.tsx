import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
interface box {
  children: ReactNode;
}

const Box = (box: box) => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);

  return (
    <section
      className={`${
        is_light ? " bg-light_gray-100" : "bg-purple_gray-300"
      } h-auto rounded-2xl flex flex-col items-center mt-5 w-600`}
    >
      {box.children}
    </section>
  );
};

export default Box;
