/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

const TabConfig = () => {
  useEffect(() => {
    microsoftTeams.pages.config.registerOnSaveHandler(function (saveEvent) {
      microsoftTeams.pages.config.setConfig({
        suggestedDisplayName: "Pixel art",
        contentUrl: `${window.location.origin}/sidepanel?inTeams=true`,
      });
      saveEvent.notifySuccess();
    });

    microsoftTeams.pages.config.setValidityState(true);
  }, []);

  return (
    <div>
      <h1>wow</h1>
    </div>
  );
};

export default TabConfig;
