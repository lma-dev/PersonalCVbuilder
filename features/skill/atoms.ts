import { atom } from "jotai";
import type { SkillCategory } from "@/components/skills/SkillDialog";

export const skillDialogOpenAtom = atom(false);
export const editingSkillCategoryAtom = atom<SkillCategory | null>(null);
export const addCategoryDialogOpenAtom = atom(false);
