import { MdEmojiEmotions } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
import { MdAddPhotoAlternate } from "react-icons/md";

import { IoPencil } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

function ProfileBox() {
  const queryClient = useQueryClient();
  const [editmodeName, setEditmodeName] = useState(true);
  const [editmodeBio, setEditmodeBio] = useState(true);
  const profileImgRef = useRef(null);
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });
  const [formData, setFormData] = useState({
    fullname: "",
    bio: "",
    profileImg: "",
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/users/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) return data.error || "update problem";
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      setFormData({
        fullname: "",
        bio: "",
        profileImg: "",
      });
      toast.success("Profile Updated Successfully");
      queryClient.invalidateQueries(["authUser"]);
    },
  });
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const imgUploader = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ profileImg: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = () => {
    if (!((formData.fullname || formData.bio || formData.profileImg) === "")) {
      updateProfile();
    }
  };

  if (!authuser) return null;
  return (
    <div>
      <div className="w-full px-4 mt-4">
        <p className="text-2xl font-semibold">Profile</p>

        <div className="flex justify-center items-center w-full relative">
          <img
            src={authuser.profileImg}
            alt=""
            className=" h-52 w-52 rounded-full object-cover"
          />
          <MdAddPhotoAlternate
            onClick={() => document.getElementById("my_modal_1").showModal()}
            className="absolute top-2/5 left-2/5   bg-transparent opacity-0 hover:opacity-100 hover:bg-opacity-30  hover:block hover:bg-slate-600 w-52 h-52 p-20  border rounded-full cursor-pointer"
          />
        </div>
      </div>

      <div>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button
                onClick={() => setFormData({ profileImg: "" })}
                className="btn btn-sm btn-circle  btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Update Profile Avatar</h3>
            <div className="flex justify-center items-center w-full relative">
              <img
                src={formData.profileImg || authuser.profileImg}
                alt=""
                className=" h-52 w-52 rounded-full object-cover"
              />
              <MdAddPhotoAlternate
                onClick={() => profileImgRef.current.click()}
                className="absolute top-2/5 left-2/5   bg-transparent opacity-0 hover:opacity-100 hover:bg-opacity-30  hover:block hover:bg-slate-600 w-52 h-52 p-20  border rounded-full cursor-pointer"
              />
              <input
                type="file"
                hidden
                ref={profileImgRef}
                onChange={(e) => imgUploader(e)}
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button onClick={() => handleSubmit()} className="btn">
                  Done
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>

      <div className="w-full px-4 mt-2">
        <p className="text-[#098069]">Your name</p>
        {editmodeName ? (
          <div className="flex justify-between items-center h-12">
            <p>{authuser.fullname}</p>
            <div onClick={() => setEditmodeName(false)}>
              <IoPencil className="w-6 h-6 cursor-pointer" />
            </div>
          </div>
        ) : (
          <div className="flex h-12 border-b-gray-500 border-b-[2px]">
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              maxLength={25}
              placeholder={authuser.fullname}
              onChange={handleInputChange}
              className="w-full h-full bg-transparent focus:outline-none "
            />
            <div className="flex items-center h-full space-x-1">
              <p className="text-gray-500">{25 - formData.fullname.length}</p>
              <MdEmojiEmotions className="w-6 h-6 text-[#8696A0] cursor-pointer hover:text-white" />
              <MdOutlineDone
                onClick={() => {
                  setEditmodeName(true);
                  handleSubmit();
                }}
                className="w-7 h-7 text-[#8696A0] cursor-pointer hover:text-white"
              />
            </div>
          </div>
        )}
        <p className="text-sm text-gray-400">
          This is not your username or PIN. This name will be visible to your
          WhatsApp contacts.
        </p>
      </div>
      <div className="w-full px-4 mt-6">
        <p className="text-[#098069]">Bio</p>
        {editmodeBio ? (
          <div className="flex justify-between items-center h-12">
            <p>{authuser.bio || "Hey there! I am using WhatsApp."}</p>
            <div
              onClick={() => {
                setEditmodeBio(false);
              }}
            >
              <IoPencil className="w-6 h-6 cursor-pointer" />
            </div>
          </div>
        ) : (
          <div className="flex h-12 border-b-gray-500 border-b-[2px]">
            <input
              type="text"
              name="bio"
              placeholder={authuser.bio || "Hey there! I am using WhatsApp."}
              maxLength={50}
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full h-full bg-transparent focus:outline-none "
            />
            <div className="flex items-center h-full space-x-1">
              <p className="text-gray-500">{50 - formData.bio.length}</p>
              <MdEmojiEmotions className="w-6 h-6 text-[#8696A0] cursor-pointer hover:text-white" />
              <MdOutlineDone
                onClick={() => {
                  setEditmodeBio(true);
                  handleSubmit();
                }}
                className="w-7 h-7 text-[#8696A0] cursor-pointer hover:text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileBox;
