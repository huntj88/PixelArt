import "./App.css";
import GridPixel from "./GridPixel";
import { useCallback, Dispatch, SetStateAction } from "react";
import { useSharedObjects } from "./live-share-hooks/useSharedData";
import { usePixelMap } from "./live-share-hooks/usePixelMap";
import { PresenceData, usePresence } from "./usePresence";

const possibleColors = [
  "red",
  "blue",
  "green",
  "white",
  "black",
  "yellow",
  "cyan",
  "orange",
  "purple",
];

const stateMap = new Map<string, [string, Dispatch<SetStateAction<string>>]>();

function MeetingStage() {
  const { presence, pixelMap, container, error } = useSharedObjects();
  const { setPixelColor } = usePixelMap(stateMap, pixelMap);

  const { presenceStarted, localUser, allUsers, changePosition, changeColor } =
    usePresence(presence);

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
    <div className="App">
      <br />
      {possibleColors.map((color) => {
        return (
          <div
            key={color}
            style={{
              height: 70,
              width: 70,
              backgroundColor: color,
              float: "left",
            }}
            onClick={() => {
              changeColor(color);
            }}
          />
        );
      })}

      <br />
      <br />
      <br />
      <br />
      <br />

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
}

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export default MeetingStage;
