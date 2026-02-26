import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import {
  createInquiry,
  createReview,
  getInquiry,
  getInquiryList,
  getReviewList,
  updateMyinfo,
  uploadImages,
  uploadProfileImage,
  uploadTempImage,
} from '@/api/mypage';
import {
  CreateInquiryRequest,
  InquiryListSearchRequest,
  InquirySearchRequest,
  ReviewCreateRequest,
  ReviewListSearchRequest,
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

  const useImagesUploadMutation = () => {
    return useMutation({
      mutationFn: (param: FormData) => uploadImages(param),
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

  const useGetInquiryListInfiniteQuery = (
    payload: Omit<InquiryListSearchRequest, 'page'>,
    options?: UseQueryOptionsType
  ) =>
    useInfiniteQuery({
      queryKey: ['inquiryList', payload],
      queryFn: ({ pageParam = 0 }) => getInquiryList({ ...payload, page: pageParam, size: 10 }),
      getNextPageParam: (lastPage) => (lastPage.data.hasNext ? lastPage.data.page + 1 : undefined),
      initialPageParam: 0,
      ...options,
    });

  const useGetInquiryQuery = (payload: InquirySearchRequest, options?: UseQueryOptionsType) =>
    useQuery({
      queryKey: ['inquiry', payload],
      queryFn: () => getInquiry(payload),
      ...options,
    });

  const useCreateReviewMutation = () => {
    return useMutation({
      mutationFn: (param: ReviewCreateRequest) => createReview(param),
    });
  };

  const useGetReviewListInfiniteQuery = (
    payload: Omit<ReviewListSearchRequest, 'page'>,
    queryKey: string,
    options?: UseQueryOptionsType
  ) =>
    useInfiniteQuery({
      queryKey: ['reviewList', queryKey, payload],
      queryFn: ({ pageParam = 0 }) => getReviewList({ ...payload, page: pageParam }),
      getNextPageParam: ({ data }) => (data.hasNext ? data.page + 1 : undefined),
      initialPageParam: 0,
      ...options,
    });

  return {
    useProfileImageUploadMutation,
    useTempImageUploadMutation,
    useImagesUploadMutation,
    useUpdateMyinfoMutation,
    useCreateInquiryMutation,
    useGetInquiryListInfiniteQuery,
    useGetInquiryQuery,
    useCreateReviewMutation,
    useGetReviewListInfiniteQuery,
  };
};

export default useMypageService;
