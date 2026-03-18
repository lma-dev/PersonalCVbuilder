import { atom } from "jotai";
import type { EducationType } from "@/features/education/types";

export const educationDialogOpenAtom = atom(false);
export const editingEducationAtom = atom<EducationType | null>(null);
