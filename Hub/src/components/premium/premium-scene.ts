import { DEFAULT_PROXY_FROM, type SceneHandle } from "@/components/premium/PinScrubProduct/types";

/** Handle único do lab. GSAP escreve; o canvas lê no useFrame. */
export const premiumScene: SceneHandle = {
  proxy: { ...DEFAULT_PROXY_FROM },
  progress: 0,
};
