import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineAddComment } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { VscThreeBars } from "react-icons/vsc";
import leftbarVisibility from "../zustand/leftbarVisibility";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from 'react-hot-toast';

function ConverHeader() {
  const { leftbarVisible, setLeftbarVisible } = leftbarVisibility();
  const queryClient = useQueryClient();
  const { data: filteredUsers, isLoading } = useQuery({
    queryKey: ["filteredUsers"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "res not ok");
      return data;
    },
  });

  const [createGroup, setCreateGroup] = useState({
    name: "",
    members: [],
  });

  const { mutate: createGroupFn, isPending } = useMutation({
    mutationFn: async (Data) => {
      try {
        const res = await fetch(`/api/groups/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Data),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setCreateGroup({
        name: "",
        members: [],
      });
      queryClient.invalidateQueries(["groups"])
    },
  });

  const handleCreateGroup = (data)=> {
    if(data.members.length == 0 || data.name == "") {
      toast.error("Please Give Name And Add Min 1 Member")
      return;
    }
    createGroupFn(data)
  }

  if (isLoading || isPending) return <div>Loading</div>;
  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center px-8 py-2">
          <VscThreeBars
            onClick={() => setLeftbarVisible(!leftbarVisible)}
            className="sm:hidden w-7 h-7 cursor-pointer hover:text-green-500 hover:scale-110"
          />
          <p className="font-bold text-xl">Chats</p>
          <div className="flex justify-center space-x-5 items-center h-full">
            <div
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              <MdOutlineAddComment className=" w-6 h-6" />
            </div>
            <div>
              <BsThreeDotsVertical className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center  mx-4  h-8 my-2 bg-[#202C33] rounded-lg p-4 cursor-default outline-none">
          <IoMdSearch className="text-[#8696A0] w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full  h-8 my-2 bg-[#202C33] rounded-lg p-4 cursor-default outline-none"
          />
        </div>

        <div>
          <ul className="  flex justify-start items-center space-x-4 text-[#8696A0] my-2 w-auto ml-4 h-10">
            <li className=" rounded-2xl text-center p-1 w-10 h-8 cursor-pointer bg-[#202C33] hover:bg-[#404d55] ">
              All
            </li>
            <li className=" rounded-2xl text-center p-1 w-20 h-8 cursor-pointer bg-[#202C33] hover:bg-[#404d55] ">
              Unread
            </li>
            <li className=" rounded-2xl text-center p-1 w-20 h-8 cursor-pointer bg-[#202C33] hover:bg-[#404d55] ">
              Groups
            </li>
          </ul>
        </div>
      </div>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box border-none">
          <div>
            <p>Group Name</p>
            <input
              type="text"
              className="input border-white"
              onChange={(e) => {
                setCreateGroup({
                  ...createGroup,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <p>Add Members</p>
            {filteredUsers.map((user) => {
              return (
                <div
                  key={user._id}
                  className={` flex justify-start items-center  space-x-3 px-10 py-1 hover:bg-[#2A3942]  border-b-[1px] cursor-pointer border-[#556269] `}
                >
                  <div className={`h-14 w-16 avatar`}>
                    <img
                      src={user.profileImg}
                      alt=""
                      className=" rounded-full"
                    />
                  </div>
                  <div className=" flex justify-between items-center pb-2 w-full ">
                    <div>
                      <p>{user.fullname}</p>
                    </div>
                    <div className="btn">
                      {createGroup?.members.includes(user._id) ? (
                        <span
                          onClick={() => {
                            setCreateGroup((prev) => {
                              return {
                                ...prev,
                                members: prev.members.filter(
                                  (id) => id !== user._id
                                ),
                              };
                            });
                          }}
                        >
                          Added
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            setCreateGroup((prev) => {
                              return {
                                ...prev,
                                members: [...prev.members, user._id],
                              };
                            });
                          }}
                        >
                          Add
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn" onClick={() => handleCreateGroup(createGroup)}>
            {" "}
            Create
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default ConverHeader;
