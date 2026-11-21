import { useEffect, useMemo, useRef, type RefObject, type ComponentRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Line } from "@react-three/drei";
import {
  MathUtils,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type PerspectiveCamera,
} from "three";
import type { MotionValue } from "framer-motion";
import { ORDER, type SkillId } from "./skillOrbData";

// Which areas work together; selecting one brightens its partners
const LINKS: [SkillId, SkillId][] = [
  ["web", "api"],
  ["mobile", "api"],
  ["api", "orch"],
  ["api", "ret"],
  ["orch", "ml"],
  ["ret", "data"],
];

const SHELL = 2.35;
const ORANGE = "#ff6a28";
const POS: Record<SkillId, Vector3> = Object.fromEntries(
  ORDER.map((id, i) => {
    const y = 1 - ((i + 0.5) * 2) / ORDER.length;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    return [id, new Vector3(Math.sin(th) * r * SHELL, y * SHELL * 0.8, Math.cos(th) * r * SHELL)];
  }),
) as Record<SkillId, Vector3>;

/* Scales the whole orbit to the canvas size, reserving room for the
   label cards so they never leave the canvas. */
function CameraFit({ isMobile }: { isMobile: boolean }) {
  const { size, camera } = useThree();
  useEffect(() => {
    if (!size.width || !size.height) return;
    if (isMobile) {
      const pxPerUnit = Math.max(size.width / (SHELL * 2.0), 28);
      const worldH = size.height / pxPerUnit;
      const fov = (camera as PerspectiveCamera).fov;
      camera.position.z = Math.max(worldH / 2 / Math.tan(MathUtils.degToRad(fov / 2)), 6.4);
      camera.position.y = 0.3;
      camera.updateProjectionMatrix();
      return;
    }
    camera.position.y = 0;
    const labelHalf = size.width < 480 ? 70 : 88; // half the widest label card, px
    const byWidth = (size.width / 2 - labelHalf - 4) / (SHELL * 0.98);
    const byHeight = (size.height / 2 - 8) / (SHELL * 0.88);
    const pxPerUnit = Math.max(Math.min(byWidth, byHeight), 24);
    const worldH = size.height / pxPerUnit;
    const fov = (camera as PerspectiveCamera).fov;
    camera.position.z = worldH / 2 / Math.tan(MathUtils.degToRad(fov / 2));
    camera.updateProjectionMatrix();
  }, [size.width, size.height, camera, isMobile]);
  return null;
}

/* ---------- Original core: particle sphere, wireframe, distorting sphere ---------- */
function Core({
  glow,
  compact,
}: {
  glow: RefObject<ComponentRef<typeof MeshDistortMaterial> | null>;
  compact: boolean;
}) {
  const count = compact ? 900 : 1800;
  const pts = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const th = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = 2.15 + (i % 7) * 0.015;
      a.set(
        [r * Math.cos(th) * Math.sin(phi), r * Math.sin(th) * Math.sin(phi), r * Math.cos(phi)],
        i * 3,
      );
    }
    return a;
  }, [count]);

  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pts, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.024}
          color="#ff8a4c"
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
      <mesh>
        <icosahedronGeometry args={[1.55, 2]} />
        <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.1} />
      </mesh>
      <Float speed={2} floatIntensity={0.4}>
        <mesh>
          <sphereGeometry args={[1.05, compact ? 32 : 56, compact ? 24 : 40]} />
          <MeshDistortMaterial
            ref={glow}
            color="#d9622b"
            emissive="#ff5a1f"
            emissiveIntensity={0.7}
            roughness={0.15}
            metalness={0.4}
            distort={0.4}
            speed={2.2}
          />
        </mesh>
      </Float>
    </>
  );
}

/* ---------- One skill node: dot, wire to the core, travelling pulse, label ---------- */
interface NodeProps {
  id: SkillId;
  st: "sel" | "rel" | "dim";
  pick: (id: SkillId) => void;
  hover: (id: SkillId | null) => void;
  labels: RefObject<Partial<Record<SkillId, HTMLDivElement>>>;
}

