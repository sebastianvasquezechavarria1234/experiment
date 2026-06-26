export const sphereFragmentShader = /* glsl */ `
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);

    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0);

    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

    vec3 baseColor = vec3(0.1, 0.3, 0.8);
    vec3 accentColor = vec3(0.8, 0.2, 0.9);
    vec3 color = mix(baseColor, accentColor, fresnel);

    color += diff * vec3(0.3, 0.4, 0.6) * 0.5;
    color += spec * vec3(1.0) * 0.4;
    color += fresnel * accentColor * 0.6;

    float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
    color += fresnel * pulse * vec3(0.2, 0.1, 0.3);

    gl_FragColor = vec4(color, 1.0);
  }
`;
