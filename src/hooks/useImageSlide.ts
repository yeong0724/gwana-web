import { useState } from 'react';

const useImageSlide = () => {
  const [imageSlideOpen, setImageSlideOpen] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const handleImageModalOpen = (images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
    setImageSlideOpen(true);
  };

  return {
    imageSlideOpen,
    setImageSlideOpen,
    selectedImages,
    selectedImageIndex,
    handleImageModalOpen,
  };
};

export default useImageSlide;
