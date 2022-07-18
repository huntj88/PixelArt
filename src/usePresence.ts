import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  MutableRefObject,
} from "react";
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

export const usePresence = (presence?: EphemeralPresence) => {
  const [allUsers, setOtherUsers] = useState<EphemeralPresenceUser[]>([]);
  const [localUser, setLocalUser] = useState<EphemeralPresenceUser | undefined>(
    undefined
  );
  const [presenceStarted, setPresenceStarted] = useState(false);

  // Post initial user presence with name as additional data
  const updatePresence = useCallback(
    (data: PresenceData) => {
      console.log("changing presence: " + data);

      const localUserData = localUser?.data as PresenceData | undefined;

      presence?.updatePresence(PresenceState.online, {
        name: data.name !== undefined ? data.name : localUserData?.name,
        xIndex: data.xIndex !== undefined ? data.xIndex : localUserData?.xIndex,
        yIndex: data.yIndex !== undefined ? data.yIndex : localUserData?.yIndex,
        selectedColor:
          data.selectedColor !== undefined
            ? data.selectedColor
            : localUserData?.selectedColor,
      });
    },
    [presence, localUser]
  );

  const changePosition = useCallback(
    (x: number, y: number) => {
      updatePresence({ xIndex: x, yIndex: y });
    },
    [updatePresence]
  );

  const changeColor = useCallback(
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
            // Get the roles of the local user
            userPresence
              .getRoles()
              .then((roles) => {
                // Set local user state
                setLocalUser(userPresence);
              })
              .catch((err) => {
                console.error(err);
                if (localUser) {
                  setLocalUser(localUser);
                }
              });
          }
          // Update our local state
          const updatedUsers = presence
            .toArray()
            .filter((user) => user.state === PresenceState.online);

          console.log(updatedUsers);
          if (updatedUsers) {
            setOtherUsers(updatedUsers);
          }
        }
      );
      presence
        .start(
          undefined,
          <PresenceData>{
            xIndex: 0,
            yIndex: 0,
            selectedColor: "red",
          },
          PresenceState.online
        )
        .then(() => {
          setPresenceStarted(true);
        })
        .catch((error) => console.error(error));
    }
  }, [presence, setPresenceStarted, setLocalUser]);

  return {
    presenceStarted,
    localUser,
    allUsers,
    changePosition,
    changeColor,
  };
};
