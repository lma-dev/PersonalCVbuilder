"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { educationApi } from "./api-client";
import type { CreateEducationInput, UpdateEducationInput } from "./types";
import { resumeKeys } from "@/features/resume/use-resumes";

export const educationKeys = {
  all: ["educations"] as const,
  list: (resumeId: string) =>
    [...educationKeys.all, "list", resumeId] as const,
  detail: (id: string) =>
    [...educationKeys.all, "detail", id] as const,
};

export function educationListOptions(resumeId: string) {
  return queryOptions({
    queryKey: educationKeys.list(resumeId),
    queryFn: () => educationApi.list(resumeId),
    enabled: !!resumeId,
  });
}

export function useEducations(resumeId: string) {
  return useQuery(educationListOptions(resumeId));
}

export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEducationInput) => educationApi.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: educationKeys.list(variables.resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(variables.resumeId),
      });
    },
  });
}

export function useUpdateEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateEducationInput) => educationApi.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: educationKeys.list(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}

export function useDeleteEducation(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => educationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: educationKeys.list(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}
