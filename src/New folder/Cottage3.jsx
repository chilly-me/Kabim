import React, { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model.jsx";

const Scene = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Model />
        <Environment preset="dawn" background={true} />
      </Suspense>
      {/* REPLACE THIS LIGHT AS NEEDED IT'S A GOOD START */}
      <ambientLight intensity={1} />
    </>
  );
};

const Cottage = () => {
  return (
    <Canvas shadows gl={{ physicallyCorrectLights: true }}>
      {/* REMOVE ORBIT CONTROLS TO FORCE THE CAMERA VIEW BAKED INTO THE GLB */}
      <OrbitControls />
      <Scene />
    </Canvas>
  );
};

export default Cottage;