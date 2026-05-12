import { postAxios } from '@/lib/api';
import {
  ApiResponse,
  CreateInquiryRequest,
  InfiniteResponse,
  Inquiry,
  InquiryListSearchRequest,
  InquirySearchRequest,
  Review,
  ReviewCreateRequest,
  ReviewListSearchRequest,
  UpdateMyinfoRequest,
  UpdateMyinfoResponse,
} from '@/types';

const uploadProfileImage = async (params: FormData) => {
  return postAxios<ApiResponse<string>>({
    url: '/mypage/upload/profile-image',
    params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const uploadTempImage = async (params: FormData) => {
  return postAxios<ApiResponse<string>>({
    url: '/mypage/upload/temp-image',
    params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const uploadImages = async (params: FormData) => {
  return postAxios<ApiResponse<string[]>>({
    url: '/mypage/upload/images',
    params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const updateMyinfo = async (params: UpdateMyinfoRequest) => {
  return postAxios<ApiResponse<UpdateMyinfoResponse>>({
    url: '/mypage/update/myinfo',
    params,
  });
};

const createInquiry = async (params: CreateInquiryRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/mypage/inquiry/create',
    params,
  });
};

const getInquiryList = async (params: InquiryListSearchRequest) => {
  return postAxios<ApiResponse<InfiniteResponse<Inquiry[]>>>({
    url: '/mypage/inquiry/list/search',
    params,
  });
};

const getInquiry = async (params: InquirySearchRequest) => {
  return postAxios<ApiResponse<Inquiry>>({
    url: '/mypage/inquiry/search',
    params,
  });
};

const createReview = async (params: ReviewCreateRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/mypage/review/create',
    params,
  });
};

const getReviewList = async (params: ReviewListSearchRequest) => {
  return postAxios<ApiResponse<InfiniteResponse<Review[]>>>({
    url: '/mypage/review/list/search',
    params,
  });
};

export {
  uploadProfileImage,
  uploadTempImage,
  updateMyinfo,
  createInquiry,
  getInquiryList,
  getInquiry,
  uploadImages,
  createReview,
  getReviewList,
};
