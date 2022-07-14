import "./App.css";
import GridColumn from "./GridColumn";
import GridPixel from "./GridPixel";
import { useState, useEffect, useRef, useCallback } from "react";
import { SharedMap, IFluidContainer } from "fluid-framework";
import { TeamsFluidClient } from "@microsoft/live-share";
import { LOCAL_MODE_TENANT_ID } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
import { ContainerSchema } from "@fluidframework/fluid-static";
import { inTeams } from "./inTeams";

const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

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
  // // x pos is index of outer array, y pos is index of an inner array
  const [board, setBoard] = useState<string[][]>(
    [...range(0, 20)].map(() => {
      return [...range(0, 15)].map(() => "white");
    })
  );

  const pixelMapRef = useRef<SharedMap>();
  const initRef = useRef<boolean>(false);

  const [selectedColor, setSelectedColor] = useState<string>("red");

  const setPixelColor = (x: number, y: number) => {
    console.log("selected color");
    pixelMapRef.current?.set(`${x},${y}`, selectedColor);
  };

  const updateBoardWithShared = useCallback(() => {
    const mutableBoard = [...board];

    pixelMapRef.current?.forEach((value: string, key: string) => {
      const x = Number.parseInt(key.split(",")[0]);
      const y = Number.parseInt(key.split(",")[1]);
      mutableBoard[x][y] = value;
    });

    setBoard(mutableBoard);
  }, [board, setBoard]);

  useEffect(() => {
    if (initRef.current) {
      return;
    }

    initRef.current = true;

    const schema: ContainerSchema = {
      initialObjects: { pixelMap: SharedMap },
    };

    let connection;
    console.log(inTeams());
    if (!inTeams()) {
      connection = {
        tenantId: LOCAL_MODE_TENANT_ID,
        tokenProvider: new InsecureTokenProvider("", {
          id: "123",
        }),
        orderer: "http://localhost:7070",
        storage: "http://localhost:7070",
      };
    }
    const clientProps = {
      connection,
    };
    // Enable debugger
    window.localStorage.debug = "fluid:*";

    // Define Fluid document schema and create container
    const client = new TeamsFluidClient(clientProps);

    client
      .joinContainer(schema, (container: IFluidContainer) => {
        // preload existing board
        updateBoardWithShared();
      })
      .then((results) => {
        const pixelMap: SharedMap = results.container.initialObjects
          .pixelMap as SharedMap;
        pixelMapRef.current = pixelMap;
        pixelMap.on("valueChanged", updateBoardWithShared);
      })
      .catch((err) => console.log(err));
  });

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

      {board.map((column, index) => {
        return (
          <GridColumn
            xIndex={index}
            columnData={column}
            setPixelColor={setPixelColor}
          />
        );
      })}
    </div>
  );
}

export default MeetingStage;
