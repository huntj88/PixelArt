import { useState, useEffect, useCallback, useRef } from "react";
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

export const usePresence = (
  pixelStateMap: Map<string, IPixelColorState>,
  presence?: Presence
) => {
  const localUser = useRef<PresenceUser | undefined>(undefined);

  // Post initial user presence with name as additional data
  const updatePresence = (data: PresenceData) => {
    if (!presence?.isStarted) {
      return;
    }

    const blah = {
      name: data.name ?? localUser.current?.data?.name,
      xIndex: data.xIndex ?? localUser.current?.data?.xIndex,
      yIndex: data.yIndex ?? localUser.current?.data?.yIndex,
      selectedColor:
        data.selectedColor ?? localUser.current?.data?.selectedColor,
    };

    presence?.updatePresence(PresenceState.online, blah);
  };

  const changePresencePosition = (x: number, y: number) => {
    updatePresence({ xIndex: x, yIndex: y });
  };

  const changePresenceColor = (color: string) => {
    console.log("setting color" + color);
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
            localUser.current = userPresence;
          }

          // Update our local state
          const otherUsers = presence
            .toArray()
            .filter(
              (user) =>
                user.state === PresenceState.online &&
                localUser.current?.userId !== user.userId
            );

          pixelStateMap.forEach((value, key) => {
            if (value.otherUserMouseOverColor) {
              value.setOtherUserMouseOverColor(undefined);
            }
          });

          otherUsers.forEach((user) => {
            if (user.data) {
              const pixelColorState = pixelStateMap.get(
                `${user.data.xIndex},${user.data.yIndex}`
              );

              pixelColorState?.setOtherUserMouseOverColor(
                user.data.selectedColor
              );
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
            selectedColor: "red",
          },
          PresenceState.online
        )
        .catch((error) => {
          console.error(error);
        });
    }
  }, [presence]);

  return {
    changePresencePosition,
    changePresenceColor,
  };
};
