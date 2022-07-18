import { useEffect, useState } from "react";
import { EphemeralPresence, TeamsFluidClient } from "@microsoft/live-share";
import { LOCAL_MODE_TENANT_ID } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
import { IFluidContainer, SharedMap } from "fluid-framework";
import { inTeams } from "../inTeams";

/**
 * Hook that creates/loads the apps shared objects.
 *
 * @remarks
 * This is an application specific hook that defines the fluid schema of Distributed Data Structures (DDS)
 * used by the app and passes that schema to the `TeamsFluidClient` to create/load your Fluid container.
 *
 * @returns Shared objects managed by the apps fluid container.
 */
export function useSharedObjects() {
  const [container, setContainer] = useState<IFluidContainer>();
  const [error, setError] = useState();

  useEffect(() => {
    // Check if user is in Teams

    let connection;
    if (!inTeams()) {
      // Configure for local testing (optional).
      connection = {
        tenantId: LOCAL_MODE_TENANT_ID,
        tokenProvider: new InsecureTokenProvider("", {
          id: "123",
        }),
        orderer: "http://localhost:7070",
        storage: "http://localhost:7070",
      };
    }

    // Define any additional client settings (optional).
    // - connection: A custom Fluid Relay Service connection to use.
    // - logger: A fluid logger to use.
    const clientProps = {
      connection,
    };
    // Enable debugger
    window.localStorage.debug = "fluid:*";

    // Define container initializer.
    // * This is only called once when the container is first created.
    const onFirstInitialize = (container: IFluidContainer) => {
      // TODO: Setup any initial state here
    };

    // Define container schema
    const schema = {
      initialObjects: {
        presence: EphemeralPresence,
        pixelMap: SharedMap,
      },
    };

    // Join Teams container
    const client = new TeamsFluidClient(clientProps);
    client
      .joinContainer(schema, onFirstInitialize)
      .then((results) => setContainer(results.container))
      .catch((err) => setError(err));
  }, []);

  const initialObjects = container?.initialObjects;
  return {
    presence: initialObjects?.presence as EphemeralPresence | undefined,
    pixelMap: initialObjects?.pixelMap as SharedMap | undefined,
    container,
    error,
  };
}
