'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Extension } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  ALargeSmall,
  Bold,
  ChevronDown,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Palette,
  Underline as UnderlineIcon,
  Unlink,
} from 'lucide-react';
import FontSize from 'tiptap-extension-font-size';
import ImageResize from 'tiptap-extension-resize-image';

import { AWS_S3_DOMAIN } from '@/constants';
import { cn, compressImage } from '@/lib/utils';
import { useMypageService } from '@/service';
import { useAlertStore } from '@/stores';
import { ResultCode } from '@/types';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
  className?: string;
}

// 폰트 크기 옵션
const FONT_SIZES = [
  { name: '작게', value: '12px' },
  { name: '기본', value: '14px' },
  { name: '중간', value: '16px' },
  { name: '크게', value: '18px' },
  { name: '아주 크게', value: '24px' },
];

// 소셜커머스에서 자주 쓰이는 색상 팔레트
const COLOR_PALETTE = [
  { name: '검정', value: '#000000' },
  { name: '진회색', value: '#374151' },
  { name: '빨강', value: '#DC2626' },
  { name: '주황', value: '#EA580C' },
  { name: '노랑', value: '#CA8A04' },
  { name: '초록', value: '#16A34A' },
  { name: '파랑', value: '#2563EB' },
  { name: '보라', value: '#7C3AED' },
  { name: '핑크', value: '#DB2777' },
];

function ToolbarButton({
  onClick,
  isActive = false,
  children,
  title,
  className,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'flex items-center justify-center rounded-md transition-all duration-200',
        // 모바일 (lg 미만)
        'size-8 text-gray-600',
        // PC (lg 이상)
        'lg:size-10',
        // 공통 호버/활성 상태
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200',
        className
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-[1.5px] h-5 w-px bg-gray-200 lg:mx-1.5 lg:h-4" />;
}

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  isMobile?: boolean;
}

function ColorPicker({ currentColor, onColorChange, isMobile = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        title="글자색"
        className={cn(
          'flex items-center justify-center gap-0.5 rounded-md transition-all duration-200',
          'h-8 px-2 text-gray-600',
          'hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
        )}
      >
        <Palette className={isMobile ? 'size-5' : 'size-6'} />
        <div
          className={cn('rounded-sm', 'mx-1 h-5 w-6')}
          style={{ backgroundColor: currentColor || '#000000' }}
        />
        <ChevronDown className="size-3" />
      </button>

      {isOpen && (
        <div
          className="fixed z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-lg w-fit"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          <div className="grid w-max grid-cols-5 gap-2">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.name}
                onClick={() => {
                  onColorChange(color.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'size-7 rounded-md border-2 transition-transform hover:scale-110',
                  currentColor === color.value ? 'border-primary' : 'border-transparent'
                )}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
          {/* 색상 초기화 버튼 */}
          <button
            type="button"
            onClick={() => {
              onColorChange('');
              setIsOpen(false);
            }}
            className="mt-2 w-full rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
          >
            기본 색상으로
          </button>
        </div>
      )}
    </div>
  );
}

interface FontSizePickerProps {
  currentSize: string;
  onSizeChange: (size: string) => void;
  isMobile?: boolean;
}

function FontSizePicker({ currentSize, onSizeChange, isMobile = false }: FontSizePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const MAX_FONT_SIZE = 72;
  const MIN_FONT_SIZE = 8;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 현재 크기에서 숫자만 추출해서 표시
  const currentSizeNumber = currentSize ? parseInt(currentSize.replace('px', '')) : '';
  const displaySize = currentSizeNumber || '기본';

  const handleCustomSizeSubmit = () => {
    const size = parseInt(customSize);
    const fontSize =
      size > MAX_FONT_SIZE ? MAX_FONT_SIZE : size < MIN_FONT_SIZE ? MIN_FONT_SIZE : size;
    onSizeChange(`${fontSize}px`);
    setIsOpen(false);
    setCustomSize('');
  };

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        title="글자 크기"
        className={cn(
          'flex items-center justify-center gap-0.5 rounded-md transition-all duration-200',
          'h-8 px-2 text-gray-600',
          'hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
        )}
      >
        <ALargeSmall className={isMobile ? 'size-5' : 'size-7'} />
        <span className="min-w-[28px] text-center text-[18px] px-[4px]">{displaySize}</span>
        <ChevronDown className={isMobile ? 'size-3' : 'size-5'} />
      </button>

      {isOpen && (
        <div
          className="fixed z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-lg w-fit"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          <div className="flex w-max flex-col gap-1">
            {/* 직접 입력 */}
            <div className="flex items-center gap-1 pb-1 border-b border-gray-100">
              <input
                type="number"
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
                placeholder="px"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomSizeSubmit();
                  }
                }}
                className="w-16 rounded border border-gray-200 px-2 py-1 text-[16px] focus:border-primary focus:outline-none"
              />
              {/* <span className="text-[15px] text-gray-400 mr-[4px]">px</span> */}
              <button
                type="button"
                onClick={handleCustomSizeSubmit}
                className="rounded bg-primary ml-1 h-8 w-12 text-[14px] text-white hover:bg-primary/90"
              >
                적용
              </button>
            </div>

            {/* 프리셋 버튼들 */}
            <div className="flex flex-wrap gap-2 pt-1">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => {
                    onSizeChange(size.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs transition-colors text-[15px]',
                    currentSize === size.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  )}
                >
                  {size.value.replace('px', '')}
                </button>
              ))}
            </div>

            {/* 크기 초기화 버튼 */}
            <button
              type="button"
              onClick={() => {
                onSizeChange('');
                setIsOpen(false);
              }}
              className="mt-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
            >
              기본 크기로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 이미지 최대 용량 (2MB)
