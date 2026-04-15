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
  Inquiry,
  InquiryListSearchRequest,
  InquirySearchRequest,
  Review,
  ReviewCreateRequest,
  ReviewListSearchRequest,
  UpdateMyinfoRequest,
  UseInfiniteQueryCustomOptions,
  UseQueryCustomOptions,
  UseQueryOptionsType,
} from '@/types';

const useMypageService = () => {
  const useProfileImageUploadMutation = (options?: UseQueryOptionsType) => {
    return useMutation({
      mutationFn: (param: FormData) => uploadProfileImage(param),
      ...options,
    });
  };

  const useTempImageUploadMutation = (options?: UseQueryOptionsType) => {
    return useMutation({
      mutationFn: (param: FormData) => uploadTempImage(param),
      ...options,
    });
  };

  const useImagesUploadMutation = (options?: UseQueryOptionsType) => {
    return useMutation({
      mutationFn: (param: FormData) => uploadImages(param),
      ...options,
    });
  };

  const useUpdateMyinfoMutation = (options?: UseQueryOptionsType) => {
    return useMutation({
      mutationFn: (param: UpdateMyinfoRequest) => updateMyinfo(param),
      ...options,
    });
  };

  const useCreateInquiryMutation = (options?: UseQueryOptionsType) => {
    return useMutation({
      mutationFn: (param: CreateInquiryRequest) => createInquiry(param),
      ...options,
    });
  };

  const useGetInquiryListInfiniteQuery = (
    payload: Omit<InquiryListSearchRequest, 'page'>,
    options?: UseInfiniteQueryCustomOptions<Inquiry[]>
  ) => {
    return useInfiniteQuery({
      queryKey: ['inquiryList', payload],
      queryFn: ({ pageParam = 0 }) => getInquiryList({ ...payload, page: pageParam, size: 10 }),
      getNextPageParam: (lastPage) => (lastPage.data.hasNext ? lastPage.data.page + 1 : undefined),
      initialPageParam: 0,
      ...options,
    });
  };

  const useGetInquiryQuery = (
    payload: InquirySearchRequest,
    options?: UseQueryCustomOptions<Inquiry>
  ) => {
    return useQuery({
      queryKey: ['inquiry', payload],
      queryFn: () => getInquiry(payload),
      ...options,
    });
  };

  const useCreateReviewMutation = (options?: UseQueryOptionsType) => {
    return useMutation({
      mutationFn: (param: ReviewCreateRequest) => createReview(param),
      ...options,
    });
  };

  const useGetReviewListInfiniteQuery = (
    payload: Omit<ReviewListSearchRequest, 'page'>,
    queryKey: string,
    options?: UseInfiniteQueryCustomOptions<Review[]>
  ) => {
    return useInfiniteQuery({
      queryKey: ['reviewList', queryKey, payload],
      queryFn: ({ pageParam = 0 }) => getReviewList({ ...payload, page: pageParam }),
      getNextPageParam: ({ data }) => (data.hasNext ? data.page + 1 : undefined),
      initialPageParam: 0,
      ...options,
    });
  };

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
