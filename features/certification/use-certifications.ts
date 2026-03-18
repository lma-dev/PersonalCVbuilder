"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { certificationApi } from "./api-client";
import type {
  CreateCertificationInput,
  UpdateCertificationInput,
} from "./types";
import { resumeKeys } from "@/features/resume/use-resumes";

export const certificationKeys = {
  all: ["certifications"] as const,
  list: (resumeId: string) =>
    [...certificationKeys.all, "list", resumeId] as const,
  detail: (id: string) =>
    [...certificationKeys.all, "detail", id] as const,
};

export function certificationListOptions(resumeId: string) {
  return queryOptions({
    queryKey: certificationKeys.list(resumeId),
    queryFn: () => certificationApi.list(resumeId),
    enabled: !!resumeId,
  });
}

export function useCertifications(resumeId: string) {
  return useQuery(certificationListOptions(resumeId));
}

export function useCreateCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCertificationInput) =>
      certificationApi.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: certificationKeys.list(variables.resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(variables.resumeId),
      });
    },
  });
}

export function useUpdateCertification(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCertificationInput) =>
      certificationApi.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificationKeys.list(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}

export function useDeleteCertification(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => certificationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificationKeys.list(resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}
