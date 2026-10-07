import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Line, Html } from "@react-three/drei";
import { MathUtils, Vector3, type Group, type Mesh, type PerspectiveCamera } from "three";
import {
  motion,
  useReducedMotion,
  type MotionValue,
  type Transition,
} from "framer-motion";
import { useIsMobile } from "../../../hooks/use-mobile";

/* =====================================================================
   SkillOrb: Animated neural core (particles, wireframe, distorting sphere)
   with skills orbiting it as clickable interactive nodes.
   Every node is wired to the core; data pulses flow in along the wires.
   Selected nodes rotate to the front. An auto tour runs until paused or clicked.
   ===================================================================== */

const ease = [0.16, 1, 0.3, 1] as const;
const ORANGE = "#ff6a28";

export interface SkillNodeData {
  cat: string;
  label: string;
  sub: string;
  text: string;
  chips: string[];
  used: string;
}

// Top to bottom on the orb: intelligence up top, delivery at the base
export const ORDER = [
  "orch",
  "web",
  "ret",
  "api",
  "mobile",
  "data",
  "ml",
  "infra",
] as const;

export type SkillId = (typeof ORDER)[number];

export const DATA: Record<SkillId, SkillNodeData> = {
  orch: {
    cat: "Intelligence",
    label: "LLM orchestration",
    sub: "LangChain, LangGraph",
    text: "I design agent workflows and structured prompts that keep model output accurate, consistent and on brief.",
    chips: ["LangChain", "LangGraph", "LLM APIs", "Prompt engineering"],
    used: "Interview Analyzer, retail AI features",
  },
  web: {
    cat: "Interfaces",
    label: "Web apps",
    sub: "React, TypeScript",
    text: "I build React and TypeScript dashboards, workflows and AI features that enterprise retail teams use every day.",
    chips: ["React", "TypeScript", "REST integration"],
    used: "Retail SaaS platform, Interview Analyzer",
  },
  ret: {
    cat: "Intelligence",
    label: "Retrieval (RAG)",
    sub: "Embeddings, vector search",
    text: "I turn company documents into searchable knowledge, so answers come with context and sources instead of guesses.",
    chips: ["Embeddings", "ChromaDB", "Semantic search"],
    used: "Retail SaaS platform, AI Document Assistant",
  },
  api: {
    cat: "Services",
    label: "Backend services",
    sub: "FastAPI, REST",
    text: "I build FastAPI services that run core retail workflows: business logic, integrations, database operations and secure flows.",
    chips: ["FastAPI", "REST APIs", "Python"],
    used: "Retail SaaS platform, all AI projects",
  },
  mobile: {
    cat: "Interfaces",
    label: "Mobile apps",
    sub: "Flutter, Firebase",
    text: "I shipped a production Flutter app with reusable widgets, structured state management, sign-in and push messaging.",
    chips: ["Flutter", "Firebase Auth", "Firestore", "Cloud Messaging"],
    used: "BlastOut internship, retail SaaS platform",
  },
  data: {
    cat: "Data and models",
    label: "Data stores",
    sub: "MySQL, Firestore",
    text: "I pick the right store for each job: relational tables, document data and vector indexes behind one application.",
    chips: ["MySQL", "Firestore", "ChromaDB"],
    used: "BlastOut projects",
  },
  ml: {
    cat: "Data and models",
    label: "Machine learning",
    sub: "TensorFlow, Swin",
    text: "I trained a Swin Transformer U-Net for diabetic retinopathy segmentation and measured it with IoU and Dice score.",
    chips: ["TensorFlow", "Swin Transformer", "U-Net"],
    used: "Research project, 2025",
  },
  infra: {
    cat: "Delivery",
    label: "Delivery and quality",
    sub: "Docker, GCP, Playwright",
    text: "I ship containerized services and protect every release with automated end-to-end tests.",
    chips: ["Docker", "GCP", "CI/CD", "Playwright", "Git"],
    used: "BlastOut internship and full-time work",
  },
};

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
const POS: Record<SkillId, Vector3> = Object.fromEntries(
  ORDER.map((id, i) => {
    const y = 1 - ((i + 0.5) * 2) / ORDER.length;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    return [
      id,
      new Vector3(
        Math.sin(th) * r * SHELL,
        y * SHELL * 0.8,
        Math.cos(th) * r * SHELL
      ),
    ];
  })
) as Record<SkillId, Vector3>;

/* Scales the whole orbit to the canvas size, reserving room for the
   label cards so they never leave the canvas. */
