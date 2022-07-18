import "./App.css";
import GridColumn from "./GridColumn";
import GridPixel from "./GridPixel";
import { useState, useCallback } from "react";
import { SharedMap } from "fluid-framework";
import { useSharedObjects } from "./live-share-hooks/useSharedData";
import { usePixelMap } from "./live-share-hooks/usePixelMap";

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

  // SharedMap hook for user stories
  const { pixelBoard, setPixelColor } = usePixelMap(
    pixelMap as SharedMap // todo: do i need the cast?
  );

  const [selectedColor, setSelectedColor] = useState<string>("red");

  const setPixelColorBlah = useCallback(
    (x: number, y: number) => {
      console.log("selected color");
      setPixelColor(x, y, selectedColor);
    },
    [selectedColor, setPixelColor]
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
            setPixelColor={() => {
              setSelectedColor(color);
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
            setPixelColor={setPixelColorBlah}
          />
        );
      })}
    </div>
  );
}

export default MeetingStage;
