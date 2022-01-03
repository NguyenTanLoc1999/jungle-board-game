import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import useLocalStorage from "src/hooks/useLocalStorage";
import { apiDomain, PLAYER_NAME } from "src/constants";

import { IResCreateRoom } from 'jungle-board-game-server/types'

const Home: React.FC = () => {
  const [name, setName] = useLocalStorage<string>(PLAYER_NAME, "");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    setIsCreatingRoom(true);

    const {
      data: { roomId },
    } = await axios.post<IResCreateRoom>(`${apiDomain}/create-room`);

    setIsCreatingRoom(false);

    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div>
      Name:
      <input
        type="text"
        name="name"
        placeholder="john"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="button" onClick={createRoom} disabled={isCreatingRoom}>
        {isCreatingRoom ? "Creating" : "Create room"}
      </button>
    </div>
  );
};

export default Home;
