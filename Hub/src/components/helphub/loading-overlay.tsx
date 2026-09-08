"use client";

import { LoadingScreen } from "./loading-screen";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  return <LoadingScreen mode="overlay" isVisible={isVisible} />;
}