const MAX_IMAGE_SIZE = 5;
const MAX_TOTAL_IMAGE_SIZE = 10;

// Base64 문자열의 바이트 크기 계산
const getBase64Size = (base64String: string): number => {
  const base64Data = base64String.split(',')[1] || base64String;
  const padding = (base64Data.match(/=/g) || []).length;
  return Math.floor((base64Data.length * 3) / 4) - padding;
};

// 에디터 HTML에서 모든 Base64 이미지의 총 용량 계산
const calculateTotalImageSize = (html: string): number => {
  const imgRegex = /<img[^>]+src="(data:image[^"]+)"[^>]*>/g;
  let totalSize = 0;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    totalSize += getBase64Size(match[1]);
  }
  return totalSize;
};

export default function TiptapEditor({
  value,
  onChange,
  placeholder = '내용을 상세하게 작성해 주세요.',
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showConfirmAlert, showAlert } = useAlertStore();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFontSize, setSelectedFontSize] = useState<string>('');
  const [totalImageSize, setTotalImageSize] = useState<number>(0);
  // 한글 IME 조합 중인지 추적하는 ref (조합 중 setContent 방지)
  const isComposingRef = useRef<boolean>(false);

  const { useTempImageUploadMutation } = useMypageService();
  const { mutateAsync: uploadTempImage } = useTempImageUploadMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'tiptap-bullet-list',
            style: 'list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'tiptap-ordered-list',
            style: 'list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0;',
          },
        },
        listItem: {
          HTMLAttributes: {
            style: 'display: list-item; margin: 0.25rem 0;',
          },
        },
      }),
      Underline,
      TextStyle,
      FontSize as Extension,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2 hover:text-primary/80',
        },
      }),
      ImageResize.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          style: 'max-width: 100%; height: auto; display: block; margin: 12px 0;',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      // 이미지 추가/삭제 시 총 용량 재계산
      const newTotalSize = calculateTotalImageSize(html);
      setTotalImageSize(newTotalSize);
    },
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
      handleDOMEvents: {
        // 한글 IME 조합 시작/종료 이벤트 핸들링
        compositionstart: () => {
          isComposingRef.current = true;
          return false;
        },
        compositionend: () => {
          isComposingRef.current = false;
          return false;
        },
      },
    },
  });

  useEffect(() => {
    // 한글 IME 조합 중에는 setContent를 호출하지 않음 (조합이 끊어지는 문제 방지)
    if (editor && value !== editor.getHTML() && !isComposingRef.current) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editor) {
        const compressedFile = await compressImage(file, { maxWidth: 1024, quality: 0.85 });

        const uploadFileSize = compressedFile.size;

        // 이미지 용량 체크
        if (uploadFileSize > MAX_IMAGE_SIZE * 1024 * 1024) {
          await showConfirmAlert({
            title: '안내',
            description: `이미지는 장당 ${MAX_IMAGE_SIZE}MB까지 첨부 가능합니다`,
          });
          e.target.value = '';
          return;
        }

        // 누적 이미지 총 용량 체크
        if (totalImageSize + uploadFileSize > MAX_TOTAL_IMAGE_SIZE * 1024 * 1024) {
          await showConfirmAlert({
            title: '안내',
            description: `문의글 이미지 총 용량은 ${MAX_TOTAL_IMAGE_SIZE}MB를 초과할 수 없습니다`,
          });
          e.target.value = '';
          return;
        }

        // S3 업로드
        const formData = new FormData();
        formData.append('image', compressedFile);
        formData.append('folderPath', 'temp/inquiry');

        const { data, code, message } = await uploadTempImage(formData);
        if (code !== ResultCode.SUCCESS) {
          showAlert({
            title: '안내',
            description: message || '이미지 업로드 중 오류가 발생하였습니다.',
          });
          e.target.value = '';
          return;
        }

        const imageUrl = `${AWS_S3_DOMAIN}${data}`;

        // 이미지 원본 크기 가져와서 25%로 축소
        const img = new window.Image();
        img.onload = () => {
          const scaledWidth = Math.round(img.naturalWidth * 0.25);
          editor
            .chain()
            .focus()
            .setImage({
              src: imageUrl,
              alt: file.name,
              title: file.name,
            })
            .run();

          setTimeout(() => {
            const imgElements = editor.view.dom.querySelectorAll('img');
            const lastImg = imgElements[imgElements.length - 1];
            if (lastImg) {
              lastImg.style.width = `${scaledWidth}px`;
              lastImg.style.maxWidth = '100%';
              lastImg.style.height = 'auto';
              lastImg.style.margin = '12px 0';
              lastImg.style.display = 'block';
            }
          }, 0);
        };

        img.src = imageUrl;
        e.target.value = '';
      }
    },
    [editor, showConfirmAlert, totalImageSize]
  );

  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = prompt('링크 URL을 입력하세요', previousUrl || 'https://');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const setColor = useCallback(
    (color: string) => {
      if (!editor) return;
      setSelectedColor(color);
      if (color) {
        editor.chain().focus().setColor(color).run();
      } else {
        editor.chain().focus().unsetColor().run();
      }
    },
    [editor]
  );

  const setFontSize = useCallback(
    (fontSize: string) => {
      if (!editor) return;
      setSelectedFontSize(fontSize);
      if (fontSize) {
        editor.chain().focus().setFontSize(fontSize).run();
      } else {
        editor.chain().focus().unsetFontSize().run();
      }
    },
    [editor]
  );

  if (!editor) return null;

  const editorColor = editor.getAttributes('textStyle').color || '';
  const currentColor = selectedColor || editorColor;
  const editorFontSize = editor.getAttributes('textStyle').fontSize || '';
  const currentFontSize = selectedFontSize || editorFontSize;

  return (
    <div className="tiptap-editor flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-200">
      {/* 툴바 - PC 버전 */}
      <div className="hidden shrink-0 border-b border-gray-100 bg-gray-50/80 px-3 py-2 lg:block overflow-x-auto">
        <div className="flex items-center gap-0.5">
          {/* 글자색 */}
          <ColorPicker currentColor={currentColor} onColorChange={setColor} />
          <ToolbarDivider />
          {/* 글자 크기 */}
          <FontSizePicker currentSize={currentFontSize} onSizeChange={setFontSize} />
          <ToolbarDivider />
          <ToolbarButton onClick={() => fileInputRef.current?.click()} title="이미지 첨부">
            <ImagePlus className="size-6" />
          </ToolbarButton>
          <ToolbarDivider />
          {/* 텍스트 서식 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="굵게 (Ctrl+B)"
          >
            <Bold className="size-6" strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="기울임 (Ctrl+I)"
          >
            <Italic className="size-6" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="밑줄 (Ctrl+U)"
          >
            <UnderlineIcon className="size-6" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* 목록 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="글머리 기호 목록"
          >
            <List className="size-6" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="번호 매기기 목록"
          >
            <ListOrdered className="size-6" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* 링크 & 이미지 */}
          <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="링크 추가">
            <Link2 className="size-6" />
          </ToolbarButton>
          {editor.isActive('link') && (
            <ToolbarButton onClick={removeLink} title="링크 제거">
              <Unlink className="size-6" />
            </ToolbarButton>
          )}
        </div>
      </div>

      {/* 툴바 - 모바일 버전 (lg 미만) */}
      <div className="shrink-0 overflow-x-auto border-b border-gray-100 bg-gray-50/80 px-2 py-2 lg:hidden">
        <div className="flex w-max items-center gap-0.5">
          {/* 글자색 */}
          <ColorPicker currentColor={currentColor} onColorChange={setColor} isMobile />

          {/* 글자 크기 */}
          <FontSizePicker currentSize={currentFontSize} onSizeChange={setFontSize} isMobile />
          <ToolbarDivider />
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            title="이미지"
            className="text-primary"
          >
            <ImagePlus className="size-5" />
          </ToolbarButton>
          <ToolbarDivider />
          {/* 텍스트 서식 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="굵게"
          >
            <Bold className="size-5" strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="기울임"
          >
            <Italic className="size-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="밑줄"
          >
            <UnderlineIcon className="size-5" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* 목록 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="글머리 기호"
          >
            <List className="size-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="번호 목록"
          >
            <ListOrdered className="size-5" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* 링크 & 이미지 */}
          <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="링크">
            <Link2 className="size-5" />
          </ToolbarButton>
          {editor.isActive('link') && (
            <ToolbarButton onClick={removeLink} title="링크 제거">
              <Unlink className="size-5" />
            </ToolbarButton>
          )}
        </div>
      </div>

      {/* 에디터 본문 */}
      <EditorContent
        editor={editor}
        className={cn(
          // 스크롤 가능하도록 설정 (flex-1로 남은 공간 채우고, min-h-0으로 shrink 허용)
          'min-h-0 flex-1 overflow-y-auto',
          // 기본 스타일
          '[&_.ProseMirror]:h-full [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:outline-none',
          'lg:[&_.ProseMirror]:px-5 lg:[&_.ProseMirror]:py-4 lg:[&_.ProseMirror]:text-base',
          // 리스트 스타일 - 강제 적용
          '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2',
          '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2',
          '[&_.ProseMirror_li]:my-1'
        )}
      />

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* 하단 안내 - 모바일에서만 표시 */}
      {/* <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50/50 px-3 py-2 lg:hidden">
        <p className="text-xs text-gray-400">이미지는 최대 5MB까지 첨부 가능합니다</p>
      </div> */}
    </div>
  );
}
