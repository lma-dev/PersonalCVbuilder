"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { projectApi } from "./api-client";
import type { CreateProjectInput, UpdateProjectInput } from "./types";
import { experienceKeys } from "@/features/experience/use-experiences";

export const projectKeys = {
  all: ["projects"] as const,
  list: (experienceId: string) =>
    [...projectKeys.all, "list", experienceId] as const,
  detail: (id: string) => [...projectKeys.all, "detail", id] as const,
};

export function projectListOptions(experienceId: string) {
  return queryOptions({
    queryKey: projectKeys.list(experienceId),
    queryFn: () => projectApi.list(experienceId),
    enabled: !!experienceId,
  });
}

export function useProjects(experienceId: string) {
  return useQuery(projectListOptions(experienceId));
}

export function useCreateProject(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectApi.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(variables.experienceId),
      });
      queryClient.invalidateQueries({
        queryKey: experienceKeys.list(resumeId),
      });
    },
  });
}

export function useUpdateProject(experienceId: string, resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProjectInput) => projectApi.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(experienceId),
      });
      queryClient.invalidateQueries({
        queryKey: experienceKeys.list(resumeId),
      });
    },
  });
}

export function useDeleteProject(experienceId: string, resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(experienceId),
      });
      queryClient.invalidateQueries({
        queryKey: experienceKeys.list(resumeId),
      });
    },
  });
}
