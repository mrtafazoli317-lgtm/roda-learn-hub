import { useEffect, useRef } from "react";

type ScannerProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  glow?: number;
  scanDirection?: "vertical" | "horizontal";
  brightness?: number;
  contrast?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  className?: string;
};

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision mediump float;
varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uSpeed;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uGlow;
uniform float uVertical;
uniform float uBrightness;
uniform float uContrast;
uniform float uMouseAmount;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);

  // scan axis
  float axis = mix(uv.x, uv.y, uVertical);

  // soft drifting field
  float field = noise(p * 3.0 + vec2(uTime * uSpeed * 0.5, uTime * uSpeed * 0.25));
  field += 0.5 * noise(p * 6.0 - vec2(uTime * uSpeed * 0.3, 0.0));
  field /= 1.5;

  // sweeping band
  float sweep = fract(axis * 1.0 - uTime * uSweepSpeed);
  float band = smoothstep(0.5, 0.0, abs(sweep - 0.5) * (6.0 / max(uSweepWidth, 0.001)));
  band = pow(band, 2.0);

  // fine scan lines
  float lines = 0.5 + 0.5 * sin((mix(uv.x, uv.y, uVertical)) * 420.0 - uTime * uSpeed * 6.0);
  lines = mix(1.0, lines, 0.25);

  // mouse halo
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float dist = distance(p, m);
  float halo = uMouseAmount * smoothstep(0.55, 0.0, dist);

  float intensity = clamp(field * 0.55 + band * 0.9 + halo, 0.0, 1.6);

  vec3 col = mix(uColor1, uColor2, clamp(field + halo * 0.6, 0.0, 1.0));
  col = mix(col, uColor3, clamp(band * (0.4 + uGlow * 2.0), 0.0, 1.0));
  col *= intensity * lines;

  // glow bloom
  col += uColor3 * band * uGlow;

  col = (col - 0.5) * uContrast + 0.5;
  col *= uBrightness;

  float alpha = clamp(intensity, 0.0, 1.0);
  gl_FragColor = vec4(max(col, vec3(0.0)), alpha);
}
`;

export default function Scanner({
  color1 = "#6e4df2",
  color2 = "#ff27f8",
  color3 = "#FFFFFF",
  speed = 0.35,
  sweepSpeed = 0.2,
  sweepWidth = 1.8,
  glow = 0.18,
  scanDirection = "vertical",
  brightness = 0.8,
  contrast = 1.1,
  opacity = 0.35,
  mouseInteraction = true,
  className = "",
}: ScannerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { Renderer, Program, Mesh, Triangle } = await import("ogl");
      if (disposed || !hostRef.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lowPower =
        (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 480;

      const renderer = new Renderer({
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.6),
      });
      const gl = renderer.gl;
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.display = "block";
      host.appendChild(gl.canvas);

      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [host.clientWidth, host.clientHeight] },
          uMouse: { value: [0.5, 0.5] },
          uColor1: { value: hexToRgb(color1) },
          uColor2: { value: hexToRgb(color2) },
          uColor3: { value: hexToRgb(color3) },
          uSpeed: { value: speed },
          uSweepSpeed: { value: sweepSpeed },
          uSweepWidth: { value: sweepWidth },
          uGlow: { value: glow },
          uVertical: { value: scanDirection === "vertical" ? 1 : 0 },
          uBrightness: { value: brightness },
          uContrast: { value: contrast },
          uMouseAmount: { value: mouseInteraction && !lowPower ? 0.45 : 0 },
        },
      });

      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h);
        program.uniforms['uResolution']!.value = [w, h];
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const onPointer = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        program.uniforms['uMouse']!.value = [
          (e.clientX - rect.left) / rect.width,
          1 - (e.clientY - rect.top) / rect.height,
        ];
      };
      if (mouseInteraction && !lowPower) {
        host.addEventListener("pointermove", onPointer, { passive: true });
      }

      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = !!entry?.isIntersecting;
      });
      io.observe(host);

      const start = performance.now();
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        program.uniforms['uTime']!.value = ((performance.now() - start) / 1000) * (reduced ? 0.15 : 1);
        renderer.render({ scene: mesh });
      };
      // a single frame is enough when motion is reduced
      if (reduced) {
        renderer.render({ scene: mesh });
      } else {
        raf = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        host.removeEventListener("pointermove", onPointer);
        gl.canvas.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [
    color1,
    color2,
    color3,
    speed,
    sweepSpeed,
    sweepWidth,
    glow,
    scanDirection,
    brightness,
    contrast,
    mouseInteraction,
  ]);

  return <div ref={hostRef} className={className} style={{ opacity }} aria-hidden="true" />;
}
