import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

export type Layer = "std" | "seamlessphoto";

function lonLatToTile(lon: number, lat: number, z: number) {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** z;
  const xFloat = ((lon + 180) / 360) * n;
  const yFloat =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    n;

  return {
    z,
    x: Math.floor(xFloat),
    y: Math.floor(yFloat),
  };
}

function urlFor(layer: Layer, z: number, x: number, y: number) {
  return layer === "seamlessphoto"
    ? `https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/${z}/${x}/${y}.jpg`
    : `https://cyberjapandata.gsi.go.jp/xyz/std/${z}/${x}/${y}.png`;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`画像の取得に失敗しました: ${url}`));
    img.src = url;
  });
}

type Props = {
  lat: number;
  lon: number;
  z?: number;
  layer?: Layer;
  tileSize?: number;
  range?: number;
  worldTile?: number;
  y?: number;
};

export function GsiMergedTilePlane({
  lat,
  lon,
  z = 16,
  layer = "std",
  tileSize = 256,
  range = 1,
  worldTile = 10,
  y = 0.001,
}: Props) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const { x: cx, y: cy } = lonLatToTile(lon, lat, z);
        const tiles: { x: number; y: number }[] = [];
        for (let dy = -range; dy <= range; dy++) {
          for (let dx = -range; dx <= range; dx++) {
            tiles.push({ x: cx + dx, y: cy + dy });
          }
        }

        const urls = tiles.map((t) => urlFor(layer, z, t.x, t.y));
        const images = await Promise.all(urls.map(loadImage));
        if (aborted) return;

        const count = range * 2 + 1;
        const canvas = document.createElement("canvas");
        canvas.width = count * tileSize;
        canvas.height = count * tileSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("キャンバスのコンテキスト取得に失敗しました");

        images.forEach((img, i) => {
          const col = i % count;
          const row = Math.floor(i / count);
          ctx.drawImage(img, col * tileSize, row * tileSize, tileSize, tileSize);
        });

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 16;
        tex.colorSpace = THREE.SRGBColorSpace;
        if (!aborted) setTexture(tex);
      } catch (error) {
        console.error(error);
        setTexture(null);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [lat, lon, z, layer, tileSize, range]);

  const planeSize = useMemo(
    () => (range * 2 + 1) * worldTile,
    [range, worldTile]
  );

  if (!texture) return null;

  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <planeGeometry args={[planeSize, planeSize]} />
      <meshBasicMaterial map={texture} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
  );
}
