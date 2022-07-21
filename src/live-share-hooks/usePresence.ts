import { MutableRefObject, useCallback, useEffect, useRef } from "react";
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
  pixelStateMapRef: MutableRefObject<Map<string, IPixelColorState>>,
  presence?: Presence
) => {
  const localUserRef = useRef<PresenceUser | undefined>(undefined);

  const updatePresence = (data: PresenceData) => {
    if (!presence?.isStarted) {
      return;
    }

    const existingData = localUserRef.current?.data;
    presence?.updatePresence(PresenceState.online, {
      name: data.name ?? existingData?.name,
      xIndex: data.xIndex ?? existingData?.xIndex,
      yIndex: data.yIndex ?? existingData?.yIndex,
      selectedColor: data.selectedColor ?? existingData?.selectedColor,
    });
  };

  const changePresencePosition = (x: number, y: number) => {
    updatePresence({ xIndex: x, yIndex: y });
  };

  const changePresenceColor = (color: string) => {
    updatePresence({ selectedColor: color });
  };

  const getSelectedColor = () => {
    return localUserRef.current?.data?.selectedColor ?? "red";
  };

  const setPresenceColorAndLocation = useCallback(
    (users: PresenceUser[]) => {
      // reset mouseOverColors
      pixelStateMapRef.current.forEach((value, _) => {
        if (value.mouseOverColor) {
          value.setMouseOverColor(null);
        }
      });

      users.forEach((user) => {
        if (user.data) {
          const pixelColorState = pixelStateMapRef.current.get(
            `${user.data.xIndex},${user.data.yIndex}`
          );

          pixelColorState?.setMouseOverColor(user.data.selectedColor || null);
        }
      });
    },
    [pixelStateMapRef]
  );

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

          setPresenceColorAndLocation(allUsers);
        }
      );

      const initData = {
        selectedColor: getSelectedColor(),
      };

      presence
        .start(undefined, initData, PresenceState.online)
        .catch((error) => {
          console.error(error);
        });
    }
  }, [presence, setPresenceColorAndLocation]);

  return {
    getSelectedColor,
    changePresencePosition,
    changePresenceColor,
  };
};
