import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

// The forge, in three states. A cloud of points is dust at the top of the
// page, a cube lattice halfway down it, and a page layout by the bottom —
// raw material, structure, finished site. Nothing on this canvas is written
// in words; the scroll does the talking.
//
// It is one THREE.Points object (one draw call) plus two hairline
// LineSegments, so the whole hero costs about what the grain texture already
// on the page costs. three is dynamically imported, so the catalog, the detail
// pages and the legal pages never download a byte of it.

const COUNT_WIDE = 3600
const COUNT_NARROW = 1700

// The slab the points resolve into: a 16:10 page, and the blocks on it.
// x, y, w, h, all as fractions of the page with the origin at its top left.
const PANELS = [
  [0.06, 0.07, 0.88, 0.07], // header bar
  [0.06, 0.22, 0.55, 0.34], // hero block
  [0.66, 0.22, 0.28, 0.34], // side block
  [0.06, 0.64, 0.26, 0.26], // card one
  [0.37, 0.64, 0.26, 0.26], // card two
  [0.68, 0.64, 0.26, 0.26], // card three
]

const SLAB_W = 3.3
const SLAB_H = SLAB_W * 0.625
const CUBE_HALF = 1.15

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value)
const smooth = (t) => t * t * (3 - 2 * t)

// Seeded, so the cloud is the same shape on every visit and every reload — a
// hero that re-scrambles itself between refreshes reads as a bug.
function makeRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function buildFormations(count) {
  const random = makeRandom(0x5f3759df)
  const core = new Float32Array(count * 3)
  const lattice = new Float32Array(count * 3)
  const slab = new Float32Array(count * 3)
  // Each point starts its move a little after its neighbour, so a change
  // sweeps through the cloud instead of shifting it as one block.
  const delays = new Float32Array(count)

  // --- Dust: a shell with real thickness, laid out on a Fibonacci spiral so
  // it stays evenly covered rather than bunching at the poles.
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2
    const ring = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    const radius = 1.3 + random() * 0.32
    core[i * 3] = Math.cos(theta) * ring * radius
    core[i * 3 + 1] = y * radius
    core[i * 3 + 2] = Math.sin(theta) * ring * radius
  }

  // --- Structure: the six faces of a cube, snapped to a grid. Hollow, not
  // filled — a solid block of points reads as mush from the outside.
  const snap = (value) => Math.round(value * 20) / 20
  for (let i = 0; i < count; i += 1) {
    const face = Math.floor(random() * 6)
    const u = snap(random() * 2 - 1) * CUBE_HALF
    const v = snap(random() * 2 - 1) * CUBE_HALF
    const axis = face >> 1
    const side = face % 2 === 0 ? CUBE_HALF : -CUBE_HALF
    const i3 = i * 3
    lattice[i3 + axis] = side
    lattice[i3 + ((axis + 1) % 3)] = u
    lattice[i3 + ((axis + 2) % 3)] = v
  }

  // --- The page: points land only inside the blocks, so the gutters between
  // them stay empty and the layout is the thing you actually read.
  const areas = PANELS.map(([, , w, h]) => w * h)
  const total = areas.reduce((sum, area) => sum + area, 0)
  for (let i = 0; i < count; i += 1) {
    let pick = random() * total
    let panel = PANELS[PANELS.length - 1]
    for (let p = 0; p < PANELS.length; p += 1) {
      if (pick < areas[p]) {
        panel = PANELS[p]
        break
      }
      pick -= areas[p]
    }

    const [panelX, panelY, panelW, panelH] = panel
    const x = panelX + Math.round(random() * panelW * 46) / 46
    const y = panelY + Math.round(random() * panelH * 30) / 30
    slab[i * 3] = (x - 0.5) * SLAB_W
    slab[i * 3 + 1] = (0.5 - y) * SLAB_H
    slab[i * 3 + 2] = (random() - 0.5) * 0.06

    delays[i] = random() * 0.4
  }

  return { core, delays, lattice, slab }
}

// Ink carries the cloud, the accent picks out a sixth of it and the ember a
// handful — the same ration the rest of the site runs on.
function buildColors(THREE, count) {
  const random = makeRandom(0x9e3779b9)
  const colors = new Float32Array(count * 3)
  const ink = new THREE.Color(0x16181d)
  const accent = new THREE.Color(0x1f4fd8)
  const ember = new THREE.Color(0xc2410c)

  for (let i = 0; i < count; i += 1) {
    const roll = random()
    const colour = roll > 0.965 ? ember : roll > 0.82 ? accent : ink
    colors[i * 3] = colour.r
    colors[i * 3 + 1] = colour.g
    colors[i * 3 + 2] = colour.b
  }

  return colors
}

