import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import InputText from "./InputText";
import Button from "./Button";
interface props {
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  variable: string;
  setVariable: React.Dispatch<React.SetStateAction<string>>;
  checkUser: () => void;
}

const NewConversationPopup = (props: props) => {
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
      rounded-lg h-300`}
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
              Add new conversation
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
        <section className="flex items-center justify-evenly flex-col flex-1">
          <InputText
            value={props.variable}
            setValue={props.setVariable}
            type="text"
            label="Username"
            placeholder="Enter username"
          />
          <Button title="Add" fun={props.checkUser} />
        </section>
      </section>
    </article>
  );
};

export default NewConversationPopup;
