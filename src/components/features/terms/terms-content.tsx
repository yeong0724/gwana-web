const retentionRows = [
  { item: '계약 또는 청약철회 등에 관한 기록', period: '5년', law: '전자상거래법' },
  { item: '대금결제 및 재화 공급에 관한 기록', period: '5년', law: '전자상거래법' },
  { item: '소비자 불만 또는 분쟁처리에 관한 기록', period: '3년', law: '전자상거래법' },
  { item: '로그인 기록', period: '3개월', law: '통신비밀보호법' },
  { item: '본인확인정보(CI, DI)', period: '회원 탈퇴 시까지', law: '정보통신망법' },
];

const consignmentRows = [
  { task: '주문 상품의 배송', company: '로젠 택배' },
  { task: '결제 서비스', company: '토스페이먼츠' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-heading-3 font-bold text-brand-800 mb-3 flex items-stretch gap-2">
        <span aria-hidden className="w-1 shrink-0 self-stretch rounded-full bg-tea-500 my-0.5" />
        <span className="flex-1">{title}</span>
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

export function TermsBody() {
  return (
    <article className="space-y-10 text-body text-warm-700 leading-relaxed">
      {/* 제1조 */}
      <Section title="제1조 (목적)">
        <p>
          이 약관은 관아수제차(전자상거래 사업자)가 운영하는 관아수제차 사이버 몰(이하
          &ldquo;몰&rdquo;이라 한다)에서 제공하는 인터넷 관련 서비스(이하 &ldquo;서비스&rdquo;라
          한다)를 이용함에 있어 사이버 몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로
          합니다.
        </p>
        <aside className="mt-3 rounded-lg bg-warm-100/60 border border-warm-200/50 px-4 py-3 text-body-sm text-warm-500">
          PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을
          준용합니다.
        </aside>
      </Section>

      {/* 제2조 */}
      <Section title="제2조 (정의)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;이란 관아수제차가 재화 또는 용역(이하 &ldquo;재화 등&rdquo;이라 함)을
            이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록
            설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
          </Li>
          <Li n="2">
            &ldquo;이용자&rdquo;란 &ldquo;몰&rdquo;에 접속하여 이 약관에 따라 &ldquo;몰&rdquo;이
            제공하는 서비스를 받는 회원 및 비회원을 말합니다.
          </Li>
          <Li n="3">
            &ldquo;회원&rdquo;이라 함은 &ldquo;몰&rdquo;에 회원등록을 한 자로서, 계속적으로
            &ldquo;몰&rdquo;이 제공하는 서비스를 이용할 수 있는 자를 말합니다.
          </Li>
          <Li n="4">
            &ldquo;비회원&rdquo;이라 함은 회원에 가입하지 않고 &ldquo;몰&rdquo;이 제공하는 서비스를
            이용하는 자를 말합니다.
          </Li>
        </ol>
      </Section>

      {/* 제3조 */}
      <Section title="제3조 (약관 등의 명시와 설명 및 개정)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의
            불만을 처리할 수 있는 곳의 주소를 포함), 전화번호·모사전송번호·전자우편주소,
            사업자등록번호, 통신판매업 신고번호, 개인정보관리책임자 등을 이용자가 쉽게 알 수 있도록
            관아수제차 사이버 몰의 초기 서비스화면(전면)에 게시합니다. 다만, 약관의 내용은 이용자가
            연결화면을 통하여 볼 수 있도록 할 수 있습니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중
            청약철회·배송책임·환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의
            연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.
          </Li>
          <Li n="3">
            &ldquo;몰&rdquo;은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한
            법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망
            이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등
            관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
          </Li>
          <Li n="4">
            &ldquo;몰&rdquo;이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과
            함께 몰의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 다만,
            이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고
            공지합니다. 이 경우 &ldquo;몰&rdquo;은 개정 전 내용과 개정 후 내용을 명확하게 비교하여
            이용자가 알기 쉽도록 표시합니다.
          </Li>
          <Li n="5">
            &ldquo;몰&rdquo;이 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는
            계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정 전의 약관조항이 그대로
            적용됩니다. 다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻을
            제3항에 의한 개정약관의 공지기간 내에 &ldquo;몰&rdquo;에 송신하여 &ldquo;몰&rdquo;의
            동의를 받은 경우에는 개정약관 조항이 적용됩니다.
          </Li>
          <Li n="6">
            이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의
            소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래
            등에서의 소비자 보호지침 및 관계법령 또는 상관례에 따릅니다.
          </Li>
        </ol>
      </Section>

      {/* 제4조 */}
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
            &ldquo;몰&rdquo;은 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차
            체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다. 이 경우에는
            변경된 재화 또는 용역의 내용 및 제공일자를 명시하여 현재의 재화 또는 용역의 내용을
            게시한 곳에 즉시 공지합니다.
          </Li>
          <Li n="3">
            &ldquo;몰&rdquo;이 제공하기로 이용자와 계약을 체결한 서비스의 내용을 재화등의 품절 또는
            기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 이용자에게 통지 가능한 주소로
            즉시 통지합니다.
          </Li>
          <Li n="4">
            전항의 경우 &ldquo;몰&rdquo;은 이로 인하여 이용자가 입은 손해를 배상합니다. 다만,
            &ldquo;몰&rdquo;이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
          </Li>
        </ol>
      </Section>

      {/* 제5조 */}
      <Section title="제5조 (서비스의 중단)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의
            사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자
            또는 제3자가 입은 손해에 대하여 배상합니다. 단, &ldquo;몰&rdquo;이 고의 또는 과실이
            없음을 입증하는 경우에는 그러하지 아니합니다.
          </Li>
          <Li n="3">
            사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는
            경우에는 &ldquo;몰&rdquo;은 제8조에 정한 방법으로 이용자에게 통지하고 당초
            &ldquo;몰&rdquo;에서 제시한 조건에 따라 소비자에게 보상합니다. 다만, &ldquo;몰&rdquo;이
            보상기준 등을 고지하지 아니한 경우에는 이용자들의 마일리지 또는 적립금 등을
            &ldquo;몰&rdquo;에서 통용되는 통화가치에 상응하는 현물 또는 현금으로 이용자에게
            지급합니다.
          </Li>
        </ol>
      </Section>

      {/* 제6조 */}
      <Section title="제6조 (회원가입)">
        <ol className="list-none space-y-2">
          <Li n="1">
            이용자는 &ldquo;몰&rdquo;이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에
            동의한다는 의사표시를 함으로서 회원가입을 신청합니다. 또한, 카카오 등 외부 서비스 계정을
            통한 간편 가입도 회원가입으로 간주하며, 이 경우 해당 외부 서비스에서 제공하는 정보를
            회원정보로 활용할 수 있습니다.
          </Li>
          <Li n="2">
            회원가입계약의 성립 시기는 &ldquo;몰&rdquo;의 승낙이 회원에게 도달한 시점으로 합니다.
          </Li>
          <Li n="3">
            회원은 회원가입 시 등록한 사항에 변경이 있는 경우, 상당한 기간 이내에 &ldquo;몰&rdquo;에
            대하여 회원정보 수정 등의 방법으로 그 변경사항을 알려야 합니다.
          </Li>
        </ol>
      </Section>

      {/* 제7조 */}
      <Section title="제7조 (회원 탈퇴 및 자격 상실 등)">
        <ol className="list-none space-y-2">
          <Li n="1">
            회원은 &ldquo;몰&rdquo;에 언제든지 탈퇴를 요청할 수 있으며 &ldquo;몰&rdquo;은 즉시
            회원탈퇴를 처리합니다.
          </Li>
          <Li n="2">
            회원이 다음 각 호의 사유에 해당하는 경우, &ldquo;몰&rdquo;은 회원자격을 제한 및 정지시킬
            수 있습니다.
            <ul className="list-disc list-outside ml-5 mt-1.5 space-y-1 text-warm-600">
              <li>가입 신청 시에 허위 내용을 등록한 경우</li>
              <li>
                &ldquo;몰&rdquo;을 이용하여 구입한 재화 등의 대금, 기타 &ldquo;몰&rdquo; 이용에
                관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우
              </li>
              <li>
                다른 사람의 &ldquo;몰&rdquo; 이용을 방해하거나 그 정보를 도용하는 등 전자상거래
                질서를 위협하는 경우
              </li>
              <li>
                &ldquo;몰&rdquo;을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를
                하는 경우
              </li>
            </ul>
          </Li>
          <Li n="3">
            &ldquo;몰&rdquo;이 회원 자격을 제한·정지 시킨 후, 동일한 행위가 2회 이상 반복되거나 30일
            이내에 그 사유가 시정되지 아니하는 경우 &ldquo;몰&rdquo;은 회원자격을 상실시킬 수
            있습니다.
          </Li>
          <Li n="4">
            &ldquo;몰&rdquo;이 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우
            회원에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할
            기회를 부여합니다.
          </Li>
        </ol>
      </Section>

      {/* 제8조 */}
      <Section title="제8조 (회원에 대한 통지)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;이 회원에 대한 통지를 하는 경우, 회원이 &ldquo;몰&rdquo;과 미리 약정하여
            지정한 전자우편 주소로 할 수 있습니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 불특정다수 회원에 대한 통지의 경우 1주일 이상 &ldquo;몰&rdquo;
            게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다. 다만, 회원 본인의 거래와 관련하여
            중대한 영향을 미치는 사항에 대하여는 개별통지를 합니다.
          </Li>
        </ol>
      </Section>

      {/* 제9조 */}
      <Section title="제9조 (구매신청 및 개인정보 제공 동의 등)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo; 이용자는 &ldquo;몰&rdquo;상에서 다음 또는 이와 유사한 방법에 의하여
            구매를 신청하며, &ldquo;몰&rdquo;은 이용자가 구매신청을 함에 있어서 다음의 각 내용을
            알기 쉽게 제공하여야 합니다.
            <ul className="list-disc list-outside ml-5 mt-1.5 space-y-1 text-warm-600">
              <li>재화 등의 검색 및 선택</li>
              <li>받는 사람의 성명, 주소, 전화번호, 전자우편주소(또는 이동전화번호) 등의 입력</li>
              <li>
                약관내용, 청약철회권이 제한되는 서비스, 배송료·설치비 등의 비용부담과 관련한 내용에
                대한 확인
              </li>
              <li>이 약관에 동의하고 위 사항을 확인하거나 거부하는 표시(예, 마우스 클릭)</li>
              <li>재화등의 구매신청 및 이에 관한 확인 또는 &ldquo;몰&rdquo;의 확인에 대한 동의</li>
              <li>결제방법의 선택</li>
            </ul>
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;이 제3자에게 구매자 개인정보를 제공할 필요가 있는 경우 개인정보를
            제공받는 자, 개인정보 이용목적, 제공하는 개인정보의 항목, 개인정보 보유 및 이용기간을
            구매자에게 알리고 동의를 받아야 합니다.
          </Li>
          <Li n="3">
            &ldquo;몰&rdquo;이 제3자에게 구매자의 개인정보를 취급할 수 있도록 업무를 위탁하는
            경우에는 개인정보 취급위탁을 받는 자, 개인정보 취급위탁을 하는 업무의 내용을 구매자에게
            알리고 동의를 받아야 합니다. 다만, 서비스제공에 관한 계약이행을 위해 필요하고 구매자의
            편의증진과 관련된 경우에는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에서 정하고
            있는 방법으로 개인정보 취급방침을 통해 알림으로써 고지절차와 동의절차를 거치지 않아도
            됩니다.
          </Li>
          <Li n="4">
            &ldquo;몰&rdquo;이 호스팅을 변경하여 이전 할 경우 1년 동안 로그인하지 않은 휴면회원을
            포함한 모든 &ldquo;이용자&rdquo;의 정보를 호스팅사에서 제공받아 이전하는 호스팅사에
            고객의 정보를 등록하고 &ldquo;몰&rdquo;의 서비스 연속성 관리를 위한 용도로 사용할 수
            있습니다.
          </Li>
        </ol>
      </Section>

      {/* 제10조 */}
      <Section title="제10조 (계약의 성립)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 제9조와 같은 구매신청에 대하여 다음 각 호에 해당하면 승낙하지 않을 수
            있습니다. 다만, 미성년자와 계약을 체결하는 경우에는 법정대리인의 동의를 얻지 못하면
            미성년자 본인 또는 법정대리인이 계약을 취소할 수 있다는 내용을 고지하여야 합니다.
            <ul className="list-disc list-outside ml-5 mt-1.5 space-y-1 text-warm-600">
              <li>신청 내용에 허위, 기재누락, 오기가 있는 경우</li>
              <li>
                미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및 용역을 구매하는 경우
              </li>
              <li>
                기타 구매신청에 승낙하는 것이 &ldquo;몰&rdquo; 기술상 현저히 지장이 있다고 판단하는
                경우
              </li>
            </ul>
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;의 승낙이 제12조제1항의 수신확인통지형태로 이용자에게 도달한 시점에
            계약이 성립한 것으로 봅니다.
          </Li>
          <Li n="3">
            &ldquo;몰&rdquo;의 승낙의 의사표시에는 이용자의 구매 신청에 대한 확인 및 판매가능 여부,
            구매신청의 정정 취소 등에 관한 정보 등을 포함하여야 합니다.
          </Li>
        </ol>
      </Section>

      {/* 제11조 */}
      <Section title="제11조 (지급방법)">
        <p>
          &ldquo;몰&rdquo;에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각 호의 방법 중
          가용한 방법으로 할 수 있습니다. 단, &ldquo;몰&rdquo;은 이용자의 지급방법에 대하여 재화
          등의 대금에 어떠한 명목의 수수료도 추가하여 징수할 수 없습니다.
        </p>
        <ul className="list-disc list-outside ml-5 mt-3 space-y-1 text-warm-600">
          <li>폰뱅킹, 인터넷뱅킹, 메일 뱅킹 등의 각종 계좌 이체</li>
          <li>선불카드, 직불카드, 신용카드 등의 각종 카드 결제</li>
          <li>온라인무통장입금</li>
          <li>전자화폐에 의한 결제</li>
          <li>수령 시 대금지급</li>
          <li>마일리지 등 &ldquo;몰&rdquo;이 지급한 포인트에 의한 결제</li>
          <li>&ldquo;몰&rdquo;과 계약을 맺었거나 &ldquo;몰&rdquo;이 인정한 상품권에 의한 결제</li>
          <li>기타 전자적 지급 방법에 의한 대금 지급 등</li>
        </ul>
      </Section>

      {/* 제12조 */}
      <Section title="제12조 (수신확인통지·구매신청 변경 및 취소)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다.
          </Li>
          <Li n="2">
            수신확인통지를 받은 이용자는 의사표시의 불일치 등이 있는 경우에는 수신확인통지를 받은 후
            즉시 구매신청 변경 및 취소를 요청할 수 있고 &ldquo;몰&rdquo;은 배송 전에 이용자의 요청이
            있는 경우에는 지체 없이 그 요청에 따라 처리하여야 합니다. 다만 이미 대금을 지불한
            경우에는 제15조의 청약철회 등에 관한 규정에 따릅니다.
          </Li>
        </ol>
      </Section>

      {/* 제13조 */}
      <Section title="제13조 (재화 등의 공급)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 이용자와 재화 등의 공급시기에 관하여 별도의 약정이 없는 이상,
            이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의
            필요한 조치를 취합니다. 다만, &ldquo;몰&rdquo;이 이미 재화 등의 대금의 전부 또는 일부를
            받은 경우에는 대금의 전부 또는 일부를 받은 날부터 3영업일 이내에 조치를 취합니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 이용자가 구매한 재화에 대해 배송수단, 수단별 배송비용 부담자, 수단별
            배송기간 등을 명시합니다. 만약 &ldquo;몰&rdquo;이 약정 배송기간을 초과한 경우에는 그로
            인한 이용자의 손해를 배상하여야 합니다. 다만 &ldquo;몰&rdquo;이 고의·과실이 없음을
            입증한 경우에는 그러하지 아니합니다.
          </Li>
        </ol>
      </Section>

      {/* 제14조 */}
      <Section title="제14조 (환급)">
        <p>
          &ldquo;몰&rdquo;은 이용자가 구매신청한 재화 등이 품절 등의 사유로 인도 또는 제공을 할 수
          없을 때에는 지체 없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는
          대금을 받은 날부터 3영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.
        </p>
      </Section>

      {/* 제15조 */}
      <Section title="제15조 (청약철회 등)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;과 재화등의 구매에 관한 계약을 체결한 이용자는 「전자상거래 등에서의
            소비자보호에 관한 법률」 제13조 제2항에 따른 계약내용에 관한 서면을 받은 날(그 서면을
            받은 때보다 재화 등의 공급이 늦게 이루어진 경우에는 재화 등을 공급받거나 재화 등의
            공급이 시작된 날을 말합니다)부터 7일 이내에는 청약의 철회를 할 수 있습니다.
          </Li>
          <Li n="2">
            이용자는 재화 등을 배송 받은 경우 다음 각 호의 1에 해당하는 경우에는 반품 및 교환을 할
            수 없습니다.
            <ul className="list-disc list-outside ml-5 mt-1.5 space-y-1 text-warm-600">
              <li>
                이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우 (다만, 재화 등의 내용을
                확인하기 위하여 포장 등을 훼손한 경우에는 청약철회를 할 수 있습니다)
              </li>
              <li>이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우</li>
              <li>
                시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우
              </li>
              <li>
                같은 성능을 지닌 재화 등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한
                경우
              </li>
              <li>
                식품(수제차 등)의 특성상 포장을 개봉하였거나 밀봉이 훼손되어 위생상 재판매가
                불가능한 경우
              </li>
              <li>
                주문에 의하여 개별적으로 제조·가공된 재화로서 청약철회 시 판매자에게 회복할 수 없는
                중대한 피해가 예상되는 경우
              </li>
            </ul>
          </Li>
          <Li n="3">
            제2항제2호 내지 제5호의 경우에 &ldquo;몰&rdquo;이 사전에 청약철회 등이 제한되는 사실을
            소비자가 쉽게 알 수 있는 곳에 명기하거나 시용상품을 제공하는 등의 조치를 하지 않았다면
            이용자의 청약철회 등이 제한되지 않습니다.
          </Li>
          <Li n="4">
            이용자는 제1항 및 제2항의 규정에 불구하고 재화 등의 내용이 표시·광고 내용과 다르거나
            계약내용과 다르게 이행된 때에는 당해 재화 등을 공급받은 날부터 3월 이내, 그 사실을 안 날
            또는 알 수 있었던 날부터 30일 이내에 청약철회 등을 할 수 있습니다.
          </Li>
        </ol>
      </Section>

      {/* 제16조 */}
      <Section title="제16조 (청약철회 등의 효과)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 이용자로부터 재화 등을 반환받은 경우 3영업일 이내에 이미 지급받은
            재화 등의 대금을 환급합니다. 이 경우 &ldquo;몰&rdquo;이 이용자에게 재화등의 환급을
            지연한때에는 그 지연기간에 대하여 「전자상거래 등에서의 소비자보호에 관한 법률
            시행령」제21조의2에서 정하는 지연이자율을 곱하여 산정한 지연이자를 지급합니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 위 대금을 환급함에 있어서 이용자가 신용카드 또는 전자화폐 등의
            결제수단으로 재화 등의 대금을 지급한 때에는 지체 없이 당해 결제수단을 제공한 사업자로
            하여금 재화 등의 대금의 청구를 정지 또는 취소하도록 요청합니다.
          </Li>
          <Li n="3">
            청약철회 등의 경우 공급받은 재화 등의 반환에 필요한 비용은 이용자가 부담합니다.
            &ldquo;몰&rdquo;은 이용자에게 청약철회 등을 이유로 위약금 또는 손해배상을 청구하지
            않습니다. 다만 재화 등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행되어
            청약철회 등을 하는 경우 재화 등의 반환에 필요한 비용은 &ldquo;몰&rdquo;이 부담합니다.
          </Li>
          <Li n="4">
            이용자가 재화 등을 제공받을 때 발송비를 부담한 경우에 &ldquo;몰&rdquo;은 청약철회 시 그
            비용을 누가 부담하는지를 이용자가 알기 쉽도록 명확하게 표시합니다.
          </Li>
        </ol>
      </Section>

      {/* 제17조 */}
      <Section title="제17조 (개인정보보호)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의
            개인정보를 수집합니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.
          </Li>
          <Li n="3">
            &ldquo;몰&rdquo;은 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을
            고지하고 동의를 받습니다.
          </Li>
          <Li n="4">
            &ldquo;몰&rdquo;은 수집된 개인정보를 목적외의 용도로 이용할 수 없으며, 새로운 이용목적이
            발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공단계에서 당해 이용자에게 그 목적을
            고지하고 동의를 받습니다. 다만, 관련 법령에 달리 정함이 있는 경우에는 예외로 합니다.
          </Li>
          <Li n="5">
            이용자는 언제든지 &ldquo;몰&rdquo;이 가지고 있는 자신의 개인정보에 대해 열람 및
            오류정정을 요구할 수 있으며 &ldquo;몰&rdquo;은 이에 대해 지체 없이 필요한 조치를 취할
            의무를 집니다.
          </Li>
          <Li n="6">
            &ldquo;몰&rdquo;은 개인정보 보호를 위하여 이용자의 개인정보를 취급하는 자를 최소한으로
            제한하여야 하며 신용카드, 은행계좌 등을 포함한 이용자의 개인정보의 분실, 도난, 유출,
            동의 없는 제3자 제공, 변조 등으로 인한 이용자의 손해에 대하여 모든 책임을 집니다.
          </Li>
        </ol>
      </Section>

      {/* 제18조 */}
      <Section title="제18조 (&ldquo;몰&rdquo;의 의무)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이
            약관이 정하는 바에 따라 지속적이고, 안정적으로 재화·용역을 제공하는데 최선을 다하여야
            합니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의
            개인정보(신용정보 포함) 보호를 위한 보안 시스템을 갖추어야 합니다.
          </Li>
          <Li n="3">
            &ldquo;몰&rdquo;이 상품이나 용역에 대하여 「표시·광고의 공정화에 관한 법률」 제3조
            소정의 부당한 표시·광고행위를 함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을
            집니다.
          </Li>
          <Li n="4">
            &ldquo;몰&rdquo;은 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.
          </Li>
        </ol>
      </Section>

      {/* 제19조 */}
      <Section title="제19조 (회원의 ID 및 비밀번호에 대한 의무)">
        <ol className="list-none space-y-2">
          <Li n="1">제17조의 경우를 제외한 ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.</Li>
          <Li n="2">회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.</Li>
          <Li n="3">
            회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로
            &ldquo;몰&rdquo;에 통보하고 &ldquo;몰&rdquo;의 안내가 있는 경우에는 그에 따라야 합니다.
          </Li>
        </ol>
      </Section>

      {/* 제20조 */}
      <Section title="제20조 (이용자의 의무)">
        <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
        <ul className="list-disc list-outside ml-5 mt-3 space-y-1 text-warm-600">
          <li>신청 또는 변경시 허위 내용의 등록</li>
          <li>타인의 정보 도용</li>
          <li>&ldquo;몰&rdquo;에 게시된 정보의 변경</li>
          <li>&ldquo;몰&rdquo;이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
          <li>&ldquo;몰&rdquo; 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
          <li>&ldquo;몰&rdquo; 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
          <li>
            외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 몰에 공개 또는
            게시하는 행위
          </li>
        </ul>
      </Section>

      {/* 제21조 */}
      <Section title="제21조 (연결&ldquo;몰&rdquo;과 피연결&ldquo;몰&rdquo; 간의 관계)">
        <ol className="list-none space-y-2">
          <Li n="1">
            상위 &ldquo;몰&rdquo;과 하위 &ldquo;몰&rdquo;이 하이퍼링크 방식 등으로 연결된 경우,
            전자를 연결 &ldquo;몰&rdquo;(웹 사이트)이라고 하고 후자를 피연결
            &ldquo;몰&rdquo;(웹사이트)이라고 합니다.
          </Li>
          <Li n="2">
            연결&ldquo;몰&rdquo;은 피연결&ldquo;몰&rdquo;이 독자적으로 제공하는 재화 등에 의하여
            이용자와 행하는 거래에 대해서 보증 책임을 지지 않는다는 뜻을 연결&ldquo;몰&rdquo;의
            초기화면 또는 연결되는 시점의 팝업화면으로 명시한 경우에는 그 거래에 대한 보증 책임을
            지지 않습니다.
          </Li>
        </ol>
      </Section>

      {/* 제22조 */}
      <Section title="제22조 (저작권의 귀속 및 이용제한)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;이 작성한 저작물에 대한 저작권 기타 지적재산권은 &ldquo;몰&rdquo;에
            귀속합니다.
          </Li>
          <Li n="2">
            이용자는 &ldquo;몰&rdquo;을 이용함으로써 얻은 정보 중 &ldquo;몰&rdquo;에게 지적재산권이
            귀속된 정보를 &ldquo;몰&rdquo;의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에
            의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
          </Li>
          <Li n="3">
            이용자가 직접 작성 및 등록한 평가점수, 리뷰, 답글, 사진 등의 게시물(이용자 콘텐츠)에
            대한 저작권 및 지적 재산권은 해당 이용자에게 있으며, 이용자는 &ldquo;몰&rdquo;에 해당
            이용자 콘텐츠를 무상으로 이용할 수 있는 권리를 부여합니다.
          </Li>
        </ol>
      </Section>

      {/* 제23조 */}
      <Section title="제23조 (분쟁해결)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를
            보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;은 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을
            처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시
            통보해 드립니다.
          </Li>
          <Li n="3">
            &ldquo;몰&rdquo;과 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이
            있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수
            있습니다.
          </Li>
        </ol>
      </Section>

      {/* 제24조 */}
      <Section title="제24조 (재판권 및 준거법)">
        <ol className="list-none space-y-2">
          <Li n="1">
            &ldquo;몰&rdquo;과 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의
            주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만,
            제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는
            민사소송법상의 관할법원에 제기합니다.
          </Li>
          <Li n="2">
            &ldquo;몰&rdquo;과 이용자 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.
          </Li>
        </ol>
      </Section>

      {/* 부칙 */}
      <section className="rounded-xl bg-brand-50 border border-brand-200/40 p-5 md:p-6">
        <h3 className="text-body-lg font-bold text-brand-800 mb-2">부칙 (시행일)</h3>
        <p className="text-body-sm text-warm-600">이 약관은 2026년 4월 28일부터 시행합니다.</p>
      </section>
    </article>
  );
}

export function PrivacyBody() {
  return (
    <article className="space-y-10 text-body text-warm-700 leading-relaxed">
      {/* 서문 */}
      <p className="text-body-lg text-warm-600 leading-relaxed">
        {`관아수제차(이하 '회사')는 고객님의 개인정보를 소중히 여기며, 「개인정보 보호법」 및
        「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령에 따라 이용자의
        개인정보를 안전하게 보호하고 있습니다. 회사는 개인정보처리방침을 통하여 고객님께서
        제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한
        조치가 취해지고 있는지 알려드립니다.`}
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
              term: '일반 수집항목',
              desc: '이름, 이메일, 비밀번호, 주소, 휴대전화번호, 결제기록',
            },
            {
              term: '소셜 로그인 수집항목',
              desc: '이름, 이메일, 주소, 휴대전화번호 (카카오 등 외부 서비스 계정을 통해 제공받는 정보)',
            },
            {
              term: '개인정보 수집방법',
              desc: '홈페이지(회원가입), 카카오 등 외부 서비스 연동을 통한 수집',
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
              — 회원가입시 본인여부 확인, 서비스 이용 및 상담, 공지사항 전달, SNS 및 제3자 계정을
              연계하여 간편로그인 서비스 제공
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
              — 웹 페이지 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계, 이벤트 등 광고성 정보
              전달
            </span>
          </li>
        </ol>
        <aside className="mt-4 rounded-lg bg-warm-100/60 border border-warm-200/50 px-4 py-3 text-body-sm text-warm-500">
          <p>
            * 회사의 서비스 이용 과정에서 서비스 이용기록, 방문기록, 불량 이용기록, IP 주소, 쿠키,
            광고식별자 등의 정보가 자동으로 생성되어 수집될 수 있습니다.
          </p>
          <p className="mt-1">
            * 진행하는 이벤트에 따라 수집 항목이 상이할 수 있으므로 응모 시 별도 동의를 받으며, 목적
            달성 즉시 파기합니다.
          </p>
        </aside>
      </Section>

      {/* 개인정보의 보유 및 이용기간 */}
      <Section title="개인정보의 보유 및 이용기간">
        <p>
          회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만,
          관계 법령에 의해 보존할 필요가 있는 경우 아래와 같이 일정 기간 보관합니다.
        </p>

        <div className="mt-4 overflow-hidden rounded-lg border border-warm-200/60">
          <table className="w-full text-caption md:text-body-sm">
            <thead>
              <tr className="bg-warm-100/60">
                <th className="px-2.5 py-2 md:px-4 md:py-2.5 text-left font-semibold text-warm-800">
                  보존 항목
                </th>
                <th className="px-2.5 py-2 md:px-4 md:py-2.5 text-left font-semibold text-warm-800 whitespace-nowrap">
                  보존 기간
                </th>
                <th className="px-2.5 py-2 md:px-4 md:py-2.5 text-left font-semibold text-warm-800 whitespace-nowrap">
                  근거 법령
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {retentionRows.map((row) => (
                <tr key={row.item}>
                  <td className="px-2.5 py-2 md:px-4 md:py-2.5 text-warm-600 leading-snug">
                    {row.item}
                  </td>
                  <td className="px-2.5 py-2 md:px-4 md:py-2.5 text-warm-700 leading-snug">
                    {row.period}
                  </td>
                  <td className="px-2.5 py-2 md:px-4 md:py-2.5 text-warm-600 leading-snug">
                    {row.law}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의
              경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간
              저장된 후 파기되어집니다. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는
              보유되어지는 이외의 다른 목적으로 이용되지 않습니다.
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
          회사는 고객의 개인정보를 &lsquo;개인정보의 수집 및 이용목적&rsquo;에서 고지한 범위를 넘어
          이용하거나 타인 또는 타기업, 기관에 제공하지 않습니다. 다음은 예외로 합니다.
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
          <h4 className="text-body font-semibold text-warm-800 mb-3">위탁업무 내용 및 수탁자</h4>

          <div className="overflow-hidden rounded-lg border border-warm-200/60">
            <table className="w-full text-caption md:text-body-sm">
              <thead>
                <tr className="bg-warm-100/60">
                  <th className="px-2.5 py-2 md:px-4 md:py-2.5 text-left font-semibold text-warm-800">
                    위탁업무
                  </th>
                  <th className="px-2.5 py-2 md:px-4 md:py-2.5 text-left font-semibold text-warm-800">
                    수탁자
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {consignmentRows.map((row) => (
                  <tr key={row.task}>
                    <td className="px-2.5 py-2 md:px-4 md:py-2.5 text-warm-600 leading-snug">
                      {row.task}
                    </td>
                    <td className="px-2.5 py-2 md:px-4 md:py-2.5 text-warm-700 font-medium leading-snug">
                      {row.company}
                    </td>
                  </tr>
                ))}
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
        <p>회사는 법정대리인의 동의가 필요한 만 14세 미만 아동의 회원가입은 받고 있지 않습니다.</p>
      </Section>

      {/* 쿠키 */}
      <Section title="개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항">
        <p>
          회사는 귀하의 정보를 수시로 저장하고 찾아내는 &lsquo;쿠키(cookie)&rsquo; 등을 운용합니다.
          쿠키란 웹사이트를 운영하는데 이용되는 서버가 귀하의 브라우저에 보내는 아주 작은 텍스트
          파일로서 귀하의 컴퓨터 하드디스크에 저장됩니다.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-body font-semibold text-warm-800 mb-1">쿠키 등 사용 목적</h4>
            <p className="text-warm-600">
              회원과 비회원의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및
              자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤
              서비스 제공
            </p>
          </div>
          <div>
            <h4 className="text-body font-semibold text-warm-800 mb-1">쿠키 설정 거부 방법</h4>
            <p className="text-warm-600">
              귀하는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹 브라우저의 옵션을 설정함으로써
              모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을
              거부할 수 있습니다.
            </p>
            <div className="mt-2 space-y-1 text-body-sm text-warm-500">
              <p>설정방법 예시</p>
              <ul className="list-disc list-outside ml-5 space-y-0.5">
                <li>Chrome: 설정 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터</li>
                <li>Safari: 환경설정 &gt; 개인정보 보호 &gt; 쿠키 및 웹사이트 데이터 관리</li>
                <li>Edge: 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리 및 삭제</li>
              </ul>
              <p className="mt-1">
                단, 쿠키 설치를 거부하였을 경우 서비스 제공에 어려움이 있을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 민원서비스 */}
      <Section title="개인정보에 관한 민원서비스">
        <p>
          회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여
          개인정보관리책임자를 지정하고 있습니다. <br />
          개인정보와 관련한 문의사항이 있으시면 아래의 개인정보관리책임자에게 연락해 주시기
          바랍니다. 접수된 문의에 대해 신속하고 성실하게 답변해 드리겠습니다.
        </p>
      </Section>

      {/* 개정 공지 */}
      <Section title="개인정보처리방침의 개정과 그 공지">
        <p>
          본 개인정보 처리방침을 개정할 경우에는 최소 7일전에 홈페이지 또는 이메일을 통해 변경 및
          내용 등을 공지하도록 하겠습니다. 다만 이용자의 소중한 권리 또는 의무에 중요한 내용 변경이
          발생하는 경우 시행일로부터 최소 30일 전에 공지하도록 하겠습니다.
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
          기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
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
  );
}

export function IdentityBody() {
  return (
    <article className="space-y-10 text-body text-warm-700 leading-relaxed">
      <Section title="수집하는 개인정보 항목">
        <p>
          이름, 생년월일, 성별, 휴대전화번호, 통신사, 내외국인 여부, 연계정보(CI),
          중복가입확인정보(DI)
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
        <p>회원 탈퇴 시까지 보관하며, 탈퇴 시 지체 없이 파기합니다.</p>
      </Section>

      <Section title="본인확인기관">
        <p>(주)다날을 통해 본인확인이 이루어지며, 본인확인 서비스의 중계 역할을 수행합니다.</p>
      </Section>

      <Section title="동의 거부 권리 및 불이익">
        <p>
          귀하는 본 동의를 거부할 권리가 있으며, 동의 거부 시 회원가입이 제한될 수 있습니다.
          본인확인은 관계법령에 따른 본인 식별을 위한 필수 절차입니다.
        </p>
      </Section>
    </article>
  );
}
