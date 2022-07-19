/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as microsoftTeams from "@microsoft/teams-js";

const SidePanel = () => {
  return (
    <div>
      <button
        onClick={() => {
          microsoftTeams.meeting.shareAppContentToStage((error) => {
            if (error) {
              console.error(error);
            }
          }, `${window.location.origin}/?inTeams=true`);
        }}
      >
        Sup
      </button>
    </div>
  );
};

export default SidePanel;
