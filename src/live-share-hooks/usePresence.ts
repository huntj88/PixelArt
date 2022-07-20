import { useEffect, useRef } from "react";
import {
  EphemeralPresence,
  PresenceState,
  EphemeralPresenceUser,
} from "@microsoft/live-share";
import { IPixelColorState } from "../components/Pixel";

export interface PresenceData {
  name?: string;
  xIndex?: number;
  yIndex?: number;
  selectedColor?: string;
}

type Presence = EphemeralPresence<PresenceData>;
type PresenceUser = EphemeralPresenceUser<PresenceData>;

export const initialColor = "red";

export const usePresence = (
  pixelStateMap: Map<string, IPixelColorState>,
  presence?: Presence
) => {
  const localUserRef = useRef<PresenceUser | undefined>(undefined);

  // Post initial user presence with name as additional data
  const updatePresence = (data: PresenceData) => {
    if (!presence?.isStarted) {
      return;
    }

    presence?.updatePresence(PresenceState.online, {
      name: data.name ?? localUserRef.current?.data?.name,
      xIndex: data.xIndex ?? localUserRef.current?.data?.xIndex,
      yIndex: data.yIndex ?? localUserRef.current?.data?.yIndex,
      selectedColor:
        data.selectedColor ?? localUserRef.current?.data?.selectedColor,
    });
  };

  const changePresencePosition = (x: number, y: number) => {
    updatePresence({ xIndex: x, yIndex: y });
  };

  const changePresenceColor = (color: string) => {
    updatePresence({ selectedColor: color });
  };

  // Effect which registers SharedPresence event listeners before joining space
  useEffect(() => {
    if (presence && !presence.isStarted) {
      console.info("usePresence: starting presence");
      presence.on(
        "presenceChanged",
        (userPresence: EphemeralPresenceUser, local: boolean) => {
          if (local) {
            localUserRef.current = userPresence;
          }

          const allUsers = presence
            .toArray()
            .filter((user) => user.state === PresenceState.online);

          pixelStateMap.forEach((value, _) => {
            if (value.mouseOverColor) {
              value.setMouseOverColor(undefined);
            }
          });

          allUsers.forEach((user) => {
            if (user.data) {
              const pixelColorState = pixelStateMap.get(
                `${user.data.xIndex},${user.data.yIndex}`
              );

              pixelColorState?.setMouseOverColor(user.data.selectedColor);
            }
          });
        }
      );
      presence
        .start(
          undefined,
          {
            xIndex: 0,
            yIndex: 0,
            selectedColor: initialColor,
          },
          PresenceState.online
        )
        .catch((error) => {
          console.error(error);
        });
    }
  }, [presence]);

  return {
    localUserRef,
    changePresencePosition,
    changePresenceColor,
  };
};
