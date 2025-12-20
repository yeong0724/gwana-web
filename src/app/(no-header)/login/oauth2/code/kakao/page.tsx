import KakaoRedirectContainer from '@/components/features/login/KakaoRedirectContainer';

interface Props {
  searchParams: Promise<{ code: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { code } = await searchParams;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <KakaoRedirectContainer code={code} />
      </div>
    </div>
  );
};

export default Page;
