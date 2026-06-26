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

    // --- Nice palette ---
    // Deep ocean
    vec3 deepColor = vec3(0.02, 0.04, 0.12);

    // Lagoon teal
    vec3 lowColor = vec3(0.0, 0.25, 0.35);

    // Warm sand
    vec3 midColor = vec3(0.75, 0.55, 0.3);

    // Terracotta
    vec3 highColor = vec3(0.85, 0.35, 0.15);

    // Snow
    vec3 snowColor = vec3(0.95, 0.93, 0.98);

    float h = vElevation;

    vec3 color = deepColor;
    color = mix(color, lowColor, smoothstep(0.0, 0.05, h));
    color = mix(color, midColor, smoothstep(0.05, 0.12, h));
    color = mix(color, highColor, smoothstep(0.12, 0.2, h));
    color = mix(color, snowColor, smoothstep(0.2, 0.3, h));

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