function start(THREE, node, progress, pointer, onReady) {
  const canvas = document.createElement('canvas')
  canvas.className = 'forge-canvas'

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      canvas,
      powerPreference: 'low-power',
    })
  } catch {
    return null
  }

  // One renderer for the life of the page, and a pixel ratio that stops at 2:
  // a phone reporting 3 would otherwise shade two and a quarter times the
  // pixels for a difference nobody can see on points this small.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  node.appendChild(canvas)

  const count = window.matchMedia('(max-width: 850px)').matches
    ? COUNT_NARROW
    : COUNT_WIDE

  const { core, delays, lattice, slab } = buildFormations(count)
  const positions = new Float32Array(core)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(0, 0, 6)

  // The figure has to fit the frame at every shape and every viewport, so the
  // camera is pulled back to whichever of the two axes is tighter rather than
  // parked at a distance that only ever suited a wide desktop. A phone is
  // taller than it is wide, and at a fixed distance the cloud simply ran off
  // both sides of it.
  //
  // The half-extents are the envelope of the whole sequence, not of one frame:
  // the widest moment is the cube halfway through, whose corners reach further
  // than either the shell before it or the page after it.
  function frameCamera(p) {
    const settled = smooth(clamp01((p - 0.55) / 0.45))
    const halfWidth = 2 + (1.75 - 2) * settled
    const halfHeight = 2 + (1.15 - 2) * settled
    const half = Math.tan((camera.fov * Math.PI) / 360)

    // A phone is constrained by its width, so it gets the tighter margin —
    // otherwise the figure sits marooned in the middle of a tall empty stage.
    const margin = camera.aspect < 1 ? 1.04 : 1.12

    camera.position.z =
      Math.max(halfHeight / half, halfWidth / (half * camera.aspect)) * margin
  }

  const group = new THREE.Group()
  scene.add(group)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(buildColors(THREE, count), 3))

  const material = new THREE.PointsMaterial({
    size: 0.038,
    sizeAttenuation: true,
    vertexColors: true,
  })
  const points = new THREE.Points(geometry, material)
  group.add(points)

  // The cage the dust sits in at the top of the page, and the frame the page
  // gets at the bottom of it. One dissolves as the other draws.
  const cageSource = new THREE.IcosahedronGeometry(1.62, 1)
  const cageGeometry = new THREE.EdgesGeometry(cageSource)
  const cageMaterial = new THREE.LineBasicMaterial({
    color: 0x16181d,
    opacity: 0.3,
    transparent: true,
  })
  const cage = new THREE.LineSegments(cageGeometry, cageMaterial)
  group.add(cage)

  const frameW = SLAB_W / 2 + 0.05
  const frameH = SLAB_H / 2 + 0.05
  const frameGeometry = new THREE.BufferGeometry()
  frameGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      new Float32Array([
        -frameW, -frameH, 0, frameW, -frameH, 0,
        frameW, -frameH, 0, frameW, frameH, 0,
        frameW, frameH, 0, -frameW, frameH, 0,
        -frameW, frameH, 0, -frameW, -frameH, 0,
      ]),
      3,
    ),
  )
  const frameMaterial = new THREE.LineBasicMaterial({
    color: 0x1f4fd8,
    opacity: 0,
    transparent: true,
  })
  const frame = new THREE.LineSegments(frameGeometry, frameMaterial)
  frame.visible = false
  group.add(frame)

  const attribute = geometry.attributes.position

  function writePositions(p) {
    const second = p >= 0.5
    const local = second ? (p - 0.5) / 0.5 : p / 0.5
    const from = second ? lattice : core
    const to = second ? slab : lattice

    for (let i = 0; i < count; i += 1) {
      const delay = delays[i]
      const raw = (local - delay) / (1 - delay)
      const t = raw <= 0 ? 0 : raw >= 1 ? 1 : smooth(raw)
      const i3 = i * 3
      positions[i3] = from[i3] + (to[i3] - from[i3]) * t
      positions[i3 + 1] = from[i3 + 1] + (to[i3 + 1] - from[i3 + 1]) * t
      positions[i3 + 2] = from[i3 + 2] + (to[i3 + 2] - from[i3 + 2]) * t
    }

    attribute.needsUpdate = true
  }

  // The scroll writes a raw target and the loop chases it. That lag is what
  // gives the forge weight, and it costs one lerp a frame rather than a
  // scrubbed tween per property. Declared up here because resize() reads the
  // progress the scene is currently showing, and it runs before the loop does.
  let shown = -1
  let spin = 0
  let driftX = 0
  let driftY = 0
  let last = performance.now()
  let painted = false

  function resize() {
    const { clientHeight, clientWidth } = node
    if (clientWidth === 0 || clientHeight === 0) {
      return
    }

    camera.aspect = clientWidth / clientHeight
    frameCamera(shown < 0 ? 0 : shown)
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight, false)
  }

  const sizeObserver =
    typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
  if (sizeObserver) {
    sizeObserver.observe(node)
  } else {
    window.addEventListener('resize', resize, { passive: true })
  }
  resize()

  function tick(now) {
    const delta = Math.min((now - last) / 1000, 0.05)
    last = now

    const target = clamp01(progress.current)
    const p = shown < 0 ? target : shown + (target - shown) * Math.min(delta * 7, 1)

    if (shown < 0 || Math.abs(p - shown) > 0.0004) {
      writePositions(p)
    }
    shown = p

    const faced = smooth(clamp01((p - 0.58) / 0.42))
    spin += delta * 0.17 * (1 - faced)

    driftX += (pointer.current.x - driftX) * Math.min(delta * 4, 1)
    driftY += (pointer.current.y - driftY) * Math.min(delta * 4, 1)

    group.rotation.y = spin * (1 - faced) + driftX * 0.3 * (1 - faced * 0.65)
    group.rotation.x = -0.14 * (1 - faced) + driftY * 0.22 * (1 - faced * 0.65)
    frameCamera(p)

    const cageFade = 0.3 * (1 - smooth(clamp01(p / 0.42)))
    cage.visible = cageFade > 0.005
    cageMaterial.opacity = cageFade

    const frameFade = 0.55 * smooth(clamp01((p - 0.74) / 0.26))
    frame.visible = frameFade > 0.005
    frameMaterial.opacity = frameFade

    renderer.render(scene, camera)

    if (!painted) {
      painted = true
      onReady()
    }
  }

  // A canvas nobody is looking at should not be shading pixels: the loop stops
  // when the hero scrolls away and when the tab goes to the background.
  let onScreen = true
  let running = false

  function run() {
    if (running || !onScreen || document.hidden) {
      return
    }

    running = true
    last = performance.now()
    renderer.setAnimationLoop(tick)
  }

  function halt() {
    running = false
    renderer.setAnimationLoop(null)
  }

  const visibility =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          (entries) => {
            onScreen = entries.some((entry) => entry.isIntersecting)
            if (onScreen) {
              run()
            } else {
              halt()
            }
          },
          { threshold: 0 },
        )
  visibility?.observe(node)

  const onVisibility = () => (document.hidden ? halt() : run())
  document.addEventListener('visibilitychange', onVisibility)
  run()

  return () => {
    halt()
    document.removeEventListener('visibilitychange', onVisibility)
    visibility?.disconnect()
    sizeObserver?.disconnect()
    if (!sizeObserver) {
      window.removeEventListener('resize', resize)
    }

    // three never hands GPU memory back on its own: every geometry and every
    // material here has to be released by name or it stays in VRAM.
    points.geometry.dispose()
    material.dispose()
    cageSource.dispose()
    cageGeometry.dispose()
    cageMaterial.dispose()
    frameGeometry.dispose()
    frameMaterial.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
}

