"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const fragmentShader = `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    // Fluid dynamics simulation effect
    vec2 q = vec2(0.);
    q.x = snoise(st + 0.00 * u_time);
    q.y = snoise(st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = snoise(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = snoise(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

    float f = snoise(st + r);
    
    // Indian ocean daylight colors (light teals, sky blue, and white sand)
    vec3 color = mix(
        vec3(0.85, 0.95, 0.98), // Bright shallow water/white sand
        vec3(0.40, 0.85, 0.90), // Light crystal teal
        clamp(f * f * 4.0, 0.0, 1.0)
    );

    color = mix(
        color,
        vec3(0.15, 0.65, 0.85), // Deeper sky blue
        clamp(length(q), 0.0, 1.0)
    );

    color = mix(
        color,
        vec3(0.9, 1.0, 0.95), // Sun glint highlight
        clamp(length(r.x), 0.0, 1.0)
    );

    // Mouse interaction - adds a ripple/glow at mouse position
    vec2 mouse = u_mouse;
    mouse.x *= u_resolution.x / u_resolution.y;
    float dist = distance(st, mouse);
    
    float glow = exp(-dist * 4.0); // Soft wide glow
    float intenseGlow = exp(-dist * 12.0); // Intense center glow

    // Add mouse ripple distortion
    float ripple = sin(dist * 20.0 - u_time * 5.0) * exp(-dist * 5.0);
    color += vec3(0.2, 0.6, 0.8) * ripple * 0.3;

    // Add mouse glow
    vec3 mouseGlowColor = vec3(1.0, 1.0, 1.0);
    color += mouseGlowColor * glow * 0.2;
    color += vec3(1.0, 1.0, 1.0) * intenseGlow * 0.3;
    
    // Vignette for depth
    float vignette = st.y * (1.0 - st.y) * 2.0;
    color *= mix(0.85, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FluidPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [size]
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.getElapsedTime();
      
      // Update mouse position (normalized 0 to 1, with y flipped for webgl)
      // Normalize to 0-1 range
      const mouseX = (state.pointer.x + 1) / 2;
      const mouseY = (state.pointer.y + 1) / 2;
      
      // Smoothly interpolate mouse to avoid jerky movements
      material.uniforms.u_mouse.value.lerp(new THREE.Vector2(mouseX, mouseY), 0.05);
      material.uniforms.u_resolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default function HeroFluid() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: false, antialias: false }} // Better performance
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        <FluidPlane />
      </Canvas>
      {/* Subtle overlay to ensure text readability */}
      <div className="absolute inset-0 bg-bg/40 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
