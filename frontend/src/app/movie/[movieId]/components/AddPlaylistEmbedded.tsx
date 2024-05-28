import React from "react";
import CreatePlaylistFormEmbedded from "./CreatePlaylistFormEmbedded";
import { formContext } from "./formContext";

function AddPlaylistEmbedded() {
  const [status, setStatus] = React.useState("");
  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium text-center btn glass bg-darkBlue">
        Create new playlist
      </div>
      <div className="collapse-content">
        <formContext.Provider value={{ status, setStatus }}>
          <CreatePlaylistFormEmbedded />
        </formContext.Provider>
      </div>
    </div>
  );
}

export default AddPlaylistEmbedded;