// `progress` is a ref the page writes the scroll into, never state: the scene
// must not re-render React to move.
export default function ForgeCanvas({ progress }) {
  const holder = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const node = holder.current
    if (!node || prefersReducedMotion()) {
      return undefined
    }

    let dropped = false
    let stop = null

    const load = () => {
      import('three')
        .then((THREE) => {
          if (dropped) {
            return
          }

          stop = start(THREE, node, progress, pointer, () => setStatus('ready'))
          if (!stop) {
            setStatus('unsupported')
          }
        })
        .catch(() => {
          if (!dropped) {
            setStatus('unsupported')
          }
        })
    }

    // The stage already has a figure in it from the stylesheet, so the renderer
    // waits for a gap rather than racing the fonts for the first paint on a
    // phone. The timeout keeps that gap short on a busy main thread.
    const idle =
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback(load, { timeout: 500 })
        : setTimeout(load, 120)

    return () => {
      dropped = true
      if (typeof cancelIdleCallback === 'function') {
        cancelIdleCallback(idle)
      } else {
        clearTimeout(idle)
      }
      stop?.()
    }
  }, [progress])

  // Pointer parallax is read here and applied in the render loop, so moving
  // the mouse never touches React or the layout.
  useEffect(() => {
    const node = holder.current
    if (!node || typeof window === 'undefined') {
      return undefined
    }

    if (!window.matchMedia('(hover: hover)').matches) {
      return undefined
    }

    const onMove = (event) => {
      const box = node.getBoundingClientRect()
      pointer.current.x = ((event.clientX - box.left) / box.width) * 2 - 1
      pointer.current.y = ((event.clientY - box.top) / box.height) * 2 - 1
    }

    const onLeave = () => {
      pointer.current.x = 0
      pointer.current.y = 0
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div className="forge" data-status={status} ref={holder} aria-hidden="true" />
}
