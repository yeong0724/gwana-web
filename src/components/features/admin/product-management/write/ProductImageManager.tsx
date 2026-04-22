'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical, ImagePlus, X } from 'lucide-react';

// import { AWS_S3_DOMAIN } from '@/constants/env';

type Props = {
  title: string;
  description?: string;
  images: string[];
  onReorder: (images: string[], name: 'images' | 'infos') => void;
  onRemove: (imageUrl: string, name: 'images' | 'infos') => void;
  onUpload: (file: File, folderPath: string, name: 'images' | 'infos') => void;
  isUploading?: boolean;
  folderPath: string;
  name: 'images' | 'infos';
};

const ProductImageManager = ({
  title,
  description,
  images,
  onReorder,
  onRemove,
  onUpload,
  isUploading,
  folderPath,
  name,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftImages, setDraftImages] = useState<string[]>(images);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!isDraggingRef.current) {
      setDraftImages(images);
    }
  }, [images]);

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    onReorder(draftImages, name);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, folderPath, name);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-warm-900">{title}</h3>
            <span className="font-mono text-xs tabular-nums text-warm-500">
              {images.length.toString().padStart(2, '0')}
            </span>
          </div>
          {description && <p className="text-xs text-warm-500">{description}</p>}
        </div>
        <p className="text-xs text-warm-500">드래그로 순서 변경</p>
      </div>

      <button
        type="button"
        onClick={handleUploadClick}
        disabled={isUploading}
        className="group relative flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-warm-300 bg-warm-50 px-4 py-6 text-sm font-medium text-warm-600 transition-all hover:border-warm-500 hover:bg-warm-100 hover:text-warm-900 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ImagePlus className="size-4" strokeWidth={1.5} />
        <span>{isUploading ? '업로드 중…' : '이미지 추가'}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {draftImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-warm-200 bg-warm-50">
            <ImagePlus className="size-5 text-warm-400" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-warm-700">등록된 이미지가 없습니다</p>
          <p className="text-xs text-warm-500">상단 버튼으로 이미지를 추가하세요</p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={draftImages}
          onReorder={setDraftImages}
          className="flex flex-col gap-2"
        >
          {draftImages.map((imageUrl, index) => (
            <ImageRow
              key={imageUrl}
              imageUrl={imageUrl}
              index={index}
              name={name}
              onRemove={onRemove}
              onDragStart={() => {
                isDraggingRef.current = true;
              }}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

type ImageRowProps = {
  imageUrl: string;
  index: number;
  name: 'images' | 'infos';
  onRemove: (imageUrl: string, name: 'images' | 'infos') => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

const ImageRow = memo(function ImageRow({
  imageUrl,
  index,
  name,
  onRemove,
  onDragStart,
  onDragEnd,
}: ImageRowProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={imageUrl}
      dragListener={false}
      dragControls={controls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileDrag={{
        scale: 1.01,
        boxShadow: '0 14px 28px -12px rgba(0,0,0,0.16)',
        zIndex: 10,
      }}
      className="group flex items-center gap-3 rounded-xl border border-warm-200 bg-white p-2 pr-3"
    >
      <button
        type="button"
        onPointerDown={(event) => controls.start(event)}
        className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-700 active:cursor-grabbing"
        aria-label="순서 변경"
      >
        <GripVertical className="size-4" strokeWidth={1.5} />
      </button>

      <span className="font-mono text-[11px] tabular-nums tracking-wider text-warm-500 uppercase">
        #{(index + 1).toString().padStart(2, '0')}
      </span>

      <div className="relative h-44 w-60 shrink-0 overflow-hidden rounded-md border border-warm-200 bg-warm-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          // src={`${AWS_S3_DOMAIN}${imageUrl}`}
          src={imageUrl}
          alt={`product-image-${index + 1}`}
          className="size-full object-contain"
          draggable={false}
        />
      </div>

      <div className="min-w-0 flex-1" />

      <button
        type="button"
        onClick={() => onRemove(imageUrl, name)}
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-warm-400 transition-colors hover:bg-warm-900 hover:text-white active:translate-y-[1px]"
        aria-label="이미지 삭제"
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>
    </Reorder.Item>
  );
});

export default memo(ProductImageManager);
