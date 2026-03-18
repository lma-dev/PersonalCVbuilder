"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { experienceApi } from "./api-client";
import type { CreateExperienceInput, UpdateExperienceInput } from "./types";
import { resumeKeys } from "@/features/resume/use-resumes";

export const experienceKeys = {
  all: ["experiences"] as const,
  list: (resumeId: string) =>
    [...experienceKeys.all, "list", resumeId] as const,
  detail: (id: string) => [...experienceKeys.all, "detail", id] as const,
};

export function experienceListOptions(resumeId: string) {
  return queryOptions({
    queryKey: experienceKeys.list(resumeId),
    queryFn: () => experienceApi.list(resumeId),
    enabled: !!resumeId,
  });
}

export function useExperiences(resumeId: string) {
  return useQuery(experienceListOptions(resumeId));
}

export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExperienceInput) =>
      experienceApi.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: experienceKeys.list(variables.resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(variables.resumeId),
      });
    },
  });
}

export function useUpdateExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateExperienceInput) =>
      experienceApi.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: experienceKeys.list(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}

export function useDeleteExperience(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => experienceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: experienceKeys.list(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}

export function useReorderExperiences(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) =>
      experienceApi.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: experienceKeys.list(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}
