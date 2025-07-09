/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import usersStore from "../zustand/store";
import { extractTime } from "../utils/dateModify";

function Message({ message }) {
  const { user } = usersStore();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const fromMe = message.receiverId === user._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? authUser.profileImg : user?.profileImg;
  const messageTime = extractTime(message.createdAt);

  function getDownloadLink(cloudinaryUrl) {
    const urlParts = cloudinaryUrl.split("/");

    if (urlParts.length >= 8) {
      urlParts.splice(-2, 0, "fl_attachment");
      return urlParts.join("/");
    }
    return cloudinaryUrl;
  }
  const downloadImage = (imageUrl) => {
    const downloadLink = getDownloadLink(imageUrl);
    const a = document.createElement("a");
    a.href = downloadLink;
    a.download = ""; // You can specify a filename here if desired
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`chat ${chatClassName}  w-full h-full`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={profilePic} alt="" />
        </div>
      </div>
      {message.text && message.img ? (
        <div className={`flex flex-col ${
          fromMe ? "items-end" : "items-start"
        }`}>
          <img
            onDoubleClick={() => downloadImage(message.img)}
            src={message.img}
            alt=""
            className="w-[220px] h-[250px] object-contain border-[1px] my-1 rounded-lg border-gray-700 "
          />
          <div className={`chat-bubble text-white text-lg bg-[#005C4B] `}>
            {message.text}
          </div>
          <div
            className={`chat-footer opacity-50 text-xs flex gap-1 ${
              fromMe ? "justify-end" : "justify-start"
            } items-center`}
          >
            {messageTime}
          </div>{" "}
        </div>
      ) : (
        <div>
          <div className="chat-bubble text-white text-lg bg-[#005C4B] ">
            {message.text}
          </div>
          <div
            className={`chat-footer opacity-50 text-xs flex gap-1 ${
              fromMe ? "justify-end" : "justify-start"
            } items-center`}
          >
            {messageTime}
          </div>{" "}
        </div>
      )}
    </div>
  );
}

export default Message;
