"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { AnimationBriefObjeto } from "@/lib/animation-brief";
import type { SceneHandle } from "@/components/premium/PinScrubProduct/types";

type SatelliteSpec = {
  id: string;
  angle: number;
  y: number;
  phase: number;
  speed: number;
};

type HubCanvasProps = {
  handle: SceneHandle;
  accent: string;
  primary: string;
  objetos: AnimationBriefObjeto[];
};

function satelliteSpecs(objetos: AnimationBriefObjeto[]): SatelliteSpec[] {
  const nodes = objetos.filter((objeto) => objeto.id !== "hub");
  const count = nodes.length || 1;
  return nodes.map((node, index) => {
    const angle = (index / count) * Math.PI * 2 + 0.4;
    return {
      id: node.id,
      angle,
      y: Math.sin(angle * 2) * 0.26,
      phase: (index * 0.73) % 1,
      speed: 0.15 + (index % 3) * 0.045,
    };
  });
}

function Mark() {
  const source = useTexture("/brand/helphub-mark.webp");
  const gl = useThree((state) => state.gl);
  const texture = useMemo(() => {
    const next = source.clone();
    next.colorSpace = THREE.SRGBColorSpace;
    next.anisotropy = gl.capabilities.getMaxAnisotropy();
    next.magFilter = THREE.LinearFilter;
    next.minFilter = THREE.LinearMipmapLinearFilter;
    next.generateMipmaps = true;
    next.needsUpdate = true;
    return next;
  }, [gl, source]);

  return (
    <sprite position={[0, 0.02, 0.58]} scale={[0.92, 0.92, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

type NetworkProps = {
  specs: SatelliteSpec[];
  accent: string;
  primary: string;
  handle: SceneHandle;
};

function Network({ specs, accent, primary, handle }: NetworkProps) {
  const outer = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const path = useRef<THREE.Mesh>(null);
  const sats = useRef<(THREE.Mesh | null)[]>([]);
  const beams = useRef<(THREE.Mesh | null)[]>([]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const scratch = useRef({
    sat: new THREE.Vector3(),
    mid: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    hub: new THREE.Vector3(0, 0, 0),
    up: new THREE.Vector3(0, 1, 0),
  });

  useFrame(({ camera, clock }) => {
    const proxy = handle.proxy;
    const progress = handle.progress;
    const time = clock.elapsedTime;
    const root = outer.current;
    if (!root) return;

    root.scale.setScalar(proxy.scale);
    root.position.y = proxy.posY;

    if (spin.current) {
      spin.current.rotation.y = proxy.rotY * 0.55 + time * 0.07;
      spin.current.rotation.x = 0.4 + Math.sin(time * 0.25) * 0.03;
    }
    if (glow.current) {
      const pulse = 1 + Math.sin(time * 1.35) * 0.04;
      glow.current.scale.setScalar(pulse);
    }
    if (orbit.current) orbit.current.rotation.y = proxy.rotY;

    const bloom = THREE.MathUtils.smoothstep(progress, 0.02, 0.3);
    const hero = THREE.MathUtils.smoothstep(progress, 0.62, 0.92);
    const radius = THREE.MathUtils.lerp(0.16, 1.32, bloom) + hero * 0.1;
    const { sat, mid, dir, hub, up } = scratch.current;

    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      const drift = Math.sin(time * 0.55 + spec.phase * Math.PI * 2) * 0.05 * bloom;
      sat.set(
        Math.cos(spec.angle) * radius,
        spec.y * bloom + drift,
        Math.sin(spec.angle) * radius * 0.84,
      );

      const node = sats.current[i];
      if (node) {
        node.position.copy(sat);
        const material = node.material as THREE.MeshBasicMaterial;
        material.opacity = 0.12 + bloom * 0.88;
      }

      const beam = beams.current[i];
      if (beam) {
        dir.copy(sat).sub(hub);
        const len = Math.max(dir.length(), 0.001);
        mid.copy(hub).add(sat).multiplyScalar(0.5);
        beam.position.copy(mid);
        dir.multiplyScalar(1 / len);
        beam.quaternion.setFromUnitVectors(up, dir);
        beam.scale.set(1, len, 1);
        const material = beam.material as THREE.MeshBasicMaterial;
        material.opacity = 0.05 + bloom * 0.38;
      }

      const packet = packets.current[i];
      if (packet) {
        const travel = (time * spec.speed + spec.phase) % 1;
        packet.position.lerpVectors(hub, sat, travel);
        const material = packet.material as THREE.MeshBasicMaterial;
        material.opacity = bloom * (0.25 + Math.sin(travel * Math.PI) * 0.75);
      }
    }

    if (path.current) {
      const material = path.current.material as THREE.MeshBasicMaterial;
      material.opacity = bloom * 0.32;
      const fit = radius / 1.32;
      path.current.scale.set(fit, fit, fit);
    }

    for (let i = 0; i < rings.current.length; i++) {
      const ring = rings.current[i];
      if (!ring) continue;
      const phase = (time * (0.07 + i * 0.012) + i * 0.33) % 1;
      const size = 0.4 + phase * 1.65;
      ring.scale.setScalar(size);
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = (1 - phase) * 0.22 * (0.35 + bloom * 0.65);
    }

    camera.position.set(0, 0.16, proxy.camZ);
    camera.lookAt(0, 0.02, 0);
  });

  return (
    <group ref={outer}>
      <group ref={spin}>
        <mesh>
          <icosahedronGeometry args={[0.78, 1]} />
          <meshBasicMaterial color={primary} wireframe transparent opacity={0.45} toneMapped={false} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.98, 0]} />
          <meshBasicMaterial color={accent} wireframe transparent opacity={0.22} toneMapped={false} />
        </mesh>
      </group>

      <mesh ref={glow}>
        <sphereGeometry args={[0.46, 32, 32]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <Suspense fallback={null}>
        <Mark />
      </Suspense>

      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(node) => {
            rings.current[index] = node;
          }}
          rotation={[Math.PI / 2.15, 0.1 * index, 0]}
        >
          <torusGeometry args={[0.62, 0.006, 8, 72]} />
          <meshBasicMaterial
            color={index % 2 ? accent : primary}
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      <group ref={orbit}>
        <mesh ref={path} rotation={[1.12, 0.18, 0.08]}>
          <torusGeometry args={[1.22, 0.005, 8, 96]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        {specs.map((spec, index) => {
          const color = index % 2 ? accent : primary;
          return (
            <group key={spec.id}>
              <mesh
                ref={(node) => {
                  beams.current[index] = node;
                }}
              >
                <cylinderGeometry args={[0.012, 0.012, 1, 6, 1, true]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.2}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </mesh>
              <mesh
                ref={(node) => {
                  sats.current[index] = node;
                }}
              >
                <sphereGeometry args={[0.075, 20, 20]} />
                <meshBasicMaterial color={color} transparent opacity={1} toneMapped={false} />
              </mesh>
              <mesh
                ref={(node) => {
                  packets.current[index] = node;
                }}
              >
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshBasicMaterial
                  color={accent}
                  transparent
                  opacity={0}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

function HubScene({ handle, accent, primary, objetos }: HubCanvasProps) {
  const specs = useMemo(() => satelliteSpecs(objetos), [objetos]);

  return (
    <>
      <hemisphereLight args={["#dbeafe", "#020617", 0.45]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3.5, 5, 3]} intensity={1.05} color="#f8fafc" />
      <pointLight position={[0, 0.1, 0.4]} intensity={6} distance={4.5} color={accent} />
      <Network
        specs={specs}
        accent={accent}
        primary={primary}
        handle={handle}
      />
      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.45}
        scale={8}
        blur={2.6}
        far={4}
        color="#020617"
      />
    </>
  );
}

/** Cena 3D do hub. O proxy é lido no useFrame — nenhum setState por frame. */
export function HubCanvas(props: HubCanvasProps) {
  return (
    <Canvas
      className="pointer-events-none !absolute inset-0 h-full w-full"
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.16, 5.2], fov: 34 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <HubScene {...props} />
    </Canvas>
  );
}
