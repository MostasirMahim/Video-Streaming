import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineAddComment } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { BsChatSquareText } from "react-icons/bs";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoHelpCircleOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { MdKeyboardAlt } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

function SettingBox() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  const {
    mutate: updateProfile,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      setFormData({
        username: "",
        oldPassword: "",
        newPassword: "",
      });
      toast.success("Account Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const { mutate: logOut } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("Log Out Successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !(
        (formData.username ||
          (formData.oldPassword && formData.newPassword)) === ""
      )
    ) {
      updateProfile();
    }
  };
  if (!authuser) return null;
  return (
    <div className="max-h-screen">
      <div className="mb-7">
        <div className="flex justify-between items-center px-8 py-2">
          <p className="font-bold text-xl">Chats</p>
          <div className=" flex justify-center space-x-5 items-center h-full">
            <div>
              <MdOutlineAddComment className="rotate-180 w-6 h-6" />
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
      </div>

      <div
        onClick={() => navigate("/profile")}
        className="flex justify-start items-center space-x-4 h-24 w-full hover:cursor-pointer hover:bg-[#202C33] px-8"
      >
        <div>
          <img
            src={authuser.profileImg}
            className="h-20 w-20 object-cover rounded-full"
            alt=""
          />
        </div>
        <div>
          <p className="text-lg ">{authuser.fullname}</p>
          <p className="text-gray-500 text-sm">
            {authuser.bio || "Hey there! I am using WhatsApp."}
          </p>
        </div>
      </div>

      <div>
        <div
          onClick={() => document.getElementById("my_modal_1").showModal()}
          className="flex justify-start items-center cursor-pointer space-x-3 w-full h-14 pl-4  hover:bg-[#202C33]"
        >
          <MdAccountCircle className="h-8 w-8" />
          <div className="w-full h-full flex flex-col justify-end space-y-4">
            <p className="text-lg font-sans">Account</p>
            <hr className="border-gray-600" />
          </div>
        </div>

        <div>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                  onClick={() => {
                    setFormData({
                      username: "",
                      oldPassword: "",
                      newPassword: "",
                    });
                  }}
                >
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Update Profile Avatar</h3>
              <div className="space-y-2 my-2 p-2">
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                  </svg>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    className="grow"
                    placeholder={authuser.username}
                    onChange={handleInputChange}
                  />
                </label>
                <div className="flex justify-center space-x-[4%]">
                  <label className="input input-bordered flex items-center gap-2 w-[48%]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="password"
                      className="grow"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      placeholder="Current Password"
                    />
                  </label>
                  <label className="input input-bordered flex items-center gap-2 w-[48%]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="password"
                      className="grow"
                      name="newPassword"
                      value={formData.newPassword}
                      placeholder="New Password"
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                {isError && (
                  <p className="w-full text-center text-red-600 font-semibold">
                    {" "}
                    {"! " + error.message}
                  </p>
                )}
              </div>
              <div className="modal-action">
                <button onClick={handleSubmit} className="btn">
                  Done
                </button>
              </div>
            </div>
          </dialog>
        </div>

        <div className="flex justify-start items-center cursor-pointer space-x-3 w-full h-14 pl-4  hover:bg-[#202C33]">
          <MdOutlinePrivacyTip className="h-8 w-8" />
          <div className="w-full h-full flex flex-col justify-end space-y-4">
            <p className="text-lg font-sans">Privacy</p>
            <hr className="border-gray-600" />
          </div>
        </div>
        <div className="flex justify-start items-center cursor-pointer space-x-3 w-full h-14 pl-4  hover:bg-[#202C33]">
          <BsChatSquareText className="h-7 w-7" />
          <div className="w-full h-full flex flex-col justify-end space-y-4">
            <p className="text-lg font-sans">Chats</p>
            <hr className="border-gray-600" />
          </div>
        </div>
        <div className="flex justify-start items-center space-x-3 w-full h-14 pl-4 cursor-pointer hover:bg-[#202C33]">
          <IoNotificationsOutline className="h-8 w-8" />
          <div className="w-full h-full flex flex-col justify-end space-y-4">
            <p className="text-lg font-sans">Notifications</p>
            <hr className="border-gray-600" />
          </div>
        </div>
        <div className="flex cursor-pointer justify-start items-center space-x-3 w-full h-14 pl-4  hover:bg-[#202C33]">
          <IoHelpCircleOutline className="h-8 w-8" />
          <div className="w-full h-full flex flex-col justify-end space-y-4">
            <p className="text-lg font-sans">Help</p>
            <hr className="border-gray-600" />
          </div>
        </div>
        <div className="flex cursor-pointer justify-start items-center space-x-3 w-full h-14 pl-4  hover:bg-[#202C33]">
          <MdKeyboardAlt className="h-7 w-7" />
          <div className="w-full h-full flex flex-col justify-end space-y-4">
            <p className="text-lg font-sans">Keyboard Shourcut</p>
            <hr className="border-gray-600" />
          </div>
        </div>
        <div
          onClick={() => document.getElementById("my_modal_2").showModal()}
          className="flex justify-start items-center space-x-3 w-full h-14 pl-4  cursor-pointer hover:bg-[#202C33]"
        >
          <MdLogout className="h-8 w-8 text-[#F15C6D]" />
          <div className="w-full h-full flex flex-col justify-end space-y-4">
            <p className="text-lg font-sans text-[#F15C6D]">Log Out</p>
            <hr className="border-gray-600" />
          </div>
        </div>
        <div>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg text-red-600">Log Out</h3>
              <p className="text-lg m-2 text-center">
                Are you sure want to Log Out?
              </p>
              <div className="modal-action">
                <form method="dialog" className="flex justify-evenly w-full">
                  <button className="btn">Cancel</button>
                  <button onClick={() => logOut()} className="btn">
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}

export default SettingBox;
