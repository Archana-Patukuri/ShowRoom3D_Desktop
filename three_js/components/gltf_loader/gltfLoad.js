import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import GLTFMeshGpuInstancingExtension from 'three-gltf-extensions/loaders/EXT_mesh_gpu_instancing/EXT_mesh_gpu_instancing.js';

import GLTFMaterialsVariantsExtension from 'three-gltf-extensions/loaders/KHR_materials_variants/KHR_materials_variants.js';
import { LoadingManager } from 'three';

async function gltfLoad(modelURL) {
  const manager = new LoadingManager();
  manager.onError = function (url) {
    console.log('There was an error loading gltf model' + url);
  };

  const loader = new GLTFLoader(manager);

  //Draco Loader
  const dracoLoader = new DRACOLoader(manager);
  dracoLoader.setDecoderPath('decoder/draco/');
  loader.setDRACOLoader(dracoLoader);

  //MeshGPU Instancing
  loader.register((parser) => new GLTFMeshGpuInstancingExtension(parser));
  //Material Variants
  loader.register((parser) => new GLTFMaterialsVariantsExtension(parser));
  //Draco Loader

  const gltfData = await loader.loadAsync(`${modelURL}`);

  return { gltfData };
}

export { gltfLoad };
