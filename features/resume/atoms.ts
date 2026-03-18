import { atom } from "jotai";
import type { LanguageMode } from "./types";

export const activeResumeIdAtom = atom<string | null>(null);

export const languageModeAtom = atom<LanguageMode>("BOTH");
