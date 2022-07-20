import "../App.css";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { useSharedObjects } from "../live-share-hooks/useSharedData";
import { usePixelMap } from "../live-share-hooks/usePixelMap";
import { usePresence } from "../live-share-hooks/usePresence";
import { PixelGrid } from "./PixelGrid";
import { ColorPicker } from "./ColorPicker";
import { IPixelColorState } from "./Pixel";

function MeetingStage() {
  const pixelStateMapRef = useRef(new Map<string, IPixelColorState>());

  const { presence, pixelMap } = useSharedObjects();
  const { setPixelColor } = usePixelMap(pixelStateMapRef.current, pixelMap);

  const { changePresencePosition, changePresenceColor } = usePresence(
    pixelStateMapRef.current,
    presence
  );

  const [selectedColor, setSelectedColor] = useState("red");

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

      {
        <PixelGrid
          pixelStateMap={pixelStateMapRef.current}
          onPixelSelected={(x: number, y: number) => {
            setPixelColor(x, y, selectedColor);
          }}
          changePresencePosition={changePresencePosition}
          selectedColor={selectedColor}
        />
      }
    </div>
  );
}

export default MeetingStage;
