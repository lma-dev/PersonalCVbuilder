"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { resumeApi } from "./api-client";
import type { CreateResumeInput, UpdateResumeInput } from "./types";

export const resumeKeys = {
  all: ["resumes"] as const,
  list: () => [...resumeKeys.all, "list"] as const,
  detail: (id: string) => [...resumeKeys.all, "detail", id] as const,
};

export function resumeListOptions() {
  return queryOptions({
    queryKey: resumeKeys.list(),
    queryFn: () => resumeApi.list(),
  });
}

export function resumeDetailOptions(id: string) {
  return queryOptions({
    queryKey: resumeKeys.detail(id),
    queryFn: () => resumeApi.get(id),
    enabled: !!id,
  });
}

export function useResumes() {
  return useQuery(resumeListOptions());
}

export function useResume(id: string) {
  return useQuery(resumeDetailOptions(id));
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateResumeInput) => resumeApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.list() });
    },
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateResumeInput) => resumeApi.update(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.list() });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.list() });
    },
  });
}
