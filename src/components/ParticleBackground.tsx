import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

const PARTICLE_COUNT = 15000
const LINE_COUNT = 530
const REPEL_DISTANCE = 20
const FORCE_MULTIPLIER = 0.04
const COLOR_MIX = 0.4

const BASE_COLOR = new THREE.Color(0x001f3f)
const ACID_COLOR = new THREE.Color(0xccff00)

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = window.innerWidth
    const height = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.z = 80

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x030014, 1)
    container.appendChild(renderer.domElement)

    // --- Particles ---
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const original = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const x = (Math.random() - 0.5) * 180
      const y = (Math.random() - 0.5) * 120
      const z = (Math.random() - 0.5) * 160
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      original[i3] = x
      original[i3 + 1] = y
      original[i3 + 2] = z
      colors[i3] = BASE_COLOR.r
      colors[i3 + 1] = BASE_COLOR.g
      colors[i3 + 2] = BASE_COLOR.b
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.5,
      opacity: 0.2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // --- Energy lines ---
    const lines: Line2[] = []
    const lineMaterials: LineMaterial[] = []
    const lineSpeeds: number[] = []
    const lineBases: Float32Array[] = []

    for (let i = 0; i < LINE_COUNT; i++) {
      const startX = (Math.random() - 0.5) * 160
      const startY = (Math.random() - 0.5) * 100
      const startZ = (Math.random() - 0.5) * 200 - 40
      const len = 4 + Math.random() * 18

      const positions3 = new Float32Array([
        startX,
        startY,
        startZ,
        startX + (Math.random() - 0.5) * 2,
        startY + (Math.random() - 0.5) * 2,
        startZ + len,
      ])

      const geometry = new LineGeometry()
      geometry.setPositions(Array.from(positions3))

      const material = new LineMaterial({
        color: 0x88aaff,
        linewidth: 0.005,
        transparent: true,
        opacity: 0.2,
        dashed: true,
        dashSize: 1.2,
        gapSize: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      material.resolution.set(width, height)

      const line = new Line2(geometry, material)
      line.computeLineDistances()
      scene.add(line)
      lines.push(line)
      lineMaterials.push(material)
      lineSpeeds.push(0.15 + Math.random() * 0.45)
      lineBases.push(positions3)
    }

    // --- Post-processing ---
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.8,
      0.1,
      1.0,
    )
    composer.addPass(bloomPass)

    // --- Interaction ---
    const pointer = new THREE.Vector2(-9999, -9999)
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const intersection = new THREE.Vector3()
    const tempColor = new THREE.Color()

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
      bloomPass.resolution.set(w, h)
      lineMaterials.forEach((m) => m.resolution.set(w, h))
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('resize', onResize)

    let frameId = 0
    let running = true

    const animate = () => {
      if (!running) return
      frameId = window.requestAnimationFrame(animate)

      raycaster.setFromCamera(pointer, camera)
      raycaster.ray.intersectPlane(plane, intersection)

      const posAttr = particleGeometry.getAttribute('position') as THREE.BufferAttribute
      const colAttr = particleGeometry.getAttribute('color') as THREE.BufferAttribute
      const posArr = posAttr.array as Float32Array
      const colArr = colAttr.array as Float32Array

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        const ox = original[i3]
        const oy = original[i3 + 1]
        const oz = original[i3 + 2]

        let px = posArr[i3]
        let py = posArr[i3 + 1]
        let pz = posArr[i3 + 2]

        const dx = px - intersection.x
        const dy = py - intersection.y
        const dz = pz - intersection.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        let mix = 0
        if (dist < REPEL_DISTANCE && dist > 0.001) {
          const force = ((REPEL_DISTANCE - dist) / REPEL_DISTANCE) * FORCE_MULTIPLIER
          velocities[i3] += (dx / dist) * force
          velocities[i3 + 1] += (dy / dist) * force
          velocities[i3 + 2] += (dz / dist) * force
          mix = Math.min(COLOR_MIX, ((REPEL_DISTANCE - dist) / REPEL_DISTANCE) * COLOR_MIX)
        }

        // Spring back to original
        velocities[i3] += (ox - px) * 0.01
        velocities[i3 + 1] += (oy - py) * 0.01
        velocities[i3 + 2] += (oz - pz) * 0.01

        velocities[i3] *= 0.92
        velocities[i3 + 1] *= 0.92
        velocities[i3 + 2] *= 0.92

        posArr[i3] = px + velocities[i3]
        posArr[i3 + 1] = py + velocities[i3 + 1]
        posArr[i3 + 2] = pz + velocities[i3 + 2]

        tempColor.copy(BASE_COLOR).lerp(ACID_COLOR, mix)
        colArr[i3] = tempColor.r
        colArr[i3 + 1] = tempColor.g
        colArr[i3 + 2] = tempColor.b
      }

      posAttr.needsUpdate = true
      colAttr.needsUpdate = true

      // Advance energy lines in Z
      for (let i = 0; i < lines.length; i++) {
        const base = lineBases[i]
        base[2] += lineSpeeds[i]
        base[5] += lineSpeeds[i]

        if (base[2] > 90) {
          const reset = 200 + Math.random() * 40
          base[2] -= reset
          base[5] -= reset
          base[0] = (Math.random() - 0.5) * 160
          base[1] = (Math.random() - 0.5) * 100
          base[3] = base[0] + (Math.random() - 0.5) * 2
          base[4] = base[1] + (Math.random() - 0.5) * 2
        }

        const geom = lines[i].geometry as LineGeometry
        geom.setPositions(Array.from(base))
        lines[i].computeLineDistances()
      }

      particles.rotation.y += 0.0004
      composer.render()
    }

    animate()

    return () => {
      running = false
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)

      lines.forEach((line) => {
        scene.remove(line)
        line.geometry.dispose()
      })
      lineMaterials.forEach((m) => m.dispose())

      scene.remove(particles)
      particleGeometry.dispose()
      particleMaterial.dispose()

      composer.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
