import { atom } from "jotai";
import type { Certification } from "@/components/certification/CertificationDialog";

export const certificationDialogOpenAtom = atom(false);
export const editingCertificationAtom = atom<Certification | null>(null);
