import { atom } from "jotai";
import type { Experience } from "@/components/experience/ExperienceDialog";

export const experienceDialogOpenAtom = atom(false);
export const editingExperienceAtom = atom<Experience | null>(null);
