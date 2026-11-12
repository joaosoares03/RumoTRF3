"use client";

import { useState } from "react";
import { PlayCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryVideo = { id: string; url: string; title: string; channel: string; topic: string; primary: boolean };

export function youtubeId(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.includes("youtu.be") ? u.pathname.slice(1) : (u.searchParams.get("v") ?? "");
  } catch {
    return "";
  }
}

/** Player do YouTube (modo de privacidade aprimorada) com lista para alternar entre as videoaulas da aula. */
export function VideoGallery({ videos }: { videos: GalleryVideo[] }) {
  const [current, setCurrent] = useState(0);
  if (!videos.length) return null;
  const v = videos[current];
  return (
    <div className="space-y-3">
      <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black">
        <iframe
          key={v.id}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId(v.url)}`}
          title={v.title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="size-full"
        />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium leading-snug">{v.title}</div>
          <div className="text-xs text-muted">
            {v.channel}
            {!v.primary && ` · também trata de: ${v.topic}`}
          </div>
        </div>
        <a href={v.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 text-xs text-muted hover:text-accent">
          Abrir no YouTube <ExternalLink className="size-3" />
        </a>
      </div>
      {videos.length > 1 && (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Outras videoaulas desta aula">
          {videos.map((x, i) => (
            <li key={x.id}>
              <button
                onClick={() => setCurrent(i)}
                aria-current={i === current}
                className={cn(
                  "flex w-full items-start gap-2 rounded-xl border p-2.5 text-left text-xs transition",
                  i === current ? "border-accent bg-accent-soft/50" : "border-border hover:border-muted",
                )}
              >
                <PlayCircle className={cn("mt-0.5 size-4 shrink-0", i === current ? "text-accent" : "text-muted")} />
                <span className="min-w-0">
                  <span className="line-clamp-2 font-medium">{x.title}</span>
                  <span className="text-muted">{x.channel}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[11px] text-muted">Vídeos públicos de terceiros, incorporados pelo player oficial do YouTube. Título e canal conferidos automaticamente.</p>
    </div>
  );
}
