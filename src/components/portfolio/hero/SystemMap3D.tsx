import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Edges, Line, Html } from "@react-three/drei";
import { CubicBezierCurve3, Vector3, MeshStandardMaterial, type Group, type Mesh } from "three";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type MotionValue,
  type Transition,
} from "framer-motion";

export interface NodeItem {
  id: string;
  p: [number, number];
  size: [number, number, number];
  label: string;
  sub: string;
  title: string;
  text: string;
  chips: string[];
  used: string;
  stack?: boolean;
}

export interface InfraItem {
  id: string;
  label: string;
  sub: string;
  title: string;
  text: string;
  chips: string[];
  used: string;
}

const NODES: NodeItem[] = [
  {
    id: "web",
    p: [-4.3, -1.1],
    size: [1.7, 0.9, 0.5],
    label: "Web apps",
    sub: "React, TypeScript",
    title: "Web interfaces",
    text: "I build React and TypeScript dashboards, workflows and AI features that enterprise retail teams use every day.",
    chips: ["React", "TypeScript", "REST integration"],
    used: "Retail SaaS platform, Interview Analyzer",
  },
  {
    id: "mobile",
    p: [-4.3, 1.1],
    size: [0.85, 1.3, 0.5],
    label: "Mobile apps",
    sub: "Flutter, Firebase",
    title: "Mobile apps",
    text: "I shipped a production Flutter app with reusable widgets, structured state management, sign-in and push messaging.",
    chips: ["Flutter", "Firebase Auth", "Firestore", "Cloud Messaging"],
    used: "BlastOut internship, retail SaaS platform",
  },
  {
    id: "api",
    p: [-1.45, 0],
    size: [1.5, 0.8, 1.5],
    label: "Backend services",
    sub: "FastAPI, REST",
    title: "Backend services",
    text: "I build FastAPI services that run core retail workflows: business logic, integrations, database operations and secure flows.",
    chips: ["FastAPI", "REST APIs", "Python"],
    used: "Retail SaaS platform, all AI projects",
  },
  {
    id: "orch",
    p: [1.45, -1.1],
    size: [1.5, 1.0, 1.2],
    label: "LLM orchestration",
    sub: "LangChain, LangGraph",
    title: "LLM orchestration",
    text: "I design agent workflows and structured prompts that keep model output accurate, consistent and on brief.",
    chips: ["LangChain", "LangGraph", "LLM APIs", "Prompt engineering"],
    used: "Interview Analyzer, retail AI features",
  },
  {
    id: "ret",
    p: [1.45, 1.1],
    size: [1.4, 0.7, 1.4],
    label: "Retrieval (RAG)",
    sub: "Embeddings, vector search",
    title: "Retrieval (RAG)",
    text: "I turn company documents into searchable knowledge, so answers come with context and sources instead of guesses.",
    chips: ["Embeddings", "ChromaDB", "Semantic search"],
    used: "Retail SaaS platform, AI Document Assistant",
  },
  {
    id: "ml",
    p: [4.3, -1.1],
    size: [1.4, 0.9, 1.1],
    label: "Machine learning",
    sub: "TensorFlow, Swin",
    title: "Machine learning",
    text: "I trained a Swin Transformer U-Net for diabetic retinopathy segmentation and measured it with IoU and Dice score.",
    chips: ["TensorFlow", "Swin Transformer", "U-Net"],
    used: "Research project, 2025",
  },
  {
    id: "data",
    p: [4.3, 1.1],
    size: [1.3, 0.86, 1.1],
    label: "Data stores",
    sub: "MySQL, Firestore",
    stack: true,
    title: "Data stores",
    text: "I pick the right store for each job: relational tables, document data and vector indexes behind one application.",
    chips: ["MySQL", "Firestore", "ChromaDB"],
    used: "BlastOut projects",
  },
];

