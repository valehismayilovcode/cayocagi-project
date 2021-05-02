import React from "react";
import Call from "./Call";

const AudioCall = new Call();

export default function AudioRoom({ name, setName }) {
  const start = () => {
    AudioCall.join();
  };
  return (
    <div className="App">
      <h2>Kullanıcı : {name}</h2>
      <button onClick={start}>ÇayOcağına Gir</button>
    </div>
  );
}
