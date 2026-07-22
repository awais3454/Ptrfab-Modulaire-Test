import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

function ModelWithAutoFit() {
  const { scene } = useGLTF('/model.glb')
  const { camera, size } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const sphere = new THREE.Sphere()
    box.getBoundingSphere(sphere)
    const center = sphere.center
    const radius = sphere.radius || 1

    // Account for aspect ratio so narrow mobile screens don't crop the model
    const aspect = size.width / size.height
    const vFov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
    const effectiveFov = Math.min(vFov, hFov)

    // Only adjust framing (zoom/vertical shift) for mobile & tablet — desktop stays as-is
    const isSmallScreen = size.width <= 768
    const marginFactor = isSmallScreen ? 1.15 : 1.35
    const verticalShiftFactor = isSmallScreen ? 0.35 : 0

    const distance = (radius / Math.sin(effectiveFov / 2)) * marginFactor

    // Shift the look-at point down a bit so the model appears higher in the frame (mobile/tablet only)
    const adjustedCenter = center.clone()
    adjustedCenter.y -= radius * verticalShiftFactor

    // Keep the exact confirmed desktop viewing angle — only scale distance
    // so the same angle fits narrower mobile aspect ratios too.
    const dir = new THREE.Vector3(30, 3.2, -30.4).normalize()
    camera.position.set(
      adjustedCenter.x + dir.x * distance,
      adjustedCenter.y + dir.y * distance,
      adjustedCenter.z + dir.z * distance
    )
    ;(camera as THREE.PerspectiveCamera).near = Math.max(distance / 100, 0.1)
    ;(camera as THREE.PerspectiveCamera).far = distance * 10
    camera.lookAt(adjustedCenter)
    camera.updateProjectionMatrix()

    if (controlsRef.current) {
      controlsRef.current.target.copy(adjustedCenter)
      controlsRef.current.update()
    }
  }, [scene, size.width, size.height, camera])

  return (
    <>
      <primitive object={scene} />
      <OrbitControls ref={controlsRef} makeDefault enableDamping />
    </>
  )
}

export default function App() {
  const [showHint, setShowHint] = useState(true)

  return (
    <div className="app-root" style={{ position: 'relative', background: '#faf6f0', fontFamily: 'sans-serif', overflow: 'hidden' }}>

      {/* Responsive rules */}
      <style>{`
        .app-root {
          width: 100vw;
          height: 100vh;
          height: 100dvh;
        }
        .info-panel {
          width: 380px;
          padding: 24px;
          bottom: 24px;
          left: 24px;
          max-height: 80vh;
          overflow-y: auto;
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
        .model-thumb {
          max-height: 220px;
          width: auto;
          max-width: 100%;
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
            max-height: 48vh;
            overflow-y: auto;
          }
          .logo-box {
            height: 36px;
          }
          .logo-img {
            height: 65px;
            margin-left: -4px;
            margin-top: -8px;
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
        <Canvas camera={{ fov: 40 }}>
          <Suspense fallback={null}>
            <ModelWithAutoFit />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}