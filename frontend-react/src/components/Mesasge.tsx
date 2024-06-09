import { useEffect, useState } from "react";
import { messageInterface } from "../interfaces/general.interface";
import axios from "axios";

interface props extends messageInterface {
  className: string;
  token: string;
}

const Message = (props: props) => {
  const [fileSrc, setFileSrc] = useState<string>();
  const [is_image, setIsImage] = useState<boolean>(true);

  useEffect(() => {
    if (!props.is_text && fileSrc) {
      setIsImage(fileSrc.startsWith("data:image/"));
    }
  }, [fileSrc]);

  useEffect(() => {
    if (!fileSrc && !props.is_text) {
      const url = `${process.env.REACT_APP_BASE_URL}/data/get_file/${props._id}`;
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${props.token}` },
          responseType: "blob",
        })
        .then((response) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === "string") {
              const dataUrl = e.target.result;
              setFileSrc(dataUrl);
            }
          };
          reader.readAsDataURL(response.data);
        });
    }
  }, []);

  return (
    <section
      className={`mt-2 ${
        props.is_text ? "w-80" : "max-w-96"
      } flex flex-col p-4 rounded-lg ${props.className}`}
    >
      {props.is_text ? (
        <p className={`text-base text-white break-words`}>{props.content}</p>
      ) : is_image ? (
        <img src={fileSrc} />
      ) : (
        <video controls width={300}>
          <source src={fileSrc} type="video/mp4" />
        </video>
      )}
      <p className="text-xs mt-1 text-white self-end">
        {new Date(props.date).toLocaleString()}
      </p>
    </section>
  );
};

export default Message;
