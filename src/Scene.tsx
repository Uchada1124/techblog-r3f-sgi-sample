import { OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { Suspense } from "react";
import { GsiMergedTilePlane, type Layer } from "./ChiriinMapMesh";

const TOKYO_STATION = {
  lat: 35.681236,
  lon: 139.767125,
};

type SceneProps = {
  layer: Layer;
};

export function Scene({ layer }: SceneProps) {
  return (
    <Suspense fallback={<div style={{ color: "#888", padding: 12 }}>Loading 3D…</div>}>
      {/* ライト */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* グリッドと軸 */}
      <gridHelper args={[50, 50]} />
      <axesHelper args={[10]} />

      <GsiMergedTilePlane
        lat={TOKYO_STATION.lat}
        lon={TOKYO_STATION.lon}
        layer={layer}
      />

      {/* カメラ操作 */}
      <OrbitControls makeDefault enableDamping />

      {/* 右上の軸Gizmo */}
      <GizmoHelper alignment="top-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#ef4444", "#22c55e", "#3b82f6"]}
          labelColor="#111827"
        />
      </GizmoHelper>
    </Suspense>
  );
}
