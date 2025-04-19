import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeDAnnotations({ landmarks }) {
  const mountRef = useRef();

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(640, 480);
    mount.appendChild(renderer.domElement);

    const redDotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const jointDots = landmarks?.map(() => new THREE.Mesh(new THREE.SphereGeometry(0.01), redDotMaterial)) || [];
    jointDots.forEach(dot => scene.add(dot));

    camera.position.z = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      if (landmarks) {
        jointDots.forEach((dot, i) => {
          const { x, y, z } = landmarks[i];
          dot.position.set((x - 0.5) * 2, -(y - 0.5) * 2, -z);
        });
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      while (mount.firstChild) mount.removeChild(mount.firstChild);
    };
  }, [landmarks]);

  return <div ref={mountRef} className="absolute top-0 left-0 z-20" />;
}
