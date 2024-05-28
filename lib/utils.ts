import { siteConfig } from "@/config/site"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path}`
}

import {
  StreamPartType,
  StreamStringPrefixes,
  parseStreamPart,
} from '@/lib/stream-parts';

export * from '@/lib/generate-id';

// TODO remove (breaking change)
export { generateId as nanoid } from '@/lib/generate-id';

// Export stream data utilities for custom stream implementations,
// both on the client and server side.
export type { StreamPart } from '@/lib/stream-parts';
export { formatStreamPart, parseStreamPart } from '@/lib/stream-parts';
export { readDataStream } from '@/lib/read-data-stream';

// simple decoder signatures:
function createChunkDecoder(): (chunk: Uint8Array | undefined) => string;
function createChunkDecoder(
  complex: false,
): (chunk: Uint8Array | undefined) => string;
// complex decoder signature:
function createChunkDecoder(
  complex: true,
): (chunk: Uint8Array | undefined) => StreamPartType[];
// combined signature for when the client calls this function with a boolean:
function createChunkDecoder(
  complex?: boolean,
): (chunk: Uint8Array | undefined) => StreamPartType[] | string;
function createChunkDecoder(complex?: boolean) {
  const decoder = new TextDecoder();

  if (!complex) {
    return function (chunk: Uint8Array | undefined): string {
      if (!chunk) return '';
      return decoder.decode(chunk, { stream: true });
    };
  }

  return function (chunk: Uint8Array | undefined) {
    const decoded = decoder
      .decode(chunk, { stream: true })
      .split('\n')
      .filter(line => line !== ''); // splitting leaves an empty string at the end

    return decoded.map(parseStreamPart).filter(Boolean);
  };
}

export { createChunkDecoder };

export const isStreamStringEqualToType = (
  type: keyof typeof StreamStringPrefixes,
  value: string,
): value is StreamString =>
  value.startsWith(`${StreamStringPrefixes[type]}:`) && value.endsWith('\n');

export type StreamString =
  `${(typeof StreamStringPrefixes)[keyof typeof StreamStringPrefixes]}:${string}\n`;
