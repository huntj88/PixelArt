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
  const { pixelBoard, setPixelColor } = usePixelMap(pixelMap);
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
          <GridPixel
            xIndex={0}
            yIndex={0}
            pixelColor={color}
            pixelSelected={() => {
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

      {pixelBoard.map((column, index) => {
        return (
          <GridColumn
            xIndex={index}
            columnData={column}
            pixelSelected={setPixelColorFromSelected}
          />
        );
      })}
    </div>
  );
}

export default MeetingStage;
