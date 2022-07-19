import { EphemeralPresenceUser } from "@microsoft/live-share";
import { Dispatch, SetStateAction, FC } from "react";

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

export interface IColorPickerProps {
  changeColor: (color: string) => void;
}

export const ColorPicker: FC<IColorPickerProps> = ({ changeColor }) => {
  return (
    <div>
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
    </div>
  );
};
