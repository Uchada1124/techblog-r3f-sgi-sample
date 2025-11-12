import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import type { Layer } from './ChiriinMapMesh';
import './index.css';

function App() {
  const [layer, setLayer] = useState<Layer>('std');

  return (
    <div className="app-root">
      <Canvas camera={{ position: [10, 10, 10], fov: 60 }} style={{ background: '#f5f6fb' }}>
        <Scene layer={layer} />
      </Canvas>

      {/* toolbar */}
      <div className="toolbar">
        <div className="segmented" role="tablist" aria-label="Map layer">
          <button
            role="tab"
            aria-selected={layer === 'std'}
            className={`segmented__btn ${layer === 'std' ? 'is-active' : ''}`}
            onClick={() => setLayer('std')}
          >
            標準地図
          </button>
          <button
            role="tab"
            aria-selected={layer === 'seamlessphoto'}
            className={`segmented__btn ${layer === 'seamlessphoto' ? 'is-active' : ''}`}
            onClick={() => setLayer('seamlessphoto')}
          >
            航空写真
          </button>
        </div>
      </div>

      {/* credit */}
      <div className="credit">
        <a
          href="https://maps.gsi.go.jp/development/ichiran.html"
          target="_blank"
          rel="noreferrer noopener"
        >
          出展:地理院タイル（国土地理院）
        </a>
      </div>
    </div>
  );
}

export default App;
