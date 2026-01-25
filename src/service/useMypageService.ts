import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createInquiry,
  getInquiryList,
  updateMyinfo,
  uploadProfileImage,
  uploadTempImage,
} from '@/api/mypage';
import {
  CreateInquiryRequest,
  InquiryListSearchRequest,
  UpdateMyinfoRequest,
  UseQueryOptionsType,
} from '@/types';

const useMypageService = () => {
  const useProfileImageUploadMutation = () => {
    return useMutation({
      mutationFn: (param: FormData) => uploadProfileImage(param),
    });
  };

  const useTempImageUploadMutation = () => {
    return useMutation({
      mutationFn: (param: FormData) => uploadTempImage(param),
    });
  };

  const useUpdateMyinfoMutation = () => {
    return useMutation({
      mutationFn: (param: UpdateMyinfoRequest) => updateMyinfo(param),
    });
  };

  const useCreateInquiryMutation = () => {
    return useMutation({
      mutationFn: (param: CreateInquiryRequest) => createInquiry(param),
    });
  };

  const useGetInquiryListQuery = (
    payload: InquiryListSearchRequest,
    options?: UseQueryOptionsType
  ) =>
    useQuery({
      queryKey: ['inquiryList', payload],
      queryFn: () => getInquiryList(payload),
      ...options,
    });

  return {
    useProfileImageUploadMutation,
    useTempImageUploadMutation,
    useUpdateMyinfoMutation,
    useCreateInquiryMutation,
    useGetInquiryListQuery,
  };
};

export default useMypageService;
