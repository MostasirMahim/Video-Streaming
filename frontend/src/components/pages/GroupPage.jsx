import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function GroupPage() {
  const navigate = useNavigate();
  const { data: group, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/groups/");
        const data = res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
  });
  console.log(group);
  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-start">
      {group && group.length > 0 ? (
        <div className="flex flex-col items-center justify-center w-full">
          {group.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/groups/${group._id}`)} 
              className="flex flex-col items-center justify-center w-full"
            >
              <div
                className={` w-full flex justify-start items-center  space-x-3 py-1 hover:bg-[#2A3942]  border-b-[1px] cursor-pointer border-[#556269] px-2`}
              >
                <div className={`h-12 w-14 flex items-center justify-center avatar`}>
                  <img
                    src={
                      "https://img.freepik.com/premium-photo/log-form-vector_1254992-110022.jpg"
                    }
                    alt=""
                    className=" rounded-full h-12 w-12 object-cover"
                  />
                </div>
                <div className=" flex justify-between items-center pb-2 w-full ">
                  <div>
                    <p>{group?.name}</p>
                    <p className="text-[#8696A0] text-sm">hi</p>
                  </div>
                  <div>
                    <p className="text-[#8696A0] text-sm pr-4">no</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white">No groups found</div>
      )}
    </div>
  );
}

export default GroupPage;
