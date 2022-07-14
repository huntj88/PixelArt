/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as microsoftTeams from "@microsoft/teams-js";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MeetingStage from "./MeetingStage";
import SidePanel from "./SidePanel";
import TabConfig from "./TabConfig";
import { inTeams } from "./inTeams";

export default function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      if (inTeams()) {
        console.log("App.js: initializing client SDK");
        microsoftTeams.app
          .initialize()
          .then(() => {
            console.log("App.js: initializing client SDK initialized");
            microsoftTeams.app.notifyAppLoaded();
            microsoftTeams.app.notifySuccess();
            setInitialized(true);
          })
          .catch((error) => console.error(error));
      } else {
        setInitialized(true);
      }
    }
  }, [initialized]);

  if (!initialized) {
    return <div />;
  }

  return (
    <Router>
      <Routes>
        <Route path={"/sidepanel"} element={<SidePanel />} />
        <Route path={"/config"} element={<TabConfig />} />
        <Route path={"/"} element={<MeetingStage />} />
      </Routes>
    </Router>
  );
}
