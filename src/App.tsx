import './App.css';
import GridColumn from './GridColumn'
import { useState, useEffect, useRef, useCallback } from 'react'
import { SharedMap } from "fluid-framework";
import { TeamsFluidClient } from "@microsoft/live-share";
import { LOCAL_MODE_TENANT_ID } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
import { ContainerSchema, IFluidContainer } from "@fluidframework/fluid-static";

function App() {
  // const boardValueKey = "board-value-key";

  const range = (start: number, end: number, length = end - start) => Array.from({ length }, (_, i) => start + i)

  // // x pos is index of outer array, y pos is index of an inner array
  const [board, setBoard] = useState<string[][]>(
    [...range(0, 20)].map(() => { return [...range(0, 15)].map(() => "white")})
  ) 

  const pixelMapRef = useRef<SharedMap>()

  const setPixelColor = (x: number, y: number, color: string) => {
    console.log(pixelMapRef.current?.get(`${x},${y}`))
    pixelMapRef.current?.set(`${x},${y}`, color);
    console.log(pixelMapRef.current?.get(`${x},${y}`))
  }

  const updateBoardWithShared = useCallback(() => {
    const mutableBoard = [...board]

    pixelMapRef.current?.forEach((value: string, key: string) => {
      const x = Number.parseInt(key.split(',')[0]);
      const y = Number.parseInt(key.split(',')[1]);
      mutableBoard[x][y] = value
    })

    setBoard(mutableBoard)
  }, [board, setBoard]);

  useEffect(() => {
      const schema: ContainerSchema = {
        initialObjects: { pixelMap: SharedMap },
      };

      let connection = {
        tenantId: LOCAL_MODE_TENANT_ID,
        tokenProvider: new InsecureTokenProvider("", {
          id: "123",
        }),
        orderer: "http://localhost:7070",
        storage: "http://localhost:7070",
      };
      const clientProps = {
        connection,
      };  
      // Enable debugger
      window.localStorage.debug = "fluid:*";

      // Define Fluid document schema and create container
      const client = new TeamsFluidClient(clientProps);

      const onFirstInitialize = (container: IFluidContainer) => {
        // Setup any initial state here
        console.log("set initial state")
      };

      console.log("joining")

      client
        .joinContainer(schema, onFirstInitialize)
        .then((results) => {
          const pixelMap: SharedMap = results.container.initialObjects.pixelMap as SharedMap
          pixelMapRef.current = pixelMap
          pixelMap.on("valueChanged", updateBoardWithShared);
        })
        .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      {
        board.map((column, index) => {
          return <GridColumn xIndex={index} columnData={column} setPixelColor = {setPixelColor}/>
        })
      }
    </div>
  );
}

export default App;
