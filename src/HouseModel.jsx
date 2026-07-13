/*
  HouseModel.jsx
  Dynamic model loader — accepts a glbPath prop instead of hardcoding /model.glb.
  Used by Cottage.jsx so each bedroom count loads from the right /public/houses/ subfolder.

  IMPORTANT: We render the parsed `scene` via <primitive> rather than walking
  the flat `nodes` dictionary and re-creating <mesh> elements by hand. The
  `nodes` map is flat — every node in the file, regardless of nesting — and
  each node's position/rotation/scale is LOCAL to its immediate parent, not
  world space. Rebuilding meshes into a single flat <group> (as the old
  version did) drops every ancestor group's transform, which is why parts
  of the house rendered detached/offset from each other even though each
  individual mesh looked fine. <primitive object={scene}> preserves the full
  original hierarchy and all transforms exactly as authored.
*/
import React from 'react';
import { useGLTF } from '@react-three/drei';

export function HouseModel({ glbPath }) {
  const { scene } = useGLTF(glbPath);

  return <primitive object={scene} dispose={null} />;
}
