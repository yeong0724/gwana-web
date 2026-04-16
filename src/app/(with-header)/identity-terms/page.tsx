import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '본인확인 서비스 이용약관 | 관아수제차',
  description: '관아수제차 본인확인 서비스 이용약관',
};

export default function IdentityTermsPage() {
  return (
    <main className="min-h-[100dvh] bg-warm-50">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        <header className="mb-10 md:mb-14">
          <p className="text-caption font-medium uppercase tracking-wide text-tea-600 mb-2">
            Identity Verification
          </p>
          <h1 className="text-heading-1 md:text-display font-bold tracking-display text-brand-800 leading-tight">
            본인확인 서비스 이용약관
          </h1>
          <div className="mt-4 h-px bg-gradient-to-r from-brand-300/60 to-transparent" />
        </header>

        <article className="space-y-8 text-body text-warm-700 leading-relaxed">
          <Section title="수집하는 개인정보 항목">
            <p>
              이름, 생년월일, 성별, 휴대전화번호, 통신사, 내외국인 여부,
              연계정보(CI), 중복가입확인정보(DI)
            </p>
          </Section>

          <Section title="수집 및 이용목적">
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-warm-600">
              <li>실명 확인 및 부정가입 방지</li>
              <li>만 14세 미만 아동 회원가입 제한</li>
              <li>중복가입 확인</li>
              <li>이용자 식별 및 본인 여부 확인</li>
            </ul>
          </Section>

          <Section title="보유 및 이용기간">
            <p>
              회원 탈퇴 시까지 보관하며, 탈퇴 시 지체 없이 파기합니다.
            </p>
          </Section>

          <Section title="본인확인기관">
            <p>
              (주)다날을 통해 본인확인이 이루어지며, 본인확인 서비스의 중계
              역할을 수행합니다.
            </p>
          </Section>

          <Section title="동의 거부 권리 및 불이익">
            <p>
              귀하는 본 동의를 거부할 권리가 있으며, 동의 거부 시 회원가입이
              제한될 수 있습니다. 본인확인은 관계법령에 따른 본인 식별을 위한 필수
              절차입니다.
            </p>
          </Section>
        </article>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-heading-3 font-bold text-brand-800 mb-3 flex items-center gap-2">
        <span className="inline-block w-1 h-5 rounded-full bg-tea-500" />
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
