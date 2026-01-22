'use client';

import { useState } from 'react';

import TiptapEditor from '@/components/common/editor';
import { Input } from '@/components/ui/input';
import { validateByType } from '@/lib/utils';
import { useAlertStore } from '@/stores';

const InquiryWriteContainer = () => {
  const { showAlert } = useAlertStore();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = () => {
    if (!title || title.trim().length < 2) {
      showAlert({
        title: '안내',
        description: '제목을 2자 이상 입력해주세요.',
      });
      return;
    }

    if (!content || content.trim().length < 10) {
      showAlert({
        title: '안내',
        description: '문의내용을 10자 이상 입력해주세요.',
      });
      return;
    }

    console.log('제목 :', { title, content });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    if (validateByType(value, 'alphanumericWithSymbols')) {
      setTitle(value.slice(0, 20));
    }
  };

  return (
    <div className="flex h-[calc(100dvh-60px)] flex-col overflow-hidden">
      {/* 제목 입력 영역 */}
      <div className="flex shrink-0 items-center gap-2 border-x border-t border-gray-200 bg-white px-4 py-2.5">
        <Input
          type="text"
          placeholder="제목 (20자 이내)"
          value={title}
          onChange={(event) => handleTitleChange(event)}
          className="h-8 flex-1 border-none p-0 text-base lg:text-[18px] shadow-none focus-visible:ring-0"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="shrink-0 rounded-md border border-gray-300 bg-transparent px-4 py-1.5 text-sm lg:text-[17px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          제출
        </button>
      </div>

      {/* 에디터 - 남은 공간을 채움 */}
      <div className="min-h-0 flex-1">
        <TiptapEditor value={content} onChange={setContent} />
      </div>
    </div>
  );
};

export default InquiryWriteContainer;
