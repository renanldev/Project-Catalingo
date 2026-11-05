import { useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";
import CameraScreen from "./src/screens/CameraScreen";

export default function App() {
  const [telaAtual, setTelaAtual] = useState("home"); // "home" ou "camera"

  if (telaAtual === "camera") {
    return <CameraScreen aoVoltar={() => setTelaAtual("home")} />;
  }

  return <HomeScreen aoIrParaCamera={() => setTelaAtual("camera")} />;
}