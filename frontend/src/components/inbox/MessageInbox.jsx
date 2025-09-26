import { SlOptionsVertical } from "react-icons/sl";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { IoCall, IoCallSharp, IoSendSharp } from "react-icons/io5";
import Message from "./Message";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import usersStore from "../zustand/store";
import { extractDate } from "../utils/dateModify";
import addImages from "../../assets/addImage.png";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner";
import toast from "react-hot-toast";
import { useSocket } from "./../socket/Socket";

function MessageInbox() {
  const { onlineUsers } = useSocket();
  const [formData, setFormData] = useState({ text: "", img: "" });
  const { socket } = useSocket();
  const imgRef = useRef(null);
  const { user, conversations, setUser } = usersStore();
  const addConversation = usersStore((state) => state.addConversation);
  const isOnline = onlineUsers.includes(user._id);
  const navigate = useNavigate();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  useEffect(() => {
    if (user._id === null) {
      navigate("/chats");
      return;
    }
  }, [user, navigate]);
  console.log(user);
  const { data: buble, isLoading } = useQuery({
    queryKey: ["buble", user._id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/messages/${user._id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("not getting messages");
        return data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    enabled: !!user._id,
  });
  useEffect(() => {
    if (buble && buble.length > 0) {
      const newMessages = buble.filter(
        (message) => !conversations.some((conv) => conv._id === message._id)
      );
      newMessages.forEach((message) => {
        addConversation(message);
      });
    }
  }, [buble, addConversation, conversations]);

  const { mutate: sendMessage } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/messages/send/${user._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        if (res.ok) {
          socket.emit("sendMessage", data);
        }
        if (data.error) throw new Error(data.error);

        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      setFormData({ text: "", img: "" });
      addConversation(data);
    },
  });
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const sendMessages = () => {
    if (formData.img && formData.text.trim() === "") {
      toast.error("Please Add Attachment text");
    }
    if (formData.text.trim() === "") return;
    sendMessage();
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      addConversation(newMessage);
    });
    console.log("Socket connected:", socket?.connected);
    return () => socket?.off("newMessage");
  }, [socket, addConversation]);

  const filteredMessages = conversations.filter(
    (message) =>
      message.receiverId === user._id || message.senderId === user._id
  );

  let lastSeen = null;

  if (filteredMessages.length !== 0) {
    const lastElement = filteredMessages.at(-1);
    lastSeen = extractDate(lastElement.createdAt);
  }
  const imgUploader = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, img: reader.result }));

        if (imgRef.current) {
          imgRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const bottomRef = useRef();
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [conversations]);

  if (!conversations || isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="w-full max-h-screen min-h-screen flex flex-col ">
      {/* //Heder */}
      <div className="w-full h-16 bg-[#202C33] flex xs:justify-start sm:justify-between items-center gap-3 p-2">
        <div className="xs:block sm:hidden">
          <MdOutlineKeyboardBackspace
            onClick={() => {
              navigate("/chats");
              setUser(null);
            }}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
        <div
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className="flex w-full gap-3 px-2 cursor-pointer"
        >
          <div className={`h-12 w-12 avatar ${isOnline ? "online" : ""}`}>
            <img
              src={user.profileImg}
              alt=""
              className="rounded-full h-12 w-12 "
            />
          </div>
          <div>
            <p className="hover:text-blue-500">{user.fullname}</p>
            <div className="text-sm text-gray-300 hover:text-blue-500">
              {isOnline ? (
                "Online"
              ) : (
                <p>{lastSeen ? `last seen ${lastSeen}` : "Offline"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="pr-4 flex gap-2 items-center">
          <IoCallSharp
            onClick={() =>
              navigate(`/rooms?room=${user?._id}+${authUser?._id}`)
            }
            className=" cursor-pointer hover:scale-110 hover:text-sky-400"
          />
          <IoCall
            onClick={() =>
              navigate(`/rooms?room=${authUser?._id}+${user?._id}`)
            }
            className=" cursor-pointer hover:scale-110 hover:text-sky-400"
          />
          <SlOptionsVertical className=" cursor-pointer hover:scale-110 hover:text-sky-400" />
        </div>
      </div>
      <dialog id="my_modal_5" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={() => setFormData({ profileImg: "" })}
              className="btn btn-sm btn-circle  btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>

          <div className="flex justify-start items-center w-full relative space-x-5">
            <img
              src={user.profileImg}
              alt=""
              className=" h-40 w-40 rounded-full object-cover"
            />
            <div className="text-blue-400 shadow-2xl p-4 rounded-lg bg-slate-900">
              <p className="font-semibold italic font-sans">
                Name : {user.fullname}
              </p>
              <p className=" italic font-sans"> Username : @{user.username}</p>
              <p className="text-sm italic font-sans">
                {" "}
                Bio : {user.bio || "Hey there! I am using WhatsApp."}
              </p>
              <p className="font-mono text-lg">{user.gender}</p>
            </div>
          </div>
        </div>
      </dialog>
      {/* Main */}
      <div
        className="bg-[url('https://i.pinimg.com/originals/e6/29/25/e62925d2af795db245dffbc42e05296b.png')] 
      bg-contain  flex-grow min-h-[483px] overflow-y-scroll scrollbar-thin p-2 "
      >
        {filteredMessages.length == 0 && (
          <div className="flex justify-center items-end pt-56 h-full w-full">
            {" "}
            Say Hi... & Start Conversation.{" "}
          </div>
        )}
        {filteredMessages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Footer */}
      <div className="w-full h-14 relative bg-[#202C33] flex justify-between items-center text-center gap-3 p-2 pr-3 ">
        <MdOutlineEmojiEmotions className="h-7 w-7 hover:scale-105 hover:text-green-500 cursor-pointer" />
        <IoMdAdd
          onClick={() => document.getElementById("my_modal_3").showModal()}
          className="h-7 w-7 hover:scale-110 hover:text-green-500 cursor-pointer"
        />

        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button
                onClick={() => setFormData((prev) => ({ ...prev, img: "" }))}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-left text-lg">Add Image</h3>
            <div className="w-full flex justify-center">
              <img
                onClick={() => imgRef.current.click()}
                src={formData.img || addImages}
                alt=""
                className="w-[200px] h-[200px] border-2 border-gray-700 rounded-xl object-contain cursor-pointer"
              />
            </div>

            <div className="flex w-full items-center justify-end space-x-2 mt-4 ">
              <div className="w-full  h-auto flex items-center bg-[#202C33] rounded-lg  outline-none">
                <textarea
                  type="text"
                  placeholder="Type a message"
                  rows="1"
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                    if (e.target.scrollHeight > 60) {
                      e.target.style.height = "50px";
                      e.target.style.overflowY = "auto";
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        sendMessages();
                      }
                    }
                  }}
                  name="text"
                  onChange={handleInputChange}
                  value={formData.text}
                  className="w-full bg-[#2A3942] rounded-lg p-2  outline-none resize-none scrollbar-none"
                />
              </div>
              <form method="dialog">
                <IoSendSharp
                  onClick={() => sendMessages()}
                  className="h-8 w-8  cursor-pointer hover:text-green-500 hover:scale-110"
                />
              </form>
            </div>
          </div>
        </dialog>
        <input
          type="file"
          hidden
          ref={imgRef}
          onChange={(e) => imgUploader(e)}
        />
        <div className="w-full  h-auto flex items-center bg-[#202C33] rounded-lg px-1 cursor-default outline-none">
          <textarea
            type="text"
            placeholder="Type a message"
            rows="1"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
              if (e.target.scrollHeight > 60) {
                e.target.style.height = "50px";
                e.target.style.overflowY = "auto";
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!e.shiftKey) {
                  e.preventDefault();
                  sendMessages();
                }
              }
            }}
            name="text"
            onChange={handleInputChange}
            value={formData.text}
            className="w-full bg-[#2A3942] rounded-lg p-2 cursor-default outline-none resize-none scrollbar-none"
          />
        </div>
        <IoSendSharp
          onClick={() => sendMessages()}
          className="h-8 w-8  cursor-pointer hover:text-green-400 hover:scale-110"
        />
      </div>
    </div>
  );
}

export default MessageInbox;
