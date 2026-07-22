import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'

function Model() {
  const { scene } = useGLTF('/model.glb')
  return <primitive object={scene} />
}

function useCameraPosition() {
  const [position, setPosition] = useState<[number, number, number]>([30, 3.2, -30.4])

  useEffect(() => {
    function updatePosition() {
      const w = window.innerWidth
      if (w <= 480) {
        setPosition([52, 5.5, -52.5])
      } else if (w <= 768) {
        setPosition([42, 4.4, -42.5])
      } else {
        setPosition([30, 3.2, -30.4])
      }
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  return position
}

export default function App() {
  const [showHint, setShowHint] = useState(true)
  const cameraPosition = useCameraPosition()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#faf6f0', fontFamily: 'sans-serif', overflow: 'hidden' }}>

      {/* Responsive rules */}
      <style>{`
        .info-panel {
          width: 380px;
          padding: 24px;
          bottom: 24px;
          left: 24px;
        }
        .logo-box {
          height: 90px;
        }
        .logo-img {
          height: 160px;
          display: block;
          margin-left: -10px;
          margin-top: -20px;
        }
        .canvas-wrap {
          position: absolute;
          inset: 0;
        }
        .popup-box {
          max-width: 280px;
          font-size: 15px;
          top: 16px;
          left: 16px;
        }

        @media (max-width: 768px) {
          .info-panel {
            width: calc(100vw - 32px);
            max-width: 340px;
            padding: 16px;
            bottom: 16px;
            left: 16px;
            max-height: 45vh;
          }
          .logo-box {
            height: 55px;
          }
          .logo-img {
            height: 100px;
            margin-left: -6px;
            margin-top: -12px;
          }
          .canvas-wrap {
            top: -14%;
          }
          .model-thumb {
            max-height: 160px;
            width: auto !important;
          }
          .popup-box {
            max-width: calc(100vw - 32px);
            font-size: 13px;
            top: 12px;
            left: 12px;
          }
        }

        @media (max-width: 480px) {
          .info-panel {
            width: calc(100vw - 24px);
            max-width: none;
            padding: 12px;
            bottom: 12px;
            left: 12px;
            max-height: 38vh;
          }
          .logo-box {
            height: 36px;
          }
          .logo-img {
            height: 65px;
            margin-left: -4px;
            margin-top: -8px;
          }
          .canvas-wrap {
            top: -22%;
          }
          .model-thumb {
            max-height: 120px;
            width: auto !important;
          }
          .popup-box {
            max-width: calc(100vw - 24px);
            font-size: 12px;
            padding: 10px 32px 10px 12px !important;
          }
        }
      `}</style>

      {/* 360° popup — top-left */}
      {showHint && (
        <div className="popup-box" style={{
          position: 'absolute',
          zIndex: 20,
          background: '#fff',
          borderRadius: 12,
          padding: '14px 40px 14px 18px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          color: '#2d5a7a',
        }}>
          Het model is 360° rond te draaien.
          <button
            onClick={() => setShowHint(false)}
            style={{
              position: 'absolute', top: 10, right: 12,
              border: 'none', background: 'none',
              fontSize: 18, cursor: 'pointer', color: '#2d5a7a', lineHeight: 1,
            }}
            aria-label="Sluiten"
          >×</button>
        </div>
      )}

      {/* Left panel — logo + content */}
      <div className="info-panel" style={{
        position: 'absolute',
        zIndex: 10,
        maxHeight: '80vh',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        {/* Logo */}
        <div className="logo-box" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', marginTop: 12, marginBottom: 5 }}>
          <img 
            className="logo-img"
            src="/logo.png" 
            alt="Logo" 
          />
        </div>

        {/* Model image */}
        <div style={{ marginTop: 4, textAlign: 'center' }}>
          <img className="model-thumb" src="/model-thumb.jpeg" alt="Model" style={{ maxWidth: '100%', borderRadius: 8 }} />
        </div>

        {/* Step indicator */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{
            fontSize: 13,
            letterSpacing: 1,
            color: '#2d5a7a',
            marginBottom: 8,
          }}>
            1 VAN 1
          </div>
          <div style={{
            height: 3,
            background: '#e5e5e5',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: '100%',
              background: '#5a8db5',
            }} />
          </div>
        </div>
      </div>

      {/* 3D view */}
      <div className="canvas-wrap">
        <Canvas camera={{ position: cameraPosition, fov: 40 }}>
          <Suspense fallback={null}>
            <Center>
              <Model />
            </Center>
            <Environment preset="city" />
          </Suspense>
          <OrbitControls makeDefault enableDamping />
        </Canvas>
      </div>
    </div>
  )
}