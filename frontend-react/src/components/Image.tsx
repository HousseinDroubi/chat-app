import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import CameraIcon from "../assets/icons/image/camera.svg";
import { ChangeEvent } from "react";

interface image {
  src?: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Image = (props: image) => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);

  return (
    <>
      <label
        htmlFor="image"
        className={`
    ${
      is_light ? "bg-light_gray-500" : "bg-purple_gray-100"
    } w-28 h-28 rounded-full flex items-center justify-center cursor-pointer ${
          props.className
        }
    `}
      >
        <img
          src={props.src ? props.src : CameraIcon}
          alt="image"
          title="Your image"
          className={`${
            props.src ? "w-full h-full rounded-full" : "w-14 h-14"
          }`}
        />
      </label>
      <input
        onChange={(event) => props.onChange(event)}
        className="hidden"
        id="image"
        type="file"
        accept=".jpg, .png, .jpeg"
      />
    </>
  );
};
export default Image;
