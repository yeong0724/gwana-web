'use client';

type TermsType = 'terms' | 'privacy' | 'identity';

type Props = {
  type: TermsType;
};

export const TERMS_TITLE: Record<TermsType, string> = {
  terms: '이용약관 및 환불정책',
  privacy: '개인정보처리방침',
  identity: '본인확인 서비스 이용약관',
};

const TermsViewerContent = ({ type }: Props) => {
  switch (type) {
    case 'terms':
      return <TermsContent />;
    case 'privacy':
      return <PrivacyContent />;
    case 'identity':
      return <IdentityContent />;
  }
};

export default TermsViewerContent;

/* ─── Sub-components ─── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[15px] font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="inline-block w-1 h-4 rounded-full bg-tea-500" />
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Li({ n, children }: { n: string | number; children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-warm-400 shrink-0">
        {'\u2776\u2777\u2778\u2779\u277A\u277B\u277C\u277D\u277E'[Number(n) - 1] || `${n}.`}
      </span>
      <span>{children}</span>
    </li>
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

/* ─── 이용약관 ─── */

function TermsContent() {
  return (
    <article className="space-y-6 text-[13px] text-warm-700 leading-relaxed">
      <Section title="제1조 (목적)">
        <p>
          이 약관은 관아수제차(전자상거래 사업자)가 운영하는 관아수제차 사이버
          몰(이하 &ldquo;몰&rdquo;이라 한다)에서 제공하는 인터넷 관련 서비스(이하
          &ldquo;서비스&rdquo;라 한다)를 이용함에 있어 사이버 몰과 이용자의
          권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
      </Section>

      <Section title="제2조 (정의)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;이란 관아수제차가 재화 또는 용역(이하 &ldquo;재화
            등&rdquo;이라 함)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를
            이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.
          </Li>
          <Li n="2">
            &ldquo;이용자&rdquo;란 &ldquo;몰&rdquo;에 접속하여 이 약관에 따라
            &ldquo;몰&rdquo;이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
          </Li>
          <Li n="3">
            &ldquo;회원&rdquo;이라 함은 &ldquo;몰&rdquo;에 회원등록을 한 자로서,
            계속적으로 &ldquo;몰&rdquo;이 제공하는 서비스를 이용할 수 있는 자를
            말합니다.
          </Li>
          <Li n="4">
            &ldquo;비회원&rdquo;이라 함은 회원에 가입하지 않고 &ldquo;몰&rdquo;이
            제공하는 서비스를 이용하는 자를 말합니다.
          </Li>
        </ol>
      </Section>

      <Section title="제3조 (약관 등의 명시와 설명 및 개정)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지
            주소, 전화번호·전자우편주소, 사업자등록번호, 통신판매업 신고번호,
            개인정보관리책임자 등을 이용자가 쉽게 알 수 있도록 사이버 몰의 초기
            서비스화면에 게시합니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 이용자가 약관에 동의하기에 앞서 청약철회·배송책임·환불조건
            등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는
            팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.
          </Li>
          <Li n="3">
            &ldquo;몰&rdquo;은 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수
            있습니다.
          </Li>
          <Li n="4">
            &ldquo;몰&rdquo;이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여
            현행약관과 함께 몰의 초기화면에 그 적용일자 7일 이전부터 공지합니다.
          </Li>
        </ol>
      </Section>

      <Section title="제4조 (서비스의 제공 및 변경)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 다음과 같은 업무를 수행합니다.
            <ul className="list-disc list-outside ml-5 mt-1.5 space-y-1 text-warm-600">
              <li>재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</li>
              <li>구매계약이 체결된 재화 또는 용역의 배송</li>
              <li>기타 &ldquo;몰&rdquo;이 정하는 업무</li>
            </ul>
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의
            경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할
            수 있습니다.
          </Li>
        </ol>
      </Section>

      <Section title="제5조 (서비스의 중단)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장,
            통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로
            중단할 수 있습니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로
            인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다.
          </Li>
        </ol>
      </Section>

      <Section title="제6조 (회원가입)">
        <ol className="list-none space-y-2">
          <Li n="1">
            이용자는 &ldquo;몰&rdquo;이 정한 가입 양식에 따라 회원정보를 기입한 후
            이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 가입 신청한 이용자 중 다음 각 호에 해당하지 않는 한
            회원으로 등록합니다.
          </Li>
        </ol>
      </Section>

      <Section title="제7조 (회원 탈퇴 및 자격 상실 등)">
        <ol className="list-none space-y-2">
          <Li n="1">
            회원은 &ldquo;몰&rdquo;에 언제든지 탈퇴를 요청할 수 있으며
            &ldquo;몰&rdquo;은 즉시 회원탈퇴를 처리합니다.
          </Li>
          <Li n="2">
            회원이 다음 각 호의 사유에 해당하는 경우, &ldquo;몰&rdquo;은 회원자격을
            제한 및 정지시킬 수 있습니다.
          </Li>
        </ol>
      </Section>

      <Section title="제8조 (회원에 대한 통지)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;이 회원에 대한 통지를 하는 경우, 회원이
            &ldquo;몰&rdquo;과 미리 약정하여 지정한 전자우편 주소로 할 수 있습니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 불특정다수 회원에 대한 통지의 경우 1주일 이상
            &ldquo;몰&rdquo; 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다.
          </Li>
        </ol>
      </Section>

      <Section title="제9조 (구매신청 및 개인정보 제공 동의 등)">
        <p>
          &ldquo;몰&rdquo; 이용자는 &ldquo;몰&rdquo;상에서 다음 또는 이와 유사한
          방법에 의하여 구매를 신청합니다.
        </p>
      </Section>

      <Section title="제10조 (계약의 성립)">
        <p>
          &ldquo;몰&rdquo;은 구매신청에 대하여 승낙하지 않을 수 있습니다. 다만,
          미성년자와 계약을 체결하는 경우에는 법정대리인의 동의를 얻지 못하면
          미성년자 본인 또는 법정대리인이 계약을 취소할 수 있다는 내용을 고지하여야
          합니다.
        </p>
      </Section>

      <Section title="제11조 (지급방법)">
        <p>
          &ldquo;몰&rdquo;에서 구매한 재화 또는 용역에 대한 대금지급방법은 계좌이체,
          신용카드, 온라인무통장입금, 전자화폐, 포인트 결제 등의 방법으로 할 수
          있습니다.
        </p>
      </Section>

      <Section title="제12조 (수신확인통지·구매신청 변경 및 취소)">
        <p>
          &ldquo;몰&rdquo;은 이용자의 구매신청이 있는 경우 이용자에게
          수신확인통지를 합니다.
        </p>
      </Section>

      <Section title="제13조 (재화 등의 공급)">
        <p>
          &ldquo;몰&rdquo;은 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할
          수 있도록 필요한 조치를 취합니다.
        </p>
      </Section>

      <Section title="제14조 (환급)">
        <p>
          &ldquo;몰&rdquo;은 이용자가 구매신청한 재화 등이 품절 등의 사유로 인도
          또는 제공을 할 수 없을 때에는 지체 없이 그 사유를 이용자에게 통지하고
          사전에 대금을 받은 경우에는 3영업일 이내에 환급합니다.
        </p>
      </Section>

      <Section title="제15조 (청약철회 등)">
        <ol className="list-none space-y-2">
          <Li n="1">
            이용자는 계약내용에 관한 서면을 받은 날부터 7일 이내에 청약의 철회를
            할 수 있습니다.
          </Li>
          <Li n="2">
            이용자는 재화 등을 배송 받은 경우 다음의 경우에는 반품 및 교환을 할 수
            없습니다: 이용자 귀책사유로 재화가 멸실·훼손된 경우, 사용 또는 일부
            소비로 가치가 현저히 감소한 경우 등.
          </Li>
        </ol>
      </Section>

      <Section title="제16조 (청약철회 등의 효과)">
        <p>
          &ldquo;몰&rdquo;은 이용자로부터 재화 등을 반환받은 경우 3영업일 이내에
          이미 지급받은 대금을 환급합니다.
        </p>
      </Section>

      <Section title="제17조 (개인정보보호)">
        <p>
          &ldquo;몰&rdquo;은 이용자의 개인정보 수집시 서비스제공을 위하여 필요한
          범위에서 최소한의 개인정보를 수집합니다.
        </p>
      </Section>

      <Section title="제18조 (&ldquo;몰&rdquo;의 의무)">
        <p>
          &ldquo;몰&rdquo;은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를
          하지 않으며 지속적이고 안정적으로 재화·용역을 제공하는데 최선을 다합니다.
        </p>
      </Section>

      <Section title="제19조 (회원의 ID 및 비밀번호에 대한 의무)">
        <p>
          ID와 비밀번호에 관한 관리책임은 회원에게 있으며, 제3자에게 이용하게
          해서는 안됩니다.
        </p>
      </Section>

      <Section title="제20조 (이용자의 의무)">
        <p>
          이용자는 허위 내용 등록, 타인 정보 도용, &ldquo;몰&rdquo; 정보 변경,
          저작권 침해, 명예 손상 등의 행위를 하여서는 안 됩니다.
        </p>
      </Section>

      <Section title="제21조 (연결&ldquo;몰&rdquo;과 피연결&ldquo;몰&rdquo; 간의 관계)">
        <p>
          연결&ldquo;몰&rdquo;은 피연결&ldquo;몰&rdquo;이 독자적으로 제공하는 재화
          등에 의하여 이용자와 행하는 거래에 대해 보증 책임을 지지 않습니다.
        </p>
      </Section>

      <Section title="제22조 (저작권의 귀속 및 이용제한)">
        <p>
          &ldquo;몰&rdquo;이 작성한 저작물에 대한 저작권 기타 지적재산권은
          &ldquo;몰&rdquo;에 귀속합니다.
        </p>
      </Section>

      <Section title="제23조 (분쟁해결)">
        <p>
          &ldquo;몰&rdquo;은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그
          피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
        </p>
      </Section>

      <Section title="제24조 (적립금 제도)">
        <p>
          &ldquo;몰&rdquo;은 정책에 따라 적립금, 쿠폰 제도를 운영하며, 회원은
          재화 등을 구매 시 적립금 등을 현금과 동일하게 사용할 수 있습니다.
        </p>
      </Section>

      <Section title="제25조 (재판권 및 준거법)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;과 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은
            제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는
            지방법원의 전속관할로 합니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;과 이용자 간에 제기된 전자상거래 소송에는 한국법을
            적용합니다.
          </Li>
        </ol>
      </Section>

      <section className="rounded-lg bg-brand-50 border border-brand-200/40 p-4">
        <h3 className="text-[13px] font-bold text-brand-800 mb-1">부칙 (시행일)</h3>
        <p className="text-[12px] text-warm-600">
          이 약관은 2024년 7월 16일부터 시행합니다.
        </p>
      </section>
    </article>
  );
}

