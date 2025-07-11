import { SlOptionsVertical } from "react-icons/sl";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import addImages from "../../assets/addImage.png";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useSocket } from "../socket/Socket";
import LoadingSpinner from "../utils/LoadingSpinner";
import Message from "../inbox/Message";
import usersStore from "../zustand/store";

function GroupInbox() {
  const { id } = useParams();
  const { socket } = useSocket();
  const imgRef = useRef(null);
  const [formData, setFormData] = useState({ text: "", img: "" });
  const navigate = useNavigate();
  const { data: authUser, isLoading: authLoading } = useQuery({
    queryKey: ["authUser"],
  });
 
  const { data: groupData, isLoading } = useQuery({
    queryKey: ["getGroup", id],
    queryFn: async () => {
      const res = await fetch(`/api/groups/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "res not ok");
      return data;
    },
  });

  const { conversations } = usersStore();
  const addConversation = usersStore((state) => state.addConversation);
  const clearConversation = usersStore((state) => state.clearConversations);

  const { data: groupMessage, isLoading: groupMessagesLoading } = useQuery({
    queryKey: ["getGroupMessages", id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/groups/group/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
  });

  console.log(conversations);
  useEffect(() => {
    if (groupMessage?.length > 0) {

      groupMessage?.forEach((message) => {
        addConversation(message);
      });
    }
    return () =>  clearConversation()
  }, [groupMessage]);

  const { mutate: sendMessageToGroup } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/groups/send/${groupData._id}`, {
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
          socket.emit("newGroupMessage", data);
        }
        if (data.error) throw new Error(data.error);

        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setFormData({ text: "", img: "" });
    
    },
  });
  useEffect(() => {
    socket?.on("newGroupMessage", (newMessage) => {
      if (newMessage.senderId !== authUser?._id) {
        addConversation(newMessage);
      }
    });
    return () => socket?.off("newGroupMessage");
  }, [socket, authUser, addConversation]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const sendMessages = () => {
    if (formData.img && formData.text.trim() === "") {
      toast.error("Please Add Attachment text");
    }
    if (formData.text.trim() === "") return;
    sendMessageToGroup();
  };

  
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
  }, [groupMessage]);

  if (isLoading || groupMessagesLoading || authLoading)
    return <LoadingSpinner />;
  return (
    <div className="w-full max-h-screen min-h-screen flex flex-col ">
      {/* //Heder */}
      <div className="w-full h-16 bg-[#202C33] flex xs:justify-start sm:justify-between items-center gap-3 p-2">
        <div className="xs:block sm:hidden">
          <MdOutlineKeyboardBackspace
            onClick={() => {
              navigate("/chats");
            }}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
        <div className="flex w-full gap-3 px-2 cursor-pointer">
          <div>
            <p className="hover:text-blue-500">{groupData.name}</p>
          </div>
        </div>

        <div className="pr-4">
          <SlOptionsVertical className=" cursor-pointer hover:scale-110 hover:text-sky-400" />
        </div>
      </div>

      {/* Main */}
      <div
        className="bg-[url('https://i.pinimg.com/originals/e6/29/25/e62925d2af795db245dffbc42e05296b.png')] 
      bg-contain  flex-grow min-h-[483px] overflow-y-scroll scrollbar-thin p-2 "
      >
        {conversations?.length == 0 && (
          <div className="flex justify-center items-end pt-56 h-full w-full">
            {" "}
            Say Hi... & Start Conversation.{" "}
          </div>
        )}
        {conversations?.map((message) => (
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

export default GroupInbox;
