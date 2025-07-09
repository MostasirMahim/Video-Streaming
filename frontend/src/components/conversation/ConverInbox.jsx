import { useQuery } from "@tanstack/react-query";
import ConverPeople from "./ConverPeople";

function ConverInbox() {
  const { data: filteredUsers, isLoading } = useQuery({
    queryKey: ["filteredUsers"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "res not ok");
      return data;
    },
  });
  if (isLoading)
    <div>
      <p>Loading</p>
    </div>;
  if (!filteredUsers) return null;
  return (
    <div className="overflow-y-auto h-[75%] w-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#374045]">
      {filteredUsers.map((user) => {
        return <ConverPeople key={user._id} user={user} />;
      })}
    </div>
  );
}

export default ConverInbox;
