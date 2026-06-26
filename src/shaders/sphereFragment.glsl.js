export const sphereFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uExplosion;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vExplosion;
  varying float vHover;

  void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);

    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0);

    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

    // Base colors
    vec3 baseColor = vec3(0.1, 0.3, 0.8);
    vec3 accentColor = vec3(0.8, 0.2, 0.9);
    vec3 explosionColor = vec3(1.0, 0.4, 0.1);
    vec3 hotColor = vec3(1.0, 0.8, 0.3);

    vec3 color = mix(baseColor, accentColor, fresnel);

    // Lighting
    color += diff * vec3(0.3, 0.4, 0.6) * 0.5;
    color += spec * vec3(1.0) * 0.4;
    color += fresnel * accentColor * 0.6;

    // Hover glow - radiates from mouse hit point
    float hoverGlow = smoothstep(1.5, 0.0, length(vPosition.xy - vec3(uMouse, 0.0).xy)) * vHover;
    color += hoverGlow * vec3(0.5, 0.3, 1.0) * 1.5;
    color += hoverGlow * fresnel * hotColor;

    // Hover intensity pulse
    float hoverPulse = sin(uTime * 6.0) * 0.5 + 0.5;
    color += vHover * hoverPulse * vec3(0.3, 0.15, 0.5) * 0.5;

    // Explosion glow - fiery core
    color = mix(color, explosionColor, vExplosion * 0.8);
    color += vExplosion * hotColor * 0.6;
    color += vExplosion * fresnel * vec3(1.0, 0.6, 0.2) * 2.0;

    // Explosion edge crackle
    float crackle = sin(vPosition.x * 20.0 + uTime * 10.0) *
                    sin(vPosition.y * 20.0 + uTime * 8.0) *
                    sin(vPosition.z * 20.0 + uTime * 12.0);
    color += vExplosion * abs(crackle) * hotColor * 0.4;

    // Hot spots during explosion
    float hotSpot = pow(max(dot(vNormal, normalize(vec3(0.0, 1.0, 0.5))), 0.0), 4.0);
    color += vExplosion * hotSpot * hotColor * 1.5;

    // Emission boost during explosion
    float emission = vExplosion * 0.5;
    color += emission * explosionColor;

    gl_FragColor = vec4(color, 1.0);
  }
`;
