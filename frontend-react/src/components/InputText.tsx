import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";

interface inputText {
  label: string;
  type: "text" | "password";
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  className?: string;
}

const InputText = (props: inputText) => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.setValue(event.target.value);
  };

  return (
    <div className={`w-300 ${props.className}`}>
      <p className={`${is_light ? "text-black" : "text-white"} text-1xl`}>
        {props.label}
      </p>
      <input
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
        onChange={handleChange}
        className={`h-12 w-full text-white rounded-md border-none outline-none p-4 text-1xl mt-2 ${
          is_light
            ? "bg-light_gray-500 placeholder:text-white placeholder:opacity-70"
            : "bg-purple_gray-100"
        }
        `}
      />
    </div>
  );
};

export default InputText;
