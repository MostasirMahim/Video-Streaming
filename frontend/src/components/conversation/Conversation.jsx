import { Outlet, useParams, useOutlet } from "react-router-dom";
import ChatBox from "../pages/ChatBox";
import SettingBox from "../pages/SettingBox";
import ProfileBox from "../pages/ProfileBox";
import LeftSidebar from "../pages/LeftSidebar";
import leftbarVisibility from "../zustand/leftbarVisibility";
import mIcon from "../../assets/buble.png";
import GroupPage from "../pages/GroupPage";
import Room from "../calls/Room";

function Conversation() {
  const { box } = useParams();
  const hasOutlet = useOutlet();
  const { leftbarVisible } = leftbarVisibility();

  return (
    <div className="flex justify-start w-full h-screen max-h-screen">
      <div
        className={`bg-[#202C33] sm:w-[5%] h-screen ${
          leftbarVisible ? "xs:w-[10%]" : "xs:hidden"
        } ${hasOutlet ? "xs:hidden" : "xs:block"}`}
      >
        <LeftSidebar />
      </div>
      <div
        className={`bg-[#111B21] h-screen text-white  ${
          hasOutlet ? "xs:w-0" : "xs:w-full"
        } sm:w-[40%]`}
      >
        {box == "profile" && <ProfileBox />}
        {box == "chats" && <ChatBox />}
        {box == "settings" && <SettingBox />}
        {box == "groups" && <GroupPage />}
        {box == "rooms" && <Room />}
      </div>
      <div
        className={`bg-[#222E35] ${
          hasOutlet ? "xs:w-[100%]" : "xs:w-0"
        }  sm:w-[60%] h-screen`}
      >
        {hasOutlet ? (
          <Outlet />
        ) : (
          <div className="w-full h-full flex justify-center items-center ">
            <img
              src={mIcon}
              alt=""
              className="w-2/3 h-2/3 object-contain animate-pulse "
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversation;
