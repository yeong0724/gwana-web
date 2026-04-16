import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 관아수제차',
  description: '관아수제차 개인정보처리방침',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-[100dvh] bg-warm-50">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        {/* Header */}
        <header className="mb-10 md:mb-14">
          <p className="text-caption font-medium uppercase tracking-wide text-tea-600 mb-2">
            Privacy Policy
          </p>
          <h1 className="text-heading-1 md:text-display font-bold tracking-display text-brand-800 leading-tight">
            개인정보처리방침
          </h1>
          <div className="mt-4 h-px bg-gradient-to-r from-brand-300/60 to-transparent" />
        </header>

        {/* Content */}
        <article className="space-y-10 text-body text-warm-700 leading-relaxed">
          {/* 서문 */}
          <p className="text-body-lg text-warm-600 leading-relaxed">
            관아수제차는 (이하 &apos;회사&apos;는) 고객님의 개인정보를 중요시하며, &ldquo;정보통신망
            이용촉진 및 정보보호&rdquo;에 관한 법률을 준수하고 있습니다. 회사는 개인정보처리방침을
            통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며,
            개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
          </p>
          <p className="text-body-sm text-warm-500">
            회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할
            것입니다.
          </p>

          {/* 수집하는 개인정보 항목 */}
          <Section title="수집하는 개인정보 항목">
            <p>
              회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
            </p>
            <DefinitionList
              items={[
                {
                  term: '수집항목',
                  desc: '이름, 생년월일, 성별, 로그인ID, 비밀번호, 주소, 휴대전화번호, 이메일, 결제기록',
                },
                {
                  term: '개인정보 수집방법',
                  desc: '홈페이지(회원가입)',
                },
              ]}
            />
          </Section>

          {/* 개인정보의 수집 및 이용목적 */}
          <Section title="개인정보의 수집 및 이용목적">
            <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
            <ol className="list-decimal list-outside ml-5 space-y-2 mt-3">
              <li>
                <strong className="text-warm-800">사이트 회원 가입 및 관리</strong>
                <span className="text-warm-600">
                  {' '}
                  — 회원가입시 본인여부 확인, 서비스 이용 및 상담, 공지사항 전달, SNS 및 제3자
                  계정을 연계하여 간편로그인 서비스 제공
                </span>
              </li>
              <li>
                <strong className="text-warm-800">재화 또는 서비스 제공</strong>
                <span className="text-warm-600">
                  {' '}
                  — 물품배송, 서비스 제공, 콘텐츠 제공, 맞춤서비스 제공, 정산 및 환불
                </span>
              </li>
              <li>
                <strong className="text-warm-800">마케팅 및 광고</strong>
                <span className="text-warm-600">
                  {' '}
                  — 웹 페이지 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계, 이벤트 등 광고성
                  정보 전달
                </span>
              </li>
            </ol>
            <aside className="mt-4 rounded-lg bg-warm-100/60 border border-warm-200/50 px-4 py-3 text-body-sm text-warm-500">
              <p>
                * 회사의 서비스 이용 과정에서 서비스 이용기록, 방문기록, 불량 이용기록, IP 주소,
                쿠키, 광고식별자 등의 정보가 자동으로 생성되어 수집될 수 있습니다.
              </p>
              <p className="mt-1">
                * 진행하는 이벤트에 따라 수집 항목이 상이할 수 있으므로 응모 시 별도 동의를 받으며,
                목적 달성 즉시 파기합니다.
              </p>
            </aside>
          </Section>

          {/* 개인정보의 보유 및 이용기간 */}
          <Section title="개인정보의 보유 및 이용기간">
            <p>
              회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당 정보를 지체 없이
              파기합니다.
            </p>
          </Section>

          {/* 개인정보의 파기절차 및 방법 */}
          <Section title="개인정보의 파기절차 및 방법">
            <p>
              회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이
              파기합니다. 파기절차 및 방법은 다음과 같습니다.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-body font-semibold text-warm-800 mb-1">파기절차</h4>
                <p className="text-warm-600">
                  회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로
                  옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호
                  사유에 따라 일정 기간 저장된 후 파기되어집니다. 별도 DB로 옮겨진 개인정보는 법률에
                  의한 경우가 아니고서는 보유되어지는 이외의 다른 목적으로 이용되지 않습니다.
                </p>
              </div>
              <div>
                <h4 className="text-body font-semibold text-warm-800 mb-1">파기방법</h4>
                <p className="text-warm-600">
                  전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여
                  삭제합니다.
                </p>
              </div>
            </div>
          </Section>

          {/* 개인정보 제공 */}
          <Section title="개인정보 제공">
            <p>
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는
              예외로 합니다.
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1 mt-3 text-warm-600">
              <li>이용자들이 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의
                요구가 있는 경우
              </li>
            </ul>
          </Section>

          {/* 제3자에 대한 제공 및 위탁 */}
          <Section title="제3자에 대한 제공 및 수집한 개인정보의 위탁">
            <p>
              회사는 고객의 개인정보를 &lsquo;개인정보의 수집 및 이용목적&rsquo;에서 고지한 범위를
              넘어 이용하거나 타인 또는 타기업, 기관에 제공하지 않습니다. 다음은 예외로 합니다.
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1 mt-3 text-warm-600">
              <li>관계법령에 의하여 수사상의 목적으로 관계기관으로부터의 요구가 있을 경우</li>
              <li>
                통계작성, 학술연구나 시장조사 등을 위하여 특정 개인을 식별할 수 없는 형태로 광고주,
                협력사나 연구단체 등에 제공하는 경우
              </li>
              <li>기타 관계법령에서 정한 절차에 따른 요청이 있는 경우</li>
            </ul>

            <div className="mt-6">
              <h4 className="text-body font-semibold text-warm-800 mb-3">
                위탁업무 내용 및 수탁자
              </h4>
              <div className="overflow-hidden rounded-lg border border-warm-200/60">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="bg-warm-100/50">
                      <th className="px-4 py-2.5 text-left font-semibold text-warm-800">
                        위탁업무
                      </th>
                      <th className="px-4 py-2.5 text-left font-semibold text-warm-800">수탁자</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100">
                    <tr>
                      <td className="px-4 py-2.5 text-warm-600">주문 상품의 배송</td>
                      <td className="px-4 py-2.5 text-warm-700 font-medium">로젠 택배</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-warm-600">결제 서비스</td>
                      <td className="px-4 py-2.5 text-warm-700 font-medium">토스페이먼츠</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="mt-4 rounded-lg bg-warm-100/60 border border-warm-200/50 px-4 py-3 text-body-sm text-warm-500 space-y-1">
              <p>
                * 수탁자에 공유되는 정보는 당해 목적을 달성하기 위하여 필요한 최소한의 정보에
                국한됩니다.
              </p>
              <p>
                * 위탁 업체 리스트는 해당 서비스 변경 및 계약기간에 따라 변경될 수 있으며 변경 시
                공지사항을 통해 사전 공지합니다.
              </p>
            </aside>
          </Section>

          {/* 14세 미만 아동 */}
          <Section title="14세 미만 아동의 개인정보보호">
            <p>
              회사는 법정대리인의 동의가 필요한 만 14세 미만 아동의 회원가입은 받고 있지 않습니다.
            </p>
          </Section>

          {/* 쿠키 */}
          <Section title="개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항">
            <p>
              회사는 귀하의 정보를 수시로 저장하고 찾아내는 &lsquo;쿠키(cookie)&rsquo; 등을
              운용합니다. 쿠키란 웹사이트를 운영하는데 이용되는 서버가 귀하의 브라우저에 보내는 아주
              작은 텍스트 파일로서 귀하의 컴퓨터 하드디스크에 저장됩니다.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-body font-semibold text-warm-800 mb-1">쿠키 등 사용 목적</h4>
                <p className="text-warm-600">
                  회원과 비회원의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악
                  및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및
                  개인 맞춤 서비스 제공
                </p>
              </div>
              <div>
                <h4 className="text-body font-semibold text-warm-800 mb-1">쿠키 설정 거부 방법</h4>
                <p className="text-warm-600">
                  귀하는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹 브라우저의 옵션을
                  설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든
                  쿠키의 저장을 거부할 수 있습니다.
                </p>
                <p className="mt-2 text-body-sm text-warm-500">
                  설정방법 예(인터넷 익스플로어의 경우): 웹 브라우저 상단의 도구 &gt; 인터넷 옵션
                  &gt; 개인정보
                </p>
                <p className="mt-1 text-body-sm text-warm-500">
                  단, 쿠키 설치를 거부하였을 경우 서비스 제공에 어려움이 있을 수 있습니다.
                </p>
              </div>
            </div>
          </Section>

          {/* 민원서비스 */}
          <Section title="개인정보에 관한 민원서비스">
            <p>
              회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이
              개인정보관리책임자를 지정하고 있습니다.
            </p>
          </Section>

          {/* 개정 공지 */}
          <Section title="개인정보처리방침의 개정과 그 공지">
            <p>
              본 개인정보 처리방침을 개정할 경우에는 최소 7일전에 홈페이지 또는 이메일을 통해 변경
              및 내용 등을 공지하도록 하겠습니다. 다만 이용자의 소중한 권리 또는 의무에 중요한 내용
              변경이 발생하는 경우 시행일로부터 최소 30일 전에 공지하도록 하겠습니다.
            </p>
          </Section>

          {/* 개인정보관리책임자 */}
          <section className="rounded-xl bg-brand-50 border border-brand-200/40 p-5 md:p-6">
            <h3 className="text-body-lg font-bold text-brand-800 mb-3">개인정보관리책임자</h3>
            <div className="space-y-1.5 text-body-sm text-warm-600">
              <p>
                <span className="text-warm-500 mr-2">성명</span>
                <span className="font-medium text-warm-800">김정옥</span>
              </p>
              <p>
                <span className="text-warm-500 mr-2">전화번호</span>
                <span className="font-medium text-warm-800">010-5334-7785</span>
              </p>
              <p>
                <span className="text-warm-500 mr-2">이메일</span>
                <span className="font-medium text-warm-800">rud0243@naver.com</span>
              </p>
            </div>
          </section>

          {/* 신고/상담 기관 */}
          <section>
            <p className="text-warm-600 mb-3">
              기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기
              바랍니다.
            </p>
            <ul className="space-y-1.5 text-body-sm text-warm-600">
              <li>
                <span className="font-medium text-warm-700">1.</span> 대검찰청 사이버수사과
                (cybercid.spo.go.kr)
              </li>
              <li>
                <span className="font-medium text-warm-700">2.</span> 경찰청 사이버테러대응센터
                (www.ctrc.go.kr / 02-392-0330)
              </li>
              <li>
                <span className="font-medium text-warm-700">3.</span> 개인정보침해신고센터
                (privacy.kisa.or.kr / 국번 없이 118)
              </li>
              <li>
                <span className="font-medium text-warm-700">4.</span> 개인정보분쟁조정위원회
                (kopico.go.kr / 1833-6972)
              </li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}

/* ─── Sub-components ─── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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

function DefinitionList({ items }: { items: { term: string; desc: string }[] }) {
  return (
    <dl className="mt-3 space-y-2">
      {items.map((item) => (
        <div key={item.term} className="flex flex-wrap gap-x-2">
          <dt className="font-semibold text-warm-800 shrink-0">{item.term}:</dt>
          <dd className="text-warm-600">{item.desc}</dd>
        </div>
      ))}
    </dl>
  );
}