/* ─── 개인정보처리방침 ─── */

function PrivacyContent() {
  return (
    <article className="space-y-6 text-[13px] text-warm-700 leading-relaxed">
      <p className="text-warm-600 leading-relaxed">
        {`관아수제차(이하 '회사')는 고객님의 개인정보를 소중히 여기며, 「개인정보 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령에 따라 이용자의 개인정보를 안전하게 보호하고 있습니다.`}
      </p>

      <Section title="수집하는 개인정보 항목">
        <p>
          회사는 회원가입, 상담, 서비스 신청, 본인확인 등을 위해 아래와 같은 개인정보를 수집하고
          있습니다.
        </p>
        <DefinitionList
          items={[
            {
              term: '일반 수집항목',
              desc: '이름, 생년월일, 성별, 로그인ID, 비밀번호, 주소, 휴대전화번호, 이메일, 결제기록',
            },
            {
              term: '본인확인 수집항목',
              desc: '이름, 생년월일, 성별, 휴대전화번호, 통신사, 내외국인 여부, 연계정보(CI), 중복가입확인정보(DI)',
            },
            {
              term: '개인정보 수집방법',
              desc: '홈페이지(회원가입), 본인확인 서비스(다날)를 통한 수집',
            },
          ]}
        />
      </Section>

      <Section title="개인정보의 수집 및 이용목적">
        <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
        <ol className="list-decimal list-outside ml-5 space-y-1.5 mt-2">
          <li>
            <strong className="text-warm-800">사이트 회원 가입 및 관리</strong>
            <span className="text-warm-600"> — 본인여부 확인, 서비스 이용 및 상담</span>
          </li>
          <li>
            <strong className="text-warm-800">본인확인</strong>
            <span className="text-warm-600">
              {' '}— 휴대폰 본인확인 서비스를 통한 실명확인 및 부정이용 방지
            </span>
          </li>
          <li>
            <strong className="text-warm-800">재화 또는 서비스 제공</strong>
            <span className="text-warm-600"> — 물품배송, 서비스 제공, 정산 및 환불</span>
          </li>
          <li>
            <strong className="text-warm-800">마케팅 및 광고</strong>
            <span className="text-warm-600"> — 이벤트 등 광고성 정보 전달</span>
          </li>
        </ol>
      </Section>

      <Section title="개인정보의 보유 및 이용기간">
        <p>
          회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
          다만, 관계 법령에 의해 보존할 필요가 있는 경우 일정 기간 보관합니다.
        </p>
        <div className="mt-3 overflow-hidden rounded-lg border border-warm-200/60">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-warm-100/50">
                <th className="px-3 py-2 text-left font-semibold text-warm-800">보존 항목</th>
                <th className="px-3 py-2 text-left font-semibold text-warm-800">보존 기간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              <tr>
                <td className="px-3 py-2 text-warm-600">계약 또는 청약철회 등에 관한 기록</td>
                <td className="px-3 py-2 text-warm-700">5년</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-warm-600">대금결제 및 재화 공급에 관한 기록</td>
                <td className="px-3 py-2 text-warm-700">5년</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-warm-600">소비자 불만 또는 분쟁처리에 관한 기록</td>
                <td className="px-3 py-2 text-warm-700">3년</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-warm-600">로그인 기록</td>
                <td className="px-3 py-2 text-warm-700">3개월</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-warm-600">본인확인정보(CI, DI)</td>
                <td className="px-3 py-2 text-warm-700">회원 탈퇴 시까지</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="개인정보의 파기절차 및 방법">
        <p>
          회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이
          파기합니다.
        </p>
        <div className="mt-2 space-y-2">
          <div>
            <h4 className="text-[13px] font-semibold text-warm-800 mb-0.5">파기절차</h4>
            <p className="text-warm-600">
              목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및 관련 법령에 따라 일정 기간
              저장된 후 파기됩니다.
            </p>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-warm-800 mb-0.5">파기방법</h4>
            <p className="text-warm-600">
              전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여
              삭제합니다.
            </p>
          </div>
        </div>
      </Section>

      <Section title="개인정보 제공">
        <p>
          회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 이용자가
          사전에 동의한 경우 또는 법령의 규정에 의한 경우에는 예외로 합니다.
        </p>
      </Section>

      <Section title="제3자에 대한 제공 및 수집한 개인정보의 위탁">
        <div className="mt-2 overflow-hidden rounded-lg border border-warm-200/60">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-warm-100/50">
                <th className="px-3 py-2 text-left font-semibold text-warm-800">위탁업무</th>
                <th className="px-3 py-2 text-left font-semibold text-warm-800">수탁자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              <tr>
                <td className="px-3 py-2 text-warm-600">주문 상품의 배송</td>
                <td className="px-3 py-2 text-warm-700 font-medium">로젠 택배</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-warm-600">결제 서비스</td>
                <td className="px-3 py-2 text-warm-700 font-medium">토스페이먼츠, (주)포트원</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-warm-600">휴대폰 본인확인</td>
                <td className="px-3 py-2 text-warm-700 font-medium">(주)다날, (주)포트원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="14세 미만 아동의 개인정보보호">
        <p>
          회사는 법정대리인의 동의가 필요한 만 14세 미만 아동의 회원가입은 받고 있지 않습니다.
        </p>
      </Section>

      <Section title="개인정보에 관한 민원서비스">
        <p>
          회사는 고객의 개인정보를 보호하고 관련 불만을 처리하기 위하여 개인정보관리책임자를
          지정하고 있습니다.
        </p>
      </Section>

      <section className="rounded-lg bg-brand-50 border border-brand-200/40 p-4">
        <h3 className="text-[13px] font-bold text-brand-800 mb-2">개인정보관리책임자</h3>
        <div className="space-y-1 text-[12px] text-warm-600">
          <p>
            <span className="text-warm-500 mr-1.5">성명</span>
            <span className="font-medium text-warm-800">김정옥</span>
          </p>
          <p>
            <span className="text-warm-500 mr-1.5">전화번호</span>
            <span className="font-medium text-warm-800">010-5334-7785</span>
          </p>
          <p>
            <span className="text-warm-500 mr-1.5">이메일</span>
            <span className="font-medium text-warm-800">rud0243@naver.com</span>
          </p>
        </div>
      </section>
    </article>
  );
}

/* ─── 본인확인 서비스 이용약관 ─── */

function IdentityContent() {
  return (
    <article className="space-y-6 text-[13px] text-warm-700 leading-relaxed">
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
  );
}
