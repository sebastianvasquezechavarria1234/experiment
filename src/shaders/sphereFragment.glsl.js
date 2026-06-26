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

    // Light
    vec3 lightDir = normalize(vec3(1.0, 2.0, 1.5));
    float diff = max(dot(vNormal, lightDir), 0.0);

    // Specular
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 16.0);

    // Fresnel
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

    // --- Height coloring like mountains ---
    // Deep valleys: dark blue/teal
    vec3 deepColor = vec3(0.05, 0.12, 0.25);

    // Mid terrain: earthy green
    vec3 midColor = vec3(0.15, 0.35, 0.15);

    // Peaks: warm orange/brown
    vec3 peakColor = vec3(0.65, 0.35, 0.15);

    // Snow caps: white
    vec3 snowColor = vec3(0.9, 0.92, 0.95);

    float h = vElevation;

    vec3 color;
    if (h < -0.05) {
      color = deepColor;
    } else if (h < 0.05) {
      float t = smoothstep(-0.05, 0.05, h);
      color = mix(deepColor, midColor, t);
    } else if (h < 0.15) {
      float t = smoothstep(0.05, 0.15, h);
      color = mix(midColor, peakColor, t);
    } else {
      float t = smoothstep(0.15, 0.25, h);
      color = mix(peakColor, snowColor, t);
    }

    // Apply lighting
    color *= 0.3 + diff * 0.7;
    color += spec * vec3(0.8, 0.85, 1.0) * 0.3;
    color += fresnel * vec3(0.2, 0.4, 0.7) * 0.4;

    // Hover glow: energy tint
    color += uHover * fresnel * vec3(0.3, 0.6, 1.0) * 0.5;
    float pulse = sin(uTime * 3.0) * 0.5 + 0.5;
    color += uHover * pulse * vec3(0.1, 0.2, 0.4) * 0.2;

    // Click flash
    color += uClick * vec3(1.0, 0.6, 0.2) * 0.4;

    gl_FragColor = vec4(color, 1.0);
  }
`;
