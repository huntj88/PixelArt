import "./App.css";
import GridColumn from "./GridColumn";
import GridPixel from "./GridPixel";
import { useState, useCallback } from "react";
import { useSharedObjects } from "./live-share-hooks/useSharedData";
import { usePixelMap } from "./live-share-hooks/usePixelMap";
import { PresenceData, usePresence } from "./usePresence";

function MeetingStage() {
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

  const { presence, pixelMap, container, error } = useSharedObjects();
  const { pixelMapState, setPixelColor } = usePixelMap(pixelMap);
  const { presenceStarted, localUser, users, changePosition, changeColor } =
    usePresence(presence);

  const setPixelColorFromSelected = useCallback(
    (x: number, y: number) => {
      console.log("selected color");
      if (localUser?.data) {
        const presenceData = localUser.data as PresenceData;
        if (presenceData?.selectedColor) {
          setPixelColor(x, y, presenceData.selectedColor);
        }
      }
    },
    [localUser, setPixelColor]
  );

  return (
    <div className="App">
      <br />
      {possibleColors.map((color) => {
        return (
          <div
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

      {[...range(0, 40)].map((x) => {
        return (
          <GridColumn
            pixelMapState={pixelMapState}
            xIndex={x}
            pixelSelected={setPixelColorFromSelected}
            users={users}
            onMouseOverPixel={(x: number, y: number) => {
              changePosition(x, y);
            }}
          />
        );
      })}
    </div>
  );
}

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export default MeetingStage;
