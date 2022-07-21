import "../App.css";
import { useRef } from "react";
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

  const { getSelectedColor, changePresencePosition, changePresenceColor } =
    usePresence(pixelStateMapRef, presence);

  return (
    <div className="App">
      <ColorPicker changeColor={changePresenceColor} />

      <br />
      <br />
      <br />
      <br />
      <br />

      {
        <PixelGrid
          pixelStateMap={pixelStateMapRef.current}
          onPixelSelected={(x: number, y: number) => {
            setPixelColor(x, y, getSelectedColor());
          }}
          changePresencePosition={changePresencePosition}
        />
      }
    </div>
  );
}

export default MeetingStage;
