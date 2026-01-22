'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
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

import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
  className?: string;
}

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
        'size-9 text-gray-600',
        // PC (lg 이상)
        'lg:size-8',
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
  return <div className="mx-1 h-5 w-px bg-gray-200 lg:mx-1.5 lg:h-4" />;
}

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  isMobile?: boolean;
}

function ColorPicker({ currentColor, onColorChange, isMobile = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="글자색"
        className={cn(
          'flex items-center justify-center gap-0.5 rounded-md transition-all duration-200',
          isMobile ? 'size-9 text-gray-600' : 'h-8 px-2 text-gray-600',
          'hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
        )}
      >
        <Palette className={isMobile ? 'size-5' : 'size-4'} />
        <div
          className={cn('rounded-sm', isMobile ? 'h-4 w-4' : 'h-0.5 w-3')}
          style={{ backgroundColor: currentColor || '#000000' }}
        />
        {!isMobile && <ChevronDown className="size-3" />}
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg w-[180px]',
            'left-0'
          )}
        >
          <div className="grid grid-cols-5 gap-2">
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

export default function TiptapEditor({
  value,
  onChange,
  placeholder = '문의 내용을 상세하게 작성해 주세요.',
  minHeight = '200px',
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2 hover:text-primary/80',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-3',
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
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editor) {
        // 파일을 Base64로 변환하여 삽입 (실제 서비스에서는 서버 업로드 후 URL 사용)
        const reader = new FileReader();
        reader.onload = () => {
          const url = reader.result as string;
          editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      }
    },
    [editor]
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
      if (color) {
        editor.chain().focus().setColor(color).run();
      } else {
        editor.chain().focus().unsetColor().run();
      }
    },
    [editor]
  );

  if (!editor) return null;

  const currentColor = editor.getAttributes('textStyle').color || '';

  return (
    <div className="tiptap-editor overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
      {/* 툴바 - PC 버전 */}
      <div className="hidden border-b border-gray-100 bg-gray-50/80 px-3 py-2 lg:block">
        <div className="flex items-center gap-0.5">
          {/* 텍스트 서식 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="굵게 (Ctrl+B)"
          >
            <Bold className="size-4" strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="기울임 (Ctrl+I)"
          >
            <Italic className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="밑줄 (Ctrl+U)"
          >
            <UnderlineIcon className="size-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* 글자색 */}
          <ColorPicker currentColor={currentColor} onColorChange={setColor} />

          <ToolbarDivider />

          {/* 목록 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="글머리 기호 목록"
          >
            <List className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="번호 매기기 목록"
          >
            <ListOrdered className="size-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* 링크 & 이미지 */}
          <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="링크 추가">
            <Link2 className="size-4" />
          </ToolbarButton>
          {editor.isActive('link') && (
            <ToolbarButton onClick={removeLink} title="링크 제거">
              <Unlink className="size-4" />
            </ToolbarButton>
          )}
          <ToolbarButton onClick={() => fileInputRef.current?.click()} title="이미지 첨부">
            <ImagePlus className="size-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* 툴바 - 모바일 버전 (lg 미만) */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-2 py-2 lg:hidden">
        <div className="flex items-center gap-0.5">
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

          {/* 글자색 */}
          <ColorPicker currentColor={currentColor} onColorChange={setColor} isMobile />

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
        </div>

        <div className="flex items-center gap-0.5">
          {/* 링크 & 이미지 */}
          <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="링크">
            <Link2 className="size-5" />
          </ToolbarButton>
          {editor.isActive('link') && (
            <ToolbarButton onClick={removeLink} title="링크 제거">
              <Unlink className="size-5" />
            </ToolbarButton>
          )}
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            title="이미지"
            className="text-primary"
          >
            <ImagePlus className="size-5" />
          </ToolbarButton>
        </div>
      </div>

      {/* 에디터 본문 */}
      <EditorContent
        editor={editor}
        className={cn(
          // 기본 스타일
          '[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:outline-none',
          'lg:[&_.ProseMirror]:px-5 lg:[&_.ProseMirror]:py-4 lg:[&_.ProseMirror]:text-base',
          // 리스트 스타일 - 강제 적용
          '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2',
          '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2',
          '[&_.ProseMirror_li]:my-1'
        )}
        style={{ minHeight }}
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
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-3 py-2 lg:hidden">
        <p className="text-xs text-gray-400">이미지는 최대 5MB까지 첨부 가능합니다</p>
      </div>
    </div>
  );
}
