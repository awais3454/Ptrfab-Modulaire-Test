import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei'
import { Suspense, useState } from 'react'

function Model() {
  const { scene } = useGLTF('/model.glb')
  return <primitive object={scene} />
}

export default function App() {
  const [showHint, setShowHint] = useState(true)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#faf6f0', fontFamily: 'sans-serif' }}>

      {/* 360° popup — top-left */}
      {showHint && (
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 20,
          background: '#fff',
          borderRadius: 12,
          padding: '14px 40px 14px 18px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          maxWidth: 280,
          fontSize: 15,
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
      <div style={{
        position: 'absolute',
        left: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: 380,
        maxHeight: '80vh',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: 24,
      }}>
        {/* Logo */}
        <img src="/logo.png" alt="Logo" style={{ height: 84, display: 'block' }} />

       {/* Model image */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <img src="/model-thumb.jpeg" alt="Model" style={{ maxWidth: '100%', borderRadius: 8 }} />
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
     <Canvas camera={{ position: [20, 12, -20], fov: 40 }}>
        <Suspense fallback={null}>
          <Center>
            <Model />
          </Center>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls makeDefault enableDamping />
      </Canvas>
    </div>
  )
}