"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { skillApi } from "./api-client";
import type { CreateSkillInput, UpdateSkillInput } from "./types";
import { resumeKeys } from "@/features/resume/use-resumes";

export const skillKeys = {
  all: ["skills"] as const,
  list: (resumeId: string) => [...skillKeys.all, "list", resumeId] as const,
  detail: (id: string) => [...skillKeys.all, "detail", id] as const,
};

export function skillListOptions(resumeId: string) {
  return queryOptions({
    queryKey: skillKeys.list(resumeId),
    queryFn: () => skillApi.list(resumeId),
    enabled: !!resumeId,
  });
}

export function useSkills(resumeId: string) {
  return useQuery(skillListOptions(resumeId));
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSkillInput) => skillApi.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: skillKeys.list(variables.resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(variables.resumeId),
      });
    },
  });
}

export function useUpdateSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSkillInput) => skillApi.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: skillKeys.list(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}

export function useDeleteSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => skillApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: skillKeys.list(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}