const INFRA: InfraItem = {
  id: "infra",
  label: "Delivery & quality",
  sub: "Docker, GCP, CI/CD, Playwright, Git",
  title: "Delivery and quality",
  text: "I ship containerized services and protect every release with automated end-to-end tests.",
  chips: ["Docker", "GCP", "CI/CD", "Playwright", "Git"],
  used: "BlastOut internship and full-time work",
};

const BY_ID: Record<string, NodeItem | InfraItem> = Object.fromEntries(
  [...NODES, INFRA].map((n) => [n.id, n])
);

const EDGES: [string, string][] = [
  ["web", "api"],
  ["mobile", "api"],
  ["api", "orch"],
  ["api", "ret"],
  ["orch", "ml"],
  ["ret", "data"],
];

const ORDER = ["web", "mobile", "api", "orch", "ret", "data", "ml", "infra"];

const baseY = (n: NodeItem) => n.size[1] / 2 + 0.02;
const ORANGE = "#ff6a28";
const SOFT = "#ff8a4c";
const ease = [0.16, 1, 0.3, 1] as const;

function curveFor(a: string, b: string) {
  const A = BY_ID[a] as NodeItem;
  const B = BY_ID[b] as NodeItem;
  const s = new Vector3(A.p[0] + A.size[0] / 2, A.size[1] * 0.6, A.p[1]);
  const e = new Vector3(B.p[0] - B.size[0] / 2, B.size[1] * 0.6, B.p[1]);
  const c1 = new Vector3(s.x + 1.1, s.y + 0.9, s.z);
  const c2 = new Vector3(e.x - 1.1, e.y + 0.9, e.z);
  return new CubicBezierCurve3(s, c1, c2, e);
}

function Packet({
  curve,
  speed,
  offset,
  on,
  reduce,
}: {
  curve: CubicBezierCurve3;
  speed: number;
  offset: number;
  on: boolean;
  reduce: boolean | null;
}) {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = reduce ? 0.5 : (s.clock.elapsedTime * speed + offset) % 1;
    ref.current.position.copy(curve.getPoint(t));
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[on ? 0.075 : 0.055, 16, 16]} />
      <meshBasicMaterial color={on ? SOFT : "#8a857b"} />
    </mesh>
  );
}

function Connection({
  a,
  b,
  on,
  idx,
  reduce,
}: {
  a: string;
  b: string;
  on: boolean;
  idx: number;
  reduce: boolean | null;
}) {
  const curve = useMemo(() => curveFor(a, b), [a, b]);
  const pts = useMemo(() => curve.getPoints(48), [curve]);
  const speed = 0.16 + (idx % 3) * 0.04;

  return (
    <group>
      <Line
        points={pts}
        color={on ? SOFT : "#4a4a52"}
        lineWidth={on ? 2 : 1.2}
        transparent
        opacity={on ? 1 : 0.7}
      />
      <Packet curve={curve} speed={speed} offset={idx * 0.17} on={on} reduce={reduce} />
      <Packet curve={curve} speed={speed} offset={idx * 0.17 + 0.5} on={on} reduce={reduce} />
    </group>
  );
}

function Tag({
  n,
  st,
  pick,
  hover,
  y,
}: {
  n: NodeItem | InfraItem;
  st: string;
  pick: (id: string) => void;
  hover: (id: string | null) => void;
  y: number;
}) {
  return (
    <Html position={[0, y, 0]} center distanceFactor={14} zIndexRange={[20, 0]}>
      <button
        type="button"
        className={"sys-tag" + (st === "sel" ? " sel" : st === "dim" ? " dim" : "")}
        aria-pressed={st === "sel"}
        onClick={() => pick(n.id)}
        onMouseEnter={() => hover(n.id)}
        onMouseLeave={() => hover(null)}
        onFocus={() => hover(n.id)}
        onBlur={() => hover(null)}
      >
        <b>{n.label}</b>
        <i>{n.sub}</i>
      </button>
    </Html>
  );
}

