import React from "react";
import CreatePlaylistFormEmbedded from "./CreatePlaylistFormEmbedded";
function AddPlaylistEmbedded() {
  const createPlaylist = () => {
    const url = `http://localhost:3000/api/playlists/`;
  };

  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium text-center btn glass bg-darkBlue">
        Create new playlist
      </div>
      <div className="collapse-content">
        <CreatePlaylistFormEmbedded />
      </div>
    </div>
  );
}

export default AddPlaylistEmbedded;
