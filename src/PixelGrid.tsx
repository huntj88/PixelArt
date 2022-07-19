import { EphemeralPresenceUser } from "@microsoft/live-share";
import { Dispatch, FC, SetStateAction, useCallback } from "react";
import GridPixel from "./GridPixel";
import { PresenceData } from "./usePresence";

export interface IColorPickerProps {
  stateMap: Map<string, [string, Dispatch<SetStateAction<string>>]>;
  setPixelColor: (x: number, y: number, color: string) => void;
  changePosition: (x: number, y: number) => void;
  allUsers: EphemeralPresenceUser[];
  localUser?: EphemeralPresenceUser;
}

export const PixelGrid: FC<IColorPickerProps> = ({
  stateMap,
  setPixelColor,
  changePosition,
  allUsers,
  localUser,
}) => {
  const setPixelColorFromSelected = useCallback(
    (x: number, y: number) => {
      if (localUser?.data) {
        const presenceData = localUser.data as PresenceData;
        if (presenceData?.selectedColor) {
          setPixelColor(x, y, presenceData.selectedColor);
        }
      }
    },
    [localUser, setPixelColor]
  );

  const otherUsers = allUsers.filter(
    (user) => user.userId !== localUser?.userId
  );

  const localUserData = localUser?.data as PresenceData;
  const localUserSelectedColor = localUserData?.selectedColor ?? "white";

  return (
    <div>
      {[...range(0, 40)].map((xIndex) => {
        return (
          <div key={`${xIndex}`} style={{ width: 27, float: "left" }}>
            {[...range(0, 25)].map((yIndex) => {
              return (
                <div key={`${xIndex},${yIndex}`}>
                  <GridPixel
                    stateMap={stateMap}
                    xIndex={xIndex}
                    yIndex={yIndex}
                    onPixelSelected={setPixelColorFromSelected}
                    otherUsers={otherUsers}
                    selectedColor={localUserSelectedColor}
                    onMouseOverPixel={(x: number, y: number) => {
                      changePosition(x, y);
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);
