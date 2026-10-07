import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import { MathUtils, type Group } from "three";

interface GlowMaterialRef {
  distort: number;
}

export function HeroCore3D() {
  const group = useRef<Group>(null);
  const glow = useRef<GlowMaterialRef | null>(null);
  const N = 2200;

  const pts = useMemo(() => {
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const th = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = 1.75 + (i % 7) * 0.012;
      a.set(
        [r * Math.cos(th) * Math.sin(phi), r * Math.sin(th) * Math.sin(phi), r * Math.cos(phi)],
        i * 3
      );
    }
    return a;
  }, [N]);

  useFrame((s, dt) => {
    const g = group.current;
    if (!g) return;

    g.rotation.y += dt * 0.12;
    g.rotation.x = MathUtils.lerp(g.rotation.x, -s.pointer.y * 0.6, 0.05);
    g.position.x = MathUtils.lerp(g.position.x, s.pointer.x * 0.35, 0.05);
    g.position.y = MathUtils.lerp(g.position.y, s.pointer.y * 0.25, 0.05);

    const d = Math.hypot(s.pointer.x, s.pointer.y);
    if (glow.current) {
      glow.current.distort = MathUtils.lerp(glow.current.distort, 0.35 + d * 0.3, 0.05);
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pts, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          color="#ff8a4c"
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      <mesh>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.1} />
      </mesh>

      <Float speed={2} floatIntensity={0.4}>
        <mesh>
          <sphereGeometry args={[0.85, 96, 96]} />
          <MeshDistortMaterial
            ref={glow as any}
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
    </group>
  );
}

export default HeroCore3D;
