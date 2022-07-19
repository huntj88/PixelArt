import "../App.css";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { useSharedObjects } from "../live-share-hooks/useSharedData";
import { usePixelMap } from "../live-share-hooks/usePixelMap";
import { usePresence } from "../live-share-hooks/usePresence";
import { PixelGrid } from "./PixelGrid";
import { ColorPicker } from "./ColorPicker";

function MeetingStage() {
  const pixelStateMapRef = useRef(
    new Map<string, [string, Dispatch<SetStateAction<string>>]>()
  );

  const { presence, pixelMap, container, error } = useSharedObjects();
  const { pixelMapStarted, setPixelColor } = usePixelMap(
    pixelStateMapRef.current,
    pixelMap
  );

  const {
    presenceStarted,
    localUser,
    allUsers,
    changePresencePosition,
    changePresenceColor,
  } = usePresence(presence);

  const [selectedColor, setSelectedColor] = useState("red");

  const otherUsers = allUsers.filter(
    (user) => user.userId !== localUser?.userId
  );

  return (
    <div className="App">
      <ColorPicker
        changeColor={(color: string) => {
          setSelectedColor(color);
          changePresenceColor(color);
        }}
      />

      <br />
      <br />
      <br />
      <br />
      <br />

      {presenceStarted && pixelMapStarted && (
        <PixelGrid
          pixelStateMap={pixelStateMapRef.current}
          setPixelColor={(x: number, y: number) => {
            setPixelColor(x, y, selectedColor);
          }}
          changePresencePosition={changePresencePosition}
          otherUsers={otherUsers}
          selectedColor={selectedColor}
        />
      )}
    </div>
  );
}

export default MeetingStage;
