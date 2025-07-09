/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import usersStore from "../zustand/store";
import { extractYear } from "../utils/dateModify";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from './../socket/Socket';

function ConverPeople({ user }) {
  const { setUser } = usersStore();
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();
  const { id } = useParams();
  const setZustandState = () => {
    const userData = {
      _id: user._id,
      profileImg: user.profileImg,
      fullname: user.fullname,
      username: user.username,
      gender: user.gender,
    };
    setUser(userData);
  };

  const isOnline = onlineUsers.includes(user._id);

  const { data: conversation } = useQuery({
    queryKey: ["conversation", user._id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/messages/conversation/${user._id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("not getting messages");
        return data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  let lastText = null;
  let lastUpdate = null;

  if (conversation && conversation.length !== 0) {
    const lastMessage = conversation.messages.at(-1);
    lastText = lastMessage.text;
    lastUpdate = extractYear(lastMessage.updatedAt);
  }
  let isMyProfile = user._id === id;

  return (
    <div
      className={` pl-4 flex justify-start items-center  space-x-3 py-1 hover:bg-[#2A3942] ${
        isMyProfile ? "bg-[#2A3942]" : ""
      } border-b-[1px] cursor-pointer border-[#556269] `}
      onClick={() => {
        setZustandState();
        navigate(`/chats/${user._id}`);
      }}
    >
      <div className={`h-14 w-16 avatar ${isOnline ? "online" : ""}`}>
        <img src={user.profileImg} alt="" className=" rounded-full" />
      </div>
      <div className=" flex justify-between items-center pb-2 w-full ">
        <div>
          <p>{user.fullname}</p>
          <p className="text-[#8696A0] text-sm">
            {lastText || "Send messages"}
          </p>
        </div>
        <div>
          <p className="text-[#8696A0] text-sm pr-4">{lastUpdate}</p>
        </div>
      </div>
    </div>
  );
}

export default ConverPeople;
