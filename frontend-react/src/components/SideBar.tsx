import HomeFilledIcon from "../assets/icons/side-bar/home-filled.svg";
import HomeIcon from "../assets/icons/side-bar/home.svg";
import ProfileFilledIcon from "../assets/icons/side-bar/profile-filed.svg";
import ProfileIcon from "../assets/icons/side-bar/profile.svg";
import LogoutIcon from "../assets/icons/side-bar/logout.svg";
import { useNavigate } from "react-router-dom";
interface props {
  page_name: "home" | "profile";
}

interface element {
  filled_icon: string;
  not_filled_icon?: string;
  is_selected?: boolean;
}

const SideBar = (props: props) => {
  const navigate = useNavigate();
  const elements: Array<element> = [
    {
      filled_icon: HomeFilledIcon,
      not_filled_icon: HomeIcon,
      is_selected: props.page_name === "home",
    },
    {
      filled_icon: ProfileFilledIcon,
      not_filled_icon: ProfileIcon,
      is_selected: props.page_name === "profile",
    },
    { filled_icon: LogoutIcon, is_selected: true },
  ];

  const navigateTo = (index: number): void => {
    if (index === 0) navigate("/home");
    else if (index === 1) navigate("/profile-info");
    else navigate("/");
  };

  return (
    <section
      className={`h-screen w-20 fixed left-0 top-0 flex flex-col justify-start items-center pt-10 bg-green_shade`}
    >
      {elements.map((element, index) => (
        <img
          onClick={() => {
            navigateTo(index);
          }}
          className={`${index !== 0 ? "mt-8" : ""} cursor-pointer`}
          key={index}
          src={
            element.is_selected ? element.filled_icon : element.not_filled_icon
          }
        />
      ))}
    </section>
  );
};
export default SideBar;
