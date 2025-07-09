import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Conversation from "./components/conversation/Conversation";
import { useQuery } from "@tanstack/react-query";
import MessageInbox from "./components/inbox/MessageInbox";
import Register from "./components/auth/Register";
import LoadingSpinner from "./components/utils/LoadingSpinner";
import GroupInbox from "./components/groups/GroupInbox";


function App() {
  const { data: authUser,isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  const {pathname} = useLocation();
  const box = pathname.split('/')[1];
  console.log("Box:", box);
  console.log("Current Path:", pathname);

  
  if(isLoading) {
    return <LoadingSpinner />
  }
  return (
    <div>
      <div className="bg-[#111B21] text-white">
        <Routes>
          <Route
            path="/:box"
            element={authUser ? <Conversation /> : <Navigate to="/login " />}
          >
            <Route path=":id" element={box === 'groups' ? <GroupInbox /> : <MessageInbox />}></Route>
          </Route>
          <Route
            path="/login"
            element={!authUser ? <Register /> : <Navigate to="/chats " />}
          />
          <Route path="*" element={<Navigate to="/chats" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
