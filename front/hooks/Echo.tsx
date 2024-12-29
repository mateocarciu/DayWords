import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

import { useEffect, useState } from "react";
import { useUser } from "./UserContext";

window.Pusher = Pusher;

const useEcho = () => {
  const [echoInstance, setEchoInstance] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user.token) return;
    const echo = new Echo({
      broadcaster: "reverb",
      key: process.env.REVERB_APP_KEY,
      wsHost: process.env.REVERB_HOST,
      wsPort: process.env.REVERB_PORT ?? 80,
      wssPort: process.env.REVERB_PORT ?? 443,
      forceTLS: (process.env.REVERB_SCHEME ?? "https") === "https",
      enabledTransports: ["ws", "wss"],
      authorizer: (channel) => {
        return {
          authorize: (socketId, callback) => {
            fetch(`${process.env.API_URL}/api/broadcasting/auth`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                callback(false, data);
              })
              .catch((error) => {
                callback(true, error);
              });
          },
        };
      },
    });
    setEchoInstance(echo);
    // Cleanup
    return () => {
      echo.disconnect();
    };
  }, [user]);

  return echoInstance;
};

export default useEcho;