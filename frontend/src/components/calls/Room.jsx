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
  console.log("Room:", room);

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
console.log("Token:", token);
  return (
    <>
      {token ? (
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={URL}
          onDisconnected={() => navigate(-1)}
          // Use the default LiveKit theme for nice styles.
          data-lk-theme="default"
          style={{ height: "100dvh" }}
        >
          {/* Your custom component with basic video conferencing functionality. */}
          <MyVideoConference />
          {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
          <RoomAudioRenderer />
          {/* Controls for the user to start/stop audio, video, and screen 
      share tracks and to leave the room. */}
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
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
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
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