function CameraFit({ isMobile }: { isMobile?: boolean }) {
  const { size, camera } = useThree();
  useEffect(() => {
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
function Core({ glow }: { glow: React.MutableRefObject<any> }) {
  const N = 2400;
  const pts = useMemo(() => {
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const th = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = 2.15 + (i % 7) * 0.015;
      a.set(
        [
          r * Math.cos(th) * Math.sin(phi),
          r * Math.sin(th) * Math.sin(phi),
          r * Math.cos(phi),
        ],
        i * 3
      );
    }
    return a;
  }, [N]);

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
        <meshBasicMaterial
          wireframe
          color="#ffffff"
          transparent
          opacity={0.1}
        />
      </mesh>
      <Float speed={2} floatIntensity={0.4}>
        <mesh>
          <sphereGeometry args={[1.05, 96, 96]} />
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
  idx: number;
  st: "sel" | "rel" | "dim";
  pick: (id: SkillId) => void;
  hover: (id: SkillId | null) => void;
  reduce?: boolean | null | undefined;
  isMobile?: boolean | undefined;
}

function Node({ id, idx, st, pick, hover, reduce, isMobile }: NodeProps) {
  const d = DATA[id];
  const pos = POS[id];
  const dot = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const pulse = useRef<Mesh>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const v = useMemo(() => new Vector3(), []);
  const wire = useMemo(
    () => [pos.clone(), pos.clone().multiplyScalar(0.12)],
    [pos]
  );
  const sel = st === "sel";

  useFrame((s, dt) => {
    if (!dot.current || !halo.current || !pulse.current) return;
    const k = 1 - Math.exp(-dt * 8);
    const target = sel ? 2 : st === "rel" ? 1.3 : 1;
    const sc = dot.current.scale.x + (target - dot.current.scale.x) * k;
    dot.current.scale.setScalar(sc);

    const haloMat = halo.current.material as any;
    if (haloMat) {
      haloMat.opacity += ((sel ? 0.3 : 0) - haloMat.opacity) * k;
    }
    halo.current.scale.setScalar(
      sel ? 1 + Math.sin(s.clock.elapsedTime * 3) * 0.12 : 1
    );

    if (!isMobile) {
      // Visibility: card is visible inside viewport; only hidden when out of viewport or swung behind the orb
      dot.current.getWorldPosition(v);
      const proj = v.clone();
      proj.y += 0.35;
      proj.project(s.camera);

      const isOutOfViewport =
        proj.x < -1.35 || proj.x > 1.35 || proj.y < -1.35 || proj.y > 1.35;

      // When swinging behind the orb (v.z < -0.7), smoothly fade out so it doesn't clip through the central core
      const rearFade = MathUtils.clamp((v.z + 1.3) / 0.6, 0, 1);

      if (btn.current) {
        if (isOutOfViewport) {
          btn.current.style.opacity = "0";
          btn.current.style.pointerEvents = "none";
        } else if (v.z < -0.7) {
          btn.current.style.opacity = String(rearFade);
          btn.current.style.pointerEvents = rearFade > 0.4 ? "auto" : "none";
        } else {
          btn.current.style.opacity = "1";
          btn.current.style.pointerEvents = "auto";
        }
      }
    }

    // Data pulse flowing from the node into the core
    const t = reduce ? 0.5 : (s.clock.elapsedTime * 0.35 + idx * 0.13) % 1;
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
          <meshBasicMaterial
            color={ORANGE}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        {!isMobile && (
          <Html position={[0, 0.35, 0]} center zIndexRange={[100, 10]}>
            <button
              ref={btn}
              type="button"
              className={"so-tag" + (sel ? " on" : "")}
              aria-pressed={sel}
              onClick={() => pick(id)}
              onMouseEnter={() => hover(id)}
              onMouseLeave={() => hover(null)}
              onFocus={() => hover(id)}
              onBlur={() => hover(null)}
            >
              <b>{d.label}</b>
              <i>{d.sub}</i>
            </button>
          </Html>
        )}
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
  reduce?: boolean | null | undefined;
  isMobile?: boolean;
}

function Scene({ sel, active, pick, hover, mx, my, reduce, isMobile }: SceneProps) {
  const root = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const shell = useRef<Group>(null);
  const glow = useRef<any>(null);
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
    if (!reduce) inner.current.rotation.y += dt * 0.12;

    // Orbit: bring the selected node to the front by the shortest turn
    const p = POS[sel];
    if (p) {
      const target = -Math.atan2(p.x, p.z) + (mxVal - 0.5) * 0.4;
      let diff =
        (((target - shell.current.rotation.y + Math.PI) % (Math.PI * 2) +
          Math.PI * 2) %
          (Math.PI * 2)) -
        Math.PI;
      shell.current.rotation.y += diff * (1 - Math.exp(-dt * 2.2));
      if (!reduce) {
        shell.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.3) * 0.03;
      }
    }

    // Core pulses when the selection changes
    bump.current *= 0.95;
    const dist = Math.hypot(mxVal - 0.5, myVal - 0.5);
    if (glow.current) {
      glow.current.distort = MathUtils.lerp(
        glow.current.distort,
        0.35 + dist * 0.3 + bump.current * 0.3,
        0.08
      );
    }
  });

  const linked = (id: SkillId) =>
    active === "infra" ||
    LINKS.some(
      ([a, b]) => (a === active && b === id) || (b === active && a === id)
    );
  const stOf = (id: SkillId): "sel" | "rel" | "dim" =>
    id === active ? "sel" : linked(id) ? "rel" : "dim";

  return (
    <group ref={root}>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#ffb48a" />
      <group ref={inner} scale={0.92}>
        <Core glow={glow} />
      </group>
      <group ref={shell}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[SHELL, 0.006, 8, 160]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
        <mesh rotation={[1.15, 0.5, 0]}>
          <torusGeometry args={[SHELL, 0.006, 8, 160]} />
          <meshBasicMaterial color="#ff8a4c" transparent opacity={0.16} />
        </mesh>
        {ORDER.map((id, i) => (
          <Node
            key={id}
            id={id}
            idx={i}
            st={stOf(id)}
            pick={pick}
            hover={hover}
            reduce={reduce}
            isMobile={isMobile}
          />
        ))}
      </group>
    </group>
  );
}

export interface SkillOrbProps {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  lift?: MotionValue<number>;
  fade?: MotionValue<number>;
}

export function SkillOrb({ mx, my, lift, fade }: SkillOrbProps) {
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const [sel, setSel] = useState<SkillId>("orch");
  const [hov, setHov] = useState<SkillId | null>(null);
  const [tour, setTour] = useState(!reduce);

  useEffect(() => {
    if (!tour || hov) return;
    const t = setInterval(
      () =>
        setSel((s) => {
          const nextIdx = (ORDER.indexOf(s) + 1) % ORDER.length;
          return ORDER[nextIdx] ?? "orch";
        }),
      4200
    );
    return () => clearInterval(t);
  }, [tour, hov]);

  const active = hov || sel;
  const pick = (id: SkillId) => {
    setSel(id);
    setTour(false);
  };
  const motionStyle = useMemo(() => {
    const s: Record<string, any> = {};
    if (lift !== undefined) s["y"] = lift;
    if (fade !== undefined) s["opacity"] = fade;
    return s;
  }, [lift, fade]);

  if (isMobile) {
    return (
      <motion.div className="so-mobile-wrapper" style={motionStyle}>
        {/* Expanded 3D Playground with integrated subtle domain dock */}
        <div className="so-mobile-playground">
          <div className="so-mobile-canvas-inner">
            <Canvas
              camera={{ position: [0, 0.3, 7.2], fov: 46 }}
              dpr={[1, 2]}
              style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
            >
              <CameraFit isMobile={true} />
              <Scene
                sel={sel}
                active={active}
                pick={pick}
                hover={setHov}
                mx={mx}
                my={my}
                reduce={reduce}
                isMobile={true}
              />
            </Canvas>
          </div>

          {/* Subtle Top Domain Indicator & Tour Controls */}
          <div className="so-mobile-top-bar">
            <div className="so-mobile-domain-badge">
              <span className="so-mobile-badge-dot" />
              <span>{DATA[active].cat}</span>
            </div>
            <button
              type="button"
              className={`so-tour ${tour ? "active" : ""}`}
              onClick={() => setTour(!tour)}
              aria-label={tour ? "Pause tour" : "Resume tour"}
            >
              <span className="so-tour-dot" />
              <span>{tour ? "Tour" : "Pause"}</span>
            </button>
          </div>

          {/* Neat Floating Capability Container inside Playground */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease }}
            className="so-mobile-dock"
          >
            <div className="so-dock-content">
              <div className="so-dock-header">
                <span className="so-dock-cat">{DATA[active].cat}</span>
                <span className="so-dock-counter">
                  0{ORDER.indexOf(active) + 1} / 0{ORDER.length}
                </span>
              </div>
              <div className="so-dock-title-row">
                <h3 className="so-dock-title">{DATA[active].label}</h3>
                <span className="so-dock-sub">{DATA[active].sub}</span>
              </div>
            </div>

            {/* Subtle Interactive Selector Dots inside the Container */}
            <div className="so-dock-dots" role="tablist" aria-label="Skills">
              {ORDER.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={id === active}
                  aria-label={DATA[id].label}
                  className={`so-dock-dot ${id === active ? "on" : ""}`}
                  onClick={() => pick(id)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="so-wrap" style={motionStyle}>
      <motion.div
        className="so-canvas"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease } as Transition}
      >
        <Canvas
          camera={{ position: [0, 0, 8.2], fov: 44 }}
          dpr={[1, 2]}
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <CameraFit isMobile={false} />
          <Scene
            sel={sel}
            active={active}
            pick={pick}
            hover={setHov}
            mx={mx}
            my={my}
            reduce={reduce}
            isMobile={false}
          />
        </Canvas>
      </motion.div>
    </motion.div>
  );
}

export default SkillOrb;