function Block({
  n,
  st,
  pick,
  hover,
}: {
  n: NodeItem;
  st: "sel" | "rel" | "dim" | "";
  pick: (id: string) => void;
  hover: (id: string | null) => void;
}) {
  const g = useRef<Group>(null);
  const mat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#18181c",
        roughness: 0.3,
        metalness: 0.4,
        emissive: ORANGE,
        emissiveIntensity: 0,
        transparent: true,
      }),
    []
  );

  useFrame((_, dt) => {
    if (!g.current) return;
    const k = 1 - Math.exp(-dt * 8);
    const lift = st === "sel" ? 0.34 : 0;
    g.current.position.y += (baseY(n) + lift - g.current.position.y) * k;
    const sc = st === "sel" ? 1.06 : 1;
    g.current.scale.x += (sc - g.current.scale.x) * k;
    g.current.scale.y = g.current.scale.z = g.current.scale.x;
    mat.emissiveIntensity +=
      ((st === "sel" ? 0.6 : st === "rel" ? 0.2 : 0) - mat.emissiveIntensity) * k;
    mat.opacity += ((st === "dim" ? 0.5 : 1) - mat.opacity) * k;
  });

  const edge = st === "sel" ? ORANGE : st === "rel" ? "#c4663a" : "#5b5b63";
  const [w, h, d] = n.size;

  return (
    <group
      ref={g}
      position={[n.p[0], baseY(n), n.p[1]]}
      onClick={(e) => {
        e.stopPropagation();
        pick(n.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        hover(n.id);
        if (typeof document !== "undefined") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hover(null);
        if (typeof document !== "undefined") document.body.style.cursor = "";
      }}
    >
      {n.stack ? (
        [0, 1, 2].map((i) => (
          <RoundedBox
            key={i}
            args={[w, 0.22, d]}
            radius={0.06}
            smoothness={3}
            position={[0, -h / 2 + 0.11 + i * 0.32, 0]}
          >
            <primitive object={mat} attach="material" />
            <Edges color={edge} threshold={15} />
          </RoundedBox>
        ))
      ) : (
        <RoundedBox args={[w, h, d]} radius={0.08} smoothness={4}>
          <primitive object={mat} attach="material" />
          <Edges color={edge} threshold={15} />
        </RoundedBox>
      )}
      {st === "sel" && <Tag n={n} st={st} pick={pick} hover={hover} y={h / 2 + 0.42} />}
    </group>
  );
}

function Base({
  on,
  st,
  pick,
  hover,
}: {
  on: boolean;
  st: string;
  pick: (id: string) => void;
  hover: (id: string | null) => void;
}) {
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        pick("infra");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        hover("infra");
        if (typeof document !== "undefined") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hover(null);
        if (typeof document !== "undefined") document.body.style.cursor = "";
      }}
    >
      <mesh position={[0, -0.09, 0]}>
        <boxGeometry args={[11.8, 0.18, 5.2]} />
        <meshStandardMaterial
          color={on ? "#1d1410" : "#101013"}
          roughness={0.6}
          metalness={0.2}
        />
        <Edges color={on ? ORANGE : "#3a3a40"} />
      </mesh>
      <gridHelper
        args={[11.8, 24, "#2c2c32", "#1d1d21"]}
        position={[0, 0.003, 0]}
        scale={[1, 1, 5.2 / 11.8]}
      />
      {st === "sel" && <Tag n={INFRA} st={st} pick={pick} hover={hover} y={0.25} />}
    </group>
  );
}

