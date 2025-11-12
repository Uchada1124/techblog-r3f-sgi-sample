import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene.tsx";
import { type Layer } from "./GsiMergedTilePlane";
import "./App.css";

function App() {
  const [layer, setLayer] = useState<Layer>("std");

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 60 }}
        style={{ background: "#f5f6fb" }}
      >
        <Scene layer={layer} />
      </Canvas>

      <div>
        {(["std", "seamlessphoto"] as Layer[]).map((value) => (
          <button
            key={value}
            onClick={() => setLayer(value)}
          >
            {value === "std" ? "標準地図" : "航空写真"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
