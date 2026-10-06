"use client";

/* Posters já são WebP no tamanho do master; next/image reamostraria o crop. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { aboutSteps } from "./about-step-content";
import media from "./about-step-media.json";
import "./about-step-video.css";

type ThemeMedia = {
  mp4: string;
  webm: string;
  poster: string;
};

type Playback = {
  mobile: boolean;
  dark: boolean;
  sources: ThemeMedia;
};

function isDocumentDark() {
  const root = document.documentElement;
  if (root.classList.contains("dark")) return true;
  if (root.classList.contains("light")) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function useReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

let playbackCache: Playback | null = null;
let playbackKey = "";

function readPlaybackCached(): Playback {
  const mobile = window.matchMedia("(max-width: 639px)").matches;
  const dark = isDocumentDark();
  const key = `${mobile}:${dark}`;
  if (playbackCache && playbackKey === key) return playbackCache;
  const bucket = mobile ? media.mobile : media.desktop;
  playbackCache = {
    mobile,
    dark,
    sources: dark ? bucket.dark : bucket.light,
  };
  playbackKey = key;
  return playbackCache;
}

function subscribePlayback(onChange: () => void) {
  const mobileQuery = window.matchMedia("(max-width: 639px)");
  const colorQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mobileQuery.addEventListener("change", onChange);
  colorQuery.addEventListener("change", onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => {
    mobileQuery.removeEventListener("change", onChange);
    colorQuery.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function usePlayback() {
  return useSyncExternalStore(subscribePlayback, readPlaybackCached, () => null);
}

/**
 * Vídeo pré-renderizado do carrossel. O arquivo é mais largo que a coluna
 * e fica centralizado: a máscara e o overflow reproduzem o corte de cada largura
 * sem escalar os cards. Tema e breakpoint escolhem o arquivo.
 */
export function AboutStep() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const playback = usePlayback();
  const [near, setNear] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reducedMotion) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting && document.visibilityState === "visible") {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "240px 0px", threshold: 0.15 },
    );

    io.observe(stage);
    return () => io.disconnect();
  }, [reducedMotion, playback?.sources.mp4]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !near || reducedMotion) return;

    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
        return;
      }
      void video.play().catch(() => {});
    };

    document.addEventListener("visibilitychange", onVisibility);
    void video.play().catch(() => {});
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [near, reducedMotion, playback?.sources.mp4]);

  const showVideo = !reducedMotion && near && playback !== null;

  return (
    <div className="mt-10 select-none px-2 sm:px-4">
      <div ref={stageRef} className="hh-about-stage">
        <img
          src={media.mobile.light.poster}
          alt=""
          className="hh-about-frame hh-about-frame--mobile-light"
          decoding="async"
          loading="lazy"
        />
        <img
          src={media.desktop.light.poster}
          alt=""
          className="hh-about-frame hh-about-frame--desktop-light"
          decoding="async"
          loading="lazy"
        />
        <img
          src={media.mobile.dark.poster}
          alt=""
          className="hh-about-frame hh-about-frame--mobile-dark"
          decoding="async"
          loading="lazy"
        />
        <img
          src={media.desktop.dark.poster}
          alt=""
          className="hh-about-frame hh-about-frame--desktop-dark"
          decoding="async"
          loading="lazy"
        />

        {showVideo && (
          <video
            ref={videoRef}
            key={playback.sources.mp4}
            className="hh-about-frame hh-about-video"
            style={{
              display: "block",
              aspectRatio: playback.mobile
                ? `${media.mobile.width} / ${media.mobile.height}`
                : `${media.desktop.width} / ${media.desktop.height}`,
            }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={playback.sources.poster}
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={playback.sources.webm} type="video/webm" />
            <source src={playback.sources.mp4} type="video/mp4" />
          </video>
        )}

        <ol className="sr-only">
          {aboutSteps.map((step) => (
            <li key={step.name}>
              {step.name}. {step.description}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
