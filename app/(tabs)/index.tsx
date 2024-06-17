import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber/native';
import { Environment } from '@react-three/drei/native';
import { GLTFLoader } from 'three-stdlib';
import { Asset } from 'expo-asset';
import useControls from "r3f-native-orbitcontrols";
import { View } from "react-native";
import { PerspectiveCamera } from 'three';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from "@react-spring/three";

function Model(props: any) {
  const asset = Asset.fromModule(require('../../assets/models/house_building_home.glb')).uri;
  const house = useLoader(GLTFLoader, asset);
  return <primitive {...props} object={house.scene} position={[-35, -10, 0]} />;
}

function DraggableModel(props: any) {
  const ref = useRef();
  const { viewport } = useThree();
  const [active, setActive] = useState(false);
  const [  , api] = useSpring(() => ({
    position: [0, 0, 0]
  }));

  const bind = useDrag(({ offset: [offsetX,offsetY] }) => {
    const translateX = offsetX / viewport.factor;
    const translateY = -offsetY / viewport.factor;
    api.start({ position: [translateX, translateY, 0] });
  });

  const asset = Asset.fromModule(require('../../assets/models/tree.glb')).uri;
  const model = useLoader(GLTFLoader, asset);

  return (
    <primitive
      {...props}
      object={model.scene}
      ref={ref}
      {...bind()}
      scale={active ? 0.1 : 0.2}
      onClick={() => setActive(!active)}
    />
  );
}

export default function App() {
  const [OrbitControls, events] = useControls();
  const [isDragging, setIsDragging] = useState(false);
  const camera = new PerspectiveCamera();
  camera.position.set(0, 2, 5);
  camera.lookAt(0, 0, 0);

  return (
    <View style={{ flex: 1 }} {...events}>
      <Canvas camera={camera}>
        <ambientLight />
        <Suspense fallback={null}>
          <Model />
          <DraggableModel setIsDragging={setIsDragging} />
          <Environment preset="dawn" background />
        </Suspense>
        <OrbitControls enableRotate={!isDragging} />
      </Canvas>
    </View>
  );
}
