/* eslint-disable */
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import {
  EquirectangularReflectionMapping,
  LoadingManager,
  sRGBEncoding,
  TextureLoader,
} from 'three';
import { loadingManager } from '../loadingManager';
export default async function hdriLoad() {
  let manager=loadingManager();

  const hdriLoader = new RGBELoader(manager).setPath('/hdri/');

  const textureLoader = new TextureLoader(manager).setPath('/hdri/');

  const [background0, hdri0, hdri1] = await Promise.all([
    textureLoader.loadAsync('lythwood_room_1k.jpg'),
    textureLoader.loadAsync('lythwood_room_1k_test.jpg'),
    hdriLoader.loadAsync('cyclorama_hard_light_1k.hdr'),
  ]);
  background0.encoding = sRGBEncoding;
  background0.mapping = EquirectangularReflectionMapping;
  hdri0.mapping = hdri1.mapping = EquirectangularReflectionMapping;
  return { background0, hdri0, hdri1 };
}
