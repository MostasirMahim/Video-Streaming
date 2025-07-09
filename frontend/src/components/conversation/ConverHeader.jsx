import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineAddComment } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { VscThreeBars } from "react-icons/vsc";
import leftbarVisibility from "../zustand/leftbarVisibility";

function ConverHeader() {
  const { leftbarVisible, setLeftbarVisible } = leftbarVisibility();
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
            <div>
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
    </div>
  );
}

export default ConverHeader;
