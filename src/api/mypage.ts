import { postAxios } from "@/lib/api";
import { ApiResponse, UpdateMyinfoRequest, UpdateMyinfoResponse } from "@/types";

const uploadProfileImage = async (params: FormData) => {
  return postAxios<ApiResponse<string>>({
    url: '/mypage/upload/profile-image',
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

export { uploadProfileImage, updateMyinfo };