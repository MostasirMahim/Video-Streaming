import "@livekit/components-styles";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const room = searchParams.get("room");
  const { data: token, isLoading } = useQuery({
    queryKey: ["callToken", room],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/call/getToken?room=${room}`);
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) throw new Error(data.error);
        return data.token;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
  });
  const URL = `wss://mahimvideostream-8q7jmrti.livekit.cloud`;
  return (
    <>
      {token ? (
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={URL}
          onDisconnected={() => navigate(-1)}
          data-lk-theme="default"
          style={{ height: "100dvh" }}
        >
          <MyVideoConference />
          <RoomAudioRenderer />
          <ControlBar />
        </LiveKitRoom>
      ) : (
        <div>
          {isLoading ? <div>Loading...</div> : <div>Error loading token</div>}
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      )}
    </>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
