import { useState, useEffect, useCallback } from "react";
import {
  EphemeralPresence,
  PresenceState,
  EphemeralPresenceUser,
} from "@microsoft/live-share";

export interface PresenceData {
  name?: string;
  xIndex?: number;
  yIndex?: number;
  selectedColor?: string;
}

type Presence = EphemeralPresence<PresenceData>;
type PresenceUser = EphemeralPresenceUser<PresenceData>;

export const usePresence = (presence?: Presence) => {
  const [allUsers, setOtherUsers] = useState<PresenceUser[]>([]);
  const [localUser, setLocalUser] = useState<PresenceUser | undefined>(
    undefined
  );
  const [presenceStarted, setPresenceStarted] = useState(false);

  // Post initial user presence with name as additional data
  const updatePresence = useCallback(
    (data: PresenceData) => {
      // console.log("changing presence: " + data);

      if (!presence?.isStarted) {
        return;
      }

      if (localUser?.data) {
        const localUserData = localUser.data as PresenceData;

        presence?.updatePresence(PresenceState.online, {
          name: data.name !== undefined ? data.name : localUserData?.name,
          xIndex:
            data.xIndex !== undefined ? data.xIndex : localUserData?.xIndex,
          yIndex:
            data.yIndex !== undefined ? data.yIndex : localUserData?.yIndex,
          selectedColor:
            data.selectedColor !== undefined
              ? data.selectedColor
              : localUserData?.selectedColor,
        });
      }
    },
    [presence, localUser]
  );

  const changePresencePosition = useCallback(
    (x: number, y: number) => {
      updatePresence({ xIndex: x, yIndex: y });
    },
    [updatePresence]
  );

  const changePresenceColor = useCallback(
    (color: string) => {
      console.log("changing color: " + color);
      updatePresence({ selectedColor: color });
    },
    [updatePresence]
  );

  // Effect which registers SharedPresence event listeners before joining space
  useEffect(() => {
    if (presence && !presence.isStarted) {
      console.info("usePresence: starting presence");
      presence.on(
        "presenceChanged",
        (userPresence: EphemeralPresenceUser, local: boolean) => {
          if (local) {
            setLocalUser(userPresence);
          }

          // Update our local state
          const updatedUsers = presence
            .toArray()
            .filter((user) => user.state === PresenceState.online);

          if (updatedUsers) {
            setOtherUsers(updatedUsers);
          }
        }
      );
      presence
        .start(
          undefined,
          {
            xIndex: 0,
            yIndex: 0,
            selectedColor: "red",
          },
          PresenceState.online
        )
        .then(() => {
          setPresenceStarted(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [presence, setPresenceStarted, localUser, setLocalUser]);

  return {
    presenceStarted,
    localUser,
    allUsers,
    changePresencePosition,
    changePresenceColor,
  };
};
