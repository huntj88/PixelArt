import "./App.css";
import { Dispatch, SetStateAction } from "react";
import { useSharedObjects } from "./live-share-hooks/useSharedData";
import { usePixelMap } from "./live-share-hooks/usePixelMap";
import { usePresence } from "./usePresence";
import { PixelGrid } from "./PixelGrid";
import { ColorPicker } from "./ColorPicker";

const stateMap = new Map<string, [string, Dispatch<SetStateAction<string>>]>();

function MeetingStage() {
  const { presence, pixelMap, container, error } = useSharedObjects();
  const { setPixelColor } = usePixelMap(stateMap, pixelMap);

  const { localUser, allUsers, changePosition, changeColor } =
    usePresence(presence);

  const test = {
    stateMap,
    setPixelColor,
    changePosition,
    allUsers,
    localUser,
  };

  return (
    <div className="App">
      <ColorPicker changeColor={changeColor} />

      <br />
      <br />
      <br />
      <br />
      <br />

      <PixelGrid
        stateMap={stateMap}
        setPixelColor={setPixelColor}
        changePosition={changePosition}
        allUsers={allUsers}
        localUser={localUser}
      />
    </div>
  );
}

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export default MeetingStage;