function Scene({
  active,
  pick,
  hover,
  mx,
  my,
  reduce,
}: {
  active: string;
  pick: (id: string) => void;
  hover: (id: string | null) => void;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduce: boolean | null;
}) {
  const root = useRef<Group>(null);
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / (size.height || 1);
    camera.position.set(0, 7.0, 10.8 * Math.max(1, 1.8 / aspect));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [size, camera]);

  useFrame((s, dt) => {
    if (!root.current) return;
    const k = 1 - Math.exp(-dt * 3);
    const ty = (mx.get() - 0.5) * 0.55 + (reduce ? 0 : Math.sin(s.clock.elapsedTime * 0.25) * 0.05);
    const tx = (my.get() - 0.5) * 0.14;
    root.current.rotation.y += (ty - root.current.rotation.y) * k;
    root.current.rotation.x += (tx - root.current.rotation.x) * k;
  });

  const all = active === "infra";
  const linked = (id: string) =>
    EDGES.some(([a, b]) => (a === active && b === id) || (b === active && a === id));
  const stOf = (id: string) =>
    (id === active ? "sel" : all || linked(id) ? "rel" : active ? "dim" : "") as
      | "sel"
      | "rel"
      | "dim"
      | "";

  const an = BY_ID[active];
  const ringR = an && "size" in an ? Math.max(an.size[0], an.size[2]) * 0.62 + 0.1 : 0;

  return (
    <group ref={root}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 5]} intensity={1.1} />
      <pointLight position={[-5, 3, 4]} intensity={30} color="#ffb48a" />
      <Base on={all} st={stOf("infra")} pick={pick} hover={hover} />
      {EDGES.map(([a, b], i) => (
        <Connection
          key={a + b}
          a={a}
          b={b}
          idx={i}
          reduce={reduce}
          on={all || a === active || b === active}
        />
      ))}
      {NODES.map((n) => (
        <Block key={n.id} n={n} st={stOf(n.id)} pick={pick} hover={hover} />
      ))}
      {an && "size" in an && (
        <group position={[an.p[0], 0.012, an.p[1]]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <circleGeometry args={[ringR, 48]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.1} />
          </mesh>
          <mesh>
            <ringGeometry args={[ringR, ringR + 0.05, 64]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.85} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function SystemMap3D({
  mx,
  my,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const [sel, setSel] = useState("orch");
  const [hov, setHov] = useState<string | null>(null);
  const [tour, setTour] = useState(!reduce);

  useEffect(() => {
    if (!tour || hov) return;
    const t = setInterval(() => {
      setSel((s) => {
        const idx = ORDER.indexOf(s);
        const nextIdx = (idx + 1) % ORDER.length;
        return ORDER[nextIdx] ?? ORDER[0] ?? "orch";
      });
    }, 4200);
    return () => clearInterval(t);
  }, [tour, hov]);

  const active = hov || sel;
  const pick = (id: string) => {
    setSel(id);
    setTour(false);
  };
  const n = (BY_ID[active] ?? BY_ID["orch"])!;

  return (
    <div className="sys-map-card">
      <div className="sys-map-header">
        <div className="sys-map-label-group">
          <span className="sys-map-pulse-dot" />
          <span className="sys-map-label">FULL-STACK AI ARCHITECTURE</span>
        </div>
        <button
          type="button"
          className={"sys-tour-btn" + (tour ? " active" : "")}
          onClick={() => setTour((t) => !t)}
          aria-pressed={tour}
          title={tour ? "Pause automated architectural tour" : "Play automated tour"}
        >
          <span className="sys-tour-icon">{tour ? "❚❚" : "▶"}</span>
          <span>{tour ? "Pause tour" : "Play tour"}</span>
        </button>
      </div>

      <div className="sys-stage3d">
        <Canvas camera={{ position: [0, 5.6, 11.8], fov: 34 }} dpr={[1, 2]}>
          <Scene
            active={active}
            pick={pick}
            hover={setHov}
            mx={mx}
            my={my}
            reduce={reduce}
          />
        </Canvas>
      </div>

      <div className="sys-detail" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease } as Transition}
          >
            <div className="sys-detail-top">
              <span className="sys-detail-badge">{n.id.toUpperCase()}</span>
              <h3 className="sys-detail-title">{n.title}</h3>
            </div>
            <p className="sys-detail-text">{n.text}</p>
            <div className="sys-chips">
              {n.chips.map((c) => (
                <span key={c} className="sys-chip">
                  {c}
                </span>
              ))}
            </div>
            <div className="sys-detail-meta">
              <span className="sys-meta-label">USED IN</span>
              <span className="sys-meta-value">{n.used}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SystemMap3D;
