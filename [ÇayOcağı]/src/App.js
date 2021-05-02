import { useState } from "react";
import "./styles.css";
import Welcome from "./Welcome";
import AudioRoom from "./AudioRoom";

export default function App() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState();

  return (
    <div className="App">
      <h1>☕ ÇayOcağı ☕</h1>
      {step === 0 ? (
        <Welcome name={name} setName={setName} setStep={setStep} />
      ) : (
        <AudioRoom name={name} />
      )}
    </div>
  );
}
