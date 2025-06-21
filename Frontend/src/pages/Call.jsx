import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useQuery } from "@tanstack/react-query";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Call = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { userData, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!userData,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !userData || !callId) return;

      try {
        console.log("Initializing a call...");

        const user = {
          id: userData?._id,
          name: userData?.fullName,
          image: userData?.profilePic
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: user,
          token: tokenData?.token
        })

        const callInstance = videoClient.call("default", callId)
        await callInstance.join({ create: true })

        setClient(videoClient);
        setCall(callInstance)   
      } catch (error) {
        console.error("Error joining call: ", error);
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, userData, callId]);

  if (isLoading || isConnecting) {
    return (
      <div className="flex gap-2 items-center justify-center w-full h-full">
        <span className="text-xl">Connecting</span>
        <span className="loading loading-lg loading-dots" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="relative">
        {(client && call) ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div>
            <p>Couldn't initialize call, please refresh the page.</p>
          </div>
        )}
      </div>
    </div>
  )
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callState = useCallCallingState();

  if (callState === CallingState.LEFT) return window.close();

  return (
    <StreamTheme className="w-fit md:mx-10 mx-2">
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  )
}

export default Call;
