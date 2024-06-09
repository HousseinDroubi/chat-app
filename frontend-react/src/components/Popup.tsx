import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
interface popup {
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
}

const Popup = (props: popup) => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);

  return (
    <article
      className={`w-screen h-screen inset-0 fixed flex justify-center items-center z-10 pointer-events-auto bg-semi_transparent
      ${!props.isVisible ? "hidden" : ""}
      `}
    >
      <section
        className={`w-500 flex flex-col 
      ${is_light ? " bg-light_gray-100" : "bg-purple_gray-300"}
      rounded-lg h-400`}
      >
        <header
          className="h-12 relative flex flex-row items-center border-solid mt-6"
          onClick={() => props.setIsVisible(false)}
        >
          <div className="w-full">
            <p
              className={`${
                is_light ? "text-black" : "text-white"
              } text-2xl text-center`}
            >
              Alert !
            </p>
          </div>
          <div className="absolute right-6 flex-1 flex items-center justify-center cursor-pointer">
            <div
              className={` ${
                is_light ? "border-black" : "border-white"
              } rounded-full border-2 border-solid w-10 h-10 flex items-center justify-center`}
            >
              <p className={`${is_light ? "text-black" : "text-white"}`}>X</p>
            </div>
          </div>
        </header>
        <section className="p-10">
          <p
            className={`${
              is_light ? "text-black" : "text-white"
            } text-xl text-justify`}
          >
            {props.text}
          </p>
        </section>
      </section>
    </article>
  );
};
export default Popup;
