import { useMutation } from '@tanstack/react-query';

import { updateMyinfo, uploadProfileImage } from '@/api/mypage';
import { UpdateMyinfoRequest } from '@/types';

const useMypageService = () => {
  const useProfileImageUploadMutation = () => {
    return useMutation({
      mutationFn: (param: FormData) => uploadProfileImage(param),
    });
  };

  const useUpdateMyinfoMutation = () => {
    return useMutation({
      mutationFn: (param: UpdateMyinfoRequest) => updateMyinfo(param),
    });
  };

  return {
    useProfileImageUploadMutation,
    useUpdateMyinfoMutation,
  };
};

export default useMypageService;