function Node({ id, st, pick, hover, labels }: NodeProps) {
  const pos = POS[id];
  const dot = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const pulse = useRef<Mesh>(null);
  const v = useMemo(() => new Vector3(), []);
  const projected = useMemo(() => new Vector3(), []);
  const wire = useMemo(() => [pos.clone(), pos.clone().multiplyScalar(0.12)], [pos]);
  const sel = st === "sel";

  useFrame((s, dt) => {
    if (!dot.current || !halo.current || !pulse.current) return;
    const k = 1 - Math.exp(-dt * 8);
    const target = sel ? 2 : st === "rel" ? 1.3 : 1;
    const sc = dot.current.scale.x + (target - dot.current.scale.x) * k;
    dot.current.scale.setScalar(sc);

    const haloMat = halo.current.material as MeshBasicMaterial;
    if (haloMat) {
      haloMat.opacity += ((sel ? 0.3 : 0) - haloMat.opacity) * k;
    }
    halo.current.scale.setScalar(sel ? 1 + Math.sin(s.clock.elapsedTime * 3) * 0.12 : 1);

    const label = labels.current[id];
    if (label) {
      dot.current.getWorldPosition(v);
      const projection = projected.copy(v);
      projection.y += 0.35;
      projection.project(s.camera);

      const facing = MathUtils.clamp((v.z + 1.3) / 0.6, 0, 1);
      const inFrame = Math.abs(projection.x) <= 1.03 && Math.abs(projection.y) <= 1.03;
      label.style.visibility = inFrame && facing > 0.35 ? "visible" : "hidden";
      label.style.opacity = String(facing);
      label.style.transform = `translate3d(${((projection.x + 1) * s.size.width) / 2}px, ${((1 - projection.y) * s.size.height) / 2}px, 0) translate(-50%, -50%)`;
    }

    // Data pulse flowing from the node into the core
    const t = (s.clock.elapsedTime * 0.35 + ORDER.indexOf(id) * 0.13) % 1;
    pulse.current.position.copy(pos).multiplyScalar(1 - t * 0.86);
  });

  return (
    <>
      <Line
        points={wire}
        color={sel ? ORANGE : "#6b665c"}
        lineWidth={sel ? 1.8 : 1}
        transparent
        opacity={sel ? 0.95 : 0.4}
      />
      <mesh ref={pulse}>
        <sphereGeometry args={[sel ? 0.07 : 0.048, 12, 12]} />
        <meshBasicMaterial color={sel ? "#ffb48a" : "#9b968b"} />
      </mesh>
      <group position={pos}>
        <mesh
          ref={dot}
          onClick={(e) => {
            e.stopPropagation();
            pick(id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            hover(id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            hover(null);
            document.body.style.cursor = "";
          }}
        >
          <sphereGeometry args={[0.115, 20, 20]} />
          <meshBasicMaterial color={sel ? ORANGE : "#ffd2b4"} />
        </mesh>
        <mesh ref={halo}>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

interface SceneProps {
  sel: SkillId;
  active: SkillId;
  pick: (id: SkillId) => void;
  hover: (id: SkillId | null) => void;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  isMobile: boolean;
  labels: NodeProps["labels"];
}

function Scene({ sel, active, pick, hover, mx, my, isMobile, labels }: SceneProps) {
  const root = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const shell = useRef<Group>(null);
  const glow = useRef<ComponentRef<typeof MeshDistortMaterial>>(null);
  const bump = useRef(0);

  useEffect(() => {
    bump.current = 1;
  }, [active]);

  useFrame((s, dt) => {
    if (!root.current || !inner.current || !shell.current) return;
    const mxVal = typeof mx?.get === "function" ? mx.get() : 0.5;
    const myVal = typeof my?.get === "function" ? my.get() : 0.5;

    // Cursor reaction across the whole hero, as in the original orb
    const tx = (myVal - 0.5) * 0.6;
    const ox = (mxVal - 0.5) * 0.5;
    const oy = -(myVal - 0.5) * 0.3;
    root.current.rotation.x += (tx - root.current.rotation.x) * 0.05;
    root.current.position.x += (ox - root.current.position.x) * 0.05;
    root.current.position.y += (oy - root.current.position.y) * 0.05;

    // Core keeps spinning like the original
    inner.current.rotation.y += dt * 0.12;

    // Orbit: bring the selected node to the front by the shortest turn
    const p = POS[sel];
    if (p) {
      const target = -Math.atan2(p.x, p.z) + (mxVal - 0.5) * 0.4;
      const diff =
        ((((target - shell.current.rotation.y + Math.PI) % (Math.PI * 2)) + Math.PI * 2) %
          (Math.PI * 2)) -
        Math.PI;
      shell.current.rotation.y += diff * (1 - Math.exp(-dt * 2.2));
      shell.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.3) * 0.03;
    }

    // Core pulses when the selection changes
    bump.current *= 0.95;
    const dist = Math.hypot(mxVal - 0.5, myVal - 0.5);
    if (glow.current) {
      glow.current.distort = MathUtils.lerp(
        glow.current.distort,
        0.35 + dist * 0.3 + bump.current * 0.3,
        0.08,
      );
    }
  });

  const linked = (id: SkillId) =>
    active === "infra" ||
    LINKS.some(([a, b]) => (a === active && b === id) || (b === active && a === id));
  const stOf = (id: SkillId): "sel" | "rel" | "dim" =>
    id === active ? "sel" : linked(id) ? "rel" : "dim";

  return (
    <group ref={root}>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#ffb48a" />
      <group ref={inner} scale={0.92}>
        <Core glow={glow} compact={isMobile} />
      </group>
      <group ref={shell}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[SHELL, 0.006, 6, isMobile ? 64 : 120]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
        <mesh rotation={[1.15, 0.5, 0]}>
          <torusGeometry args={[SHELL, 0.006, 6, isMobile ? 64 : 120]} />
          <meshBasicMaterial color="#ff8a4c" transparent opacity={0.16} />
        </mesh>
        {ORDER.map((id) => (
          <Node key={id} id={id} st={stOf(id)} pick={pick} hover={hover} labels={labels} />
        ))}
      </group>
    </group>
  );
}

function Monitor({
  compact,
  onReady,
  onFailure,
}: {
  compact: boolean;
  onReady: () => void;
  onFailure: () => void;
}) {
  const { gl } = useThree();
  const frames = useRef(0);
  const elapsed = useRef(0);
  const slowWindows = useRef(0);
  const ready = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onFailure);
    return () => canvas.removeEventListener("webglcontextlost", onFailure);
  }, [gl, onFailure]);

  useFrame((_state, delta) => {
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
    if (!compact) return;
    if (delta > 0.25) {
      frames.current = 0;
      elapsed.current = 0;
      slowWindows.current = 0;
      return;
    }
    frames.current++;
    elapsed.current += delta;
    if (elapsed.current < 1.5) return;

    slowWindows.current = frames.current / elapsed.current < 24 ? slowWindows.current + 1 : 0;
    frames.current = 0;
    elapsed.current = 0;
    if (slowWindows.current >= 2) onFailure();
  });

  return null;
}

export default function SkillOrbScene({
  running,
  onReady,
  onFailure,
  ...scene
}: SceneProps & {
  running: boolean;
  onReady: () => void;
  onFailure: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.2], fov: 44 }}
      dpr={scene.isMobile ? [1, 1.25] : [1, 1.75]}
      frameloop={running ? "always" : "never"}
      resize={{ offsetSize: true, scroll: false }}
      style={{
        width: "100%",
        height: "100%",
        overflow: scene.isMobile ? "hidden" : "visible",
        touchAction: "pan-y",
      }}
    >
      <CameraFit isMobile={scene.isMobile} />
      <Scene {...scene} />
      <Monitor compact={scene.isMobile} onReady={onReady} onFailure={onFailure} />
    </Canvas>
  );
}
