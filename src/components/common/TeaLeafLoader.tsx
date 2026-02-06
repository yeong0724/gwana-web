import Image from 'next/image';

interface TeaLeafLoaderProps {
  variant?: 'default' | 'smooth' | 'fast' | 'wobble';
  size?: number;
  showShadow?: boolean;
  showText?: boolean;
  text?: string;
}

const TeaLeafLoader = ({
  variant = 'default',
  size = 56,
  showShadow = false,
  showText = false,
  text = '불러오는 중...',
}: TeaLeafLoaderProps) => {
  const animationClass = {
    default: 'animate-spin-y',
    smooth: 'animate-spin-smooth',
    fast: 'animate-spin-fast',
    wobble: 'animate-spin-wobble',
  }[variant];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center" style={{ perspective: '500px' }}>
        <Image
          src="/images/leaf.webp"
          alt="loading"
          width={size}
          height={size}
          className={animationClass}
          style={{ transformStyle: 'preserve-3d' }}
        />
        {showShadow && (
          <div
            className="mt-2 rounded-full bg-black/10 animate-shadow-pulse"
            style={{
              width: size * 0.7,
              height: size * 0.15,
            }}
          />
        )}
      </div>
      {showText && (
        <span className="text-sm text-green-700 tracking-wide animate-text-fade">{text}</span>
      )}
    </div>
  );
};

export default TeaLeafLoader;
