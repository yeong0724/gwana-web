import { postAxios } from '@/lib/api';
import {
  ApiResponse,
  CreateInquiryRequest,
  Inquiry,
  InquiryListSearchRequest,
  InquirySearchRequest,
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

const updateMyinfo = async (params: UpdateMyinfoRequest) => {
  return postAxios<ApiResponse<UpdateMyinfoResponse>>({
    url: '/mypage/update/myinfo',
    params,
  });
};

const createInquiry = async (params: CreateInquiryRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/mypage/create/inquiry',
    params,
  });
};

const getInquiryList = async (params: InquiryListSearchRequest) => {
  return postAxios<ApiResponse<Inquiry[]>>({
    url: '/mypage/search/inquiry/list',
    params,
  });
};

const getInquiry = async (params: InquirySearchRequest) => {
  return postAxios<ApiResponse<Inquiry>>({
    url: '/mypage/search/inquiry',
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
};
