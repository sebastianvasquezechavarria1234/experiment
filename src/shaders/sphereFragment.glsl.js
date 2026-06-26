export const sphereFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  uniform float uClick;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vElevation;

  void main() {
    vec3 viewDir = normalize(-vPosition);

    // --- Sun light ---
    vec3 sunDir = normalize(vec3(2.0, 3.0, 2.0));
    float diff = max(dot(vNormal, sunDir), 0.0);

    // Warm wrap lighting
    float wrap = (dot(vNormal, sunDir) + 0.4) / 1.4;
    diff = max(wrap, 0.0);

    // Specular sun
    vec3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0);

    // Fresnel
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

    // --- Palette ---
    vec3 deepColor = vec3(0.02, 0.04, 0.12);
    vec3 lowColor = vec3(0.0, 0.25, 0.35);
    vec3 midColor = vec3(0.75, 0.55, 0.3);
    vec3 highColor = vec3(0.85, 0.35, 0.15);
    vec3 snowColor = vec3(0.95, 0.93, 0.98);

    float h = vElevation;

    vec3 color = deepColor;
    color = mix(color, lowColor, smoothstep(0.0, 0.05, h));
    color = mix(color, midColor, smoothstep(0.05, 0.12, h));
    color = mix(color, highColor, smoothstep(0.12, 0.2, h));
    color = mix(color, snowColor, smoothstep(0.2, 0.3, h));

    // Sun warm tint
    vec3 sunColor = vec3(1.0, 0.9, 0.7);
    vec3 shadowColor = vec3(0.05, 0.08, 0.15);

    // Lit side: warm sun, dark side: cool shadows
    vec3 lit = mix(shadowColor, sunColor, diff) * color;

    // Specular highlight
    lit += spec * sunColor * 0.6;

    // Fresnel rim
    lit += fresnel * vec3(0.15, 0.25, 0.5) * 0.3;

    // Ambient
    lit += color * 0.08;

    color = lit;

    // Hover: subtle glow
    color += uHover * fresnel * vec3(0.2, 0.4, 0.8) * 0.25;

    // Click: warm flash
    color += uClick * vec3(1.0, 0.6, 0.2) * 0.25;

    gl_FragColor = vec4(color, 1.0);
  }
`;
