'use strict';

/* ============================================
   Power of Ten 시뮬레이션 - 로직
   45단계(10⁻¹⁸ m ~ 10²⁶ m) 데이터와
   화면 갱신 / 조작(드래그·버튼·휠·핀치) / 사운드를 담당
   ============================================ */

// ---------- 1. 45단계 배율 데이터 ----------
// exp: 10의 지수(음수=줌인/미시세계, 양수=줌아웃/거시세계)
// file: powers_of_ten_steps 폴더 안의 실제 이미지 파일명
// title/compare/desc: 해당 배율의 과학적 설명(중2 수준)
const STEPS = [
  { exp: -18, title: '물질의 최전선', compare: '거대강입자가속기(LHC)가 탐사하는 최소 규모', paragraphs: [
    '여기는 인류가 실험적으로 도달한 가장 작은 스케일입니다. 유럽입자물리연구소(CERN)의 거대강입자가속기(LHC)는 양성자를 빛의 속도에 가깝게 가속시켜 충돌시키고, 그 잔해를 분석해 이 영역의 정보를 얻습니다. 이 크기에서는 빛(전자기파)으로 직접 볼 수 없어, 과학자들은 입자를 충돌시켜 튀어나오는 파편의 패턴으로 내부 구조를 추론합니다.',
    '이 극한의 스케일까지 오면서 우리는 원자 → 원자핵 → 양성자·중성자 → 쿼크로 계속 더 작은 단위를 발견해 왔습니다. 그렇다면 쿼크보다 더 작은 것이 있을까요? 아직 아무도 확실히 알지 못합니다. 물질의 구성 단원에서 배우는 원자모형은 바로 이 끝없는 탐구의 역사 위에 서 있습니다.'] },
  { exp: -17, title: '쿼크의 활동 영역', compare: '실험으로 확인된 가장 작은 규모의 10배', paragraphs: [
    '양성자 하나는 업쿼크 2개와 다운쿼크 1개, 이렇게 3개의 쿼크로 이루어져 있습니다. 쿼크들은 홀로 존재하지 못하고 항상 무리를 지어 다니는데, 이를 "쿼크 가둠"이라 부릅니다. 쿼크를 서로 떼어내려 하면 오히려 그 사이에 새로운 쿼크·반쿼크 쌍이 생겨나 버려서, 쿼크 하나만 따로 분리하는 것은 불가능합니다.',
    '쿼크를 붙잡아 두는 힘은 전자기력보다 강한 "강한 핵력"입니다. 흥미롭게도 이 힘은 거리가 멀어질수록 오히려 세지는 독특한 성질을 가집니다 — 마치 고무줄처럼, 두 쿼크를 떼어놓으려 할수록 잡아당기는 힘이 커집니다. 이 힘을 매개하는 입자가 글루온(gluon)이며, "풀(glue)"이라는 이름처럼 쿼크들을 접착제처럼 붙여 둡니다.'] },
  { exp: -16, title: '양성자 내부', compare: '양성자 지름의 10분의 1', paragraphs: [
    '양성자 속으로 들어서면 쿼크 3개가 끊임없이 위치를 바꾸며 글루온을 주고받는 역동적인 장면이 펼쳐집니다. 사실 양성자 질량의 대부분은 쿼크 자체의 질량이 아니라, 이 글루온들이 오가며 만들어내는 에너지에서 나옵니다. 아인슈타인의 E=mc²에 따르면 에너지도 질량으로 환산되기 때문입니다.',
    '이 발견은 "질량이란 무엇인가"에 대한 우리의 직관을 흔들어 놓았습니다. 우리는 흔히 질량을 물질의 양이라고 생각하지만, 양성자 내부를 들여다보면 질량 대부분이 사실은 요동치는 에너지장이라는 것을 알게 됩니다. 물질의 가장 작은 단위로 내려갈수록, "단단한 알갱이"라는 상식은 점점 낯선 것이 되어 갑니다.'] },
  { exp: -15, title: '양성자와 중성자', compare: '양성자 지름(약 1.7fm)', paragraphs: [
    '원자핵을 이루는 두 입자, 양성자와 중성자가 뚜렷하게 보이는 크기입니다. 둘은 질량이 거의 같고 크기도 비슷하지만, 양성자는 (+)전하를 띠고 중성자는 전하가 없습니다. 이 둘을 통틀어 "핵자(nucleon)"라고 부릅니다.',
    '양성자와 중성자를 원자핵 안에 가둬 두는 힘 역시 강한 핵력입니다. 같은 전하를 띤 양성자끼리는 전기적으로 밀어내야 정상이지만, 아주 가까운 거리에서 작용하는 강한 핵력이 전기적 반발력을 이겨내고 원자핵을 하나로 묶어 줍니다. 이 힘이 아주 조금만 약했다면 우주의 모든 원자핵은 존재할 수 없었을 것입니다.'] },
  { exp: -14, title: '원자핵 도착', compare: '무거운 원자핵의 지름 정도', paragraphs: [
    '무거운 원소의 원자핵 하나가 시야에 들어오는 크기입니다. 원자핵은 양성자와 중성자가 빽빽하게 뭉쳐 있어 밀도가 상상을 초월합니다 — 원자핵 물질을 각설탕 하나 크기로 뭉치면 그 무게가 약 10억 톤에 달합니다. 이런 극단적인 밀도는 중성자별에서 실제로 관측됩니다.',
    '원자핵의 크기는 원소마다 다릅니다. 양성자와 중성자가 많을수록(원자번호와 질량수가 클수록) 원자핵도 커집니다. 중·고등학교 과학에서 배우는 원소 기호와 원자번호는 바로 이 원자핵 속 양성자 개수를 나타내는 숫자입니다 — 탄소(C)는 양성자 6개, 산소(O)는 8개를 가집니다.'] },
  { exp: -13, title: '원자핵을 향해', compare: '원자핵 지름의 10배 거리', paragraphs: [
    '아직 전자구름 안쪽, 원자핵을 향해 다가가는 중간 지점입니다. 만약 원자를 축구장만 하게 확대한다면, 원자핵은 그 중앙에 놓인 콩알 하나 정도의 크기에 불과합니다.',
    '이 비유는 20세기 초 어니스트 러더퍼드가 얇은 금박에 알파 입자를 쏘는 실험(1911년)을 통해 처음 밝혀낸 사실입니다. 대부분의 알파 입자가 금박을 그대로 통과했지만, 아주 가끔 입자가 크게 튕겨 나오는 것을 보고 러더퍼드는 원자 중심에 아주 작고 무거운 핵이 있다는 결론을 내렸습니다. 이 실험은 톰슨의 "건포도 푸딩 모형"을 무너뜨리고 오늘날 원자모형의 토대를 놓았습니다.'] },
  { exp: -12, title: '텅 빈 원자 내부', compare: '원자핵까지 남은 거리', paragraphs: [
    '원자 내부는 대부분 텅 빈 공간입니다. 원자핵과 전자 사이의 거리에 비해 둘의 크기는 너무나 작아서, 원자 부피의 99.9% 이상이 사실상 빈 공간이라 할 수 있습니다. 우리 몸도, 지금 이 화면을 보고 있는 스마트폰도 원자로 이루어져 있으니, 결국 물질의 대부분은 "아무것도 없는 공간"인 셈입니다.',
    '그런데도 딱딱한 물체를 만졌을 때 손이 통과하지 않고 단단하게 느껴지는 이유는 무엇일까요? 바로 전자들 사이에 작용하는 전기적 반발력 때문입니다. 원자와 원자가 가까워지면 서로의 전자구름이 밀어내면서, 텅 빈 공간임에도 마치 꽉 찬 것처럼 느껴지는 단단함을 만들어냅니다.'] },
  { exp: -11, title: '전자구름 속으로', compare: '원자 반지름의 10분의 1', paragraphs: [
    '전자는 원자핵 주위를 정해진 궤도로 도는 작은 공이 아닙니다. 오히려 특정 위치에서 발견될 "확률"로만 표현되는 구름과 같은 존재입니다. 이것이 양자역학이 말하는 전자의 실체이며, 이 확률 분포를 나타낸 것이 바로 "전자구름"입니다.',
    '이 개념은 전자가 정해진 궤도를 돈다고 본 보어의 원자모형을 넘어서는 현대적인 원자모형입니다. 오스트리아 물리학자 슈뢰딩거는 전자의 파동적 성질을 수식으로 표현했고, 그 결과가 오늘날 화학에서 배우는 오비탈(orbital) 개념으로 이어집니다. 전자는 입자이면서 동시에 파동이라는, 우리 직관과는 다른 양자역학의 세계가 여기서 시작됩니다.'] },
  { exp: -10, title: '원자 하나', compare: '수소 원자 지름 정도(약 0.1nm)', paragraphs: [
    '드디어 물질을 구성하는 기본 단위, 원자 전체가 눈에 들어옵니다. 수소 원자는 우주에서 가장 단순하고 가장 흔한 원자로, 양성자 1개와 전자 1개로 이루어져 있습니다. 우주에 존재하는 원자의 약 90%가 수소일 정도입니다.',
    '자연에는 지금까지 발견된 118종의 원소가 있으며, 각 원소는 원자핵 속 양성자 개수(원자번호)로 구분됩니다. 이 원소들을 양성자 수 순서로 배열하고 성질이 비슷한 것끼리 묶어 놓은 표가 바로 멘델레예프가 1869년에 처음 고안한 주기율표입니다. 학교에서 배우는 원소와 원자 개념은 모두 이 스케일, 10⁻¹⁰ m 근처에서 벌어지는 이야기입니다.'] },
  { exp: -9, title: 'DNA 이중나선', compare: 'DNA 두 가닥 나선의 지름(약 2nm)', paragraphs: [
    '원자 몇 개가 이어진 정도의 매우 작은 크기, 여기서는 생명의 설계도인 DNA의 이중나선 구조가 그 굵기를 드러냅니다. DNA는 인산, 당, 염기로 이루어진 뉴클레오타이드가 사슬처럼 이어져 두 가닥이 나선형으로 꼬인 구조를 하고 있습니다.',
    '1953년 제임스 왓슨과 프랜시스 크릭은 로절린드 프랭클린이 X선으로 촬영한 DNA 회절 사진을 바탕으로 이 이중나선 구조를 밝혀냈습니다. 두 가닥은 아데닌-티민, 구아닌-사이토신이라는 정해진 짝(염기쌍)으로만 결합하는데, 이 규칙적인 짝짓기 덕분에 세포가 분열할 때 유전 정보를 정확히 복제할 수 있습니다.'] },
  { exp: -8, title: '거대 분자', compare: 'DNA 두 가닥이 겹친 두께의 몇 배', paragraphs: [
    '단백질처럼 수천~수만 개의 원자가 정교하게 얽혀 만들어진 거대 분자들이 모습을 드러내는 규모입니다. 화학 반응의 속도를 높이는 효소, 산소를 운반하는 헤모글로빈 같은 단백질들이 모두 이 크기에 해당합니다.',
    '단백질은 20종류의 아미노산이 특정한 순서로 연결된 사슬이 접히고 뭉쳐서 만들어집니다. 이 접히는 방식(입체 구조)이 조금만 달라져도 단백질의 기능이 완전히 바뀌거나 사라질 수 있습니다. 최근에는 인공지능이 단백질의 접힘 구조를 예측하는 데 활용되면서, 신약 개발 속도가 크게 빨라지고 있습니다.'] },
  { exp: -7, title: '바이러스의 세계', compare: '독감 바이러스 지름 정도', paragraphs: [
    '빛의 파장보다도 작아 일반 광학 현미경으로는 볼 수 없는 영역입니다. 이 크기를 관찰하려면 전자를 이용해 상을 만드는 전자현미경이 필요합니다. 독감 바이러스, 코로나바이러스 같은 병원체들이 대략 이 크기에 해당합니다.',
    '바이러스는 스스로 물질대사를 하지 못하고 숙주 세포에 침투해서만 증식할 수 있어, 생물과 무생물의 경계에 있는 독특한 존재로 여겨집니다. 유전 정보(DNA 또는 RNA)를 단백질 껍질(캡시드)이 감싸고 있는 아주 단순한 구조지만, 이 작은 존재가 인류의 역사를 여러 차례 바꾸어 놓았습니다.'] },
  { exp: -6, title: '세포 속 소기관', compare: '세균(박테리아) 한 마리 크기', paragraphs: [
    '세포 안에서 에너지를 생산하는 발전소, 미토콘드리아가 뚜렷하게 보이는 크기입니다. 커다란 세균(대장균 등) 한 마리도 이 정도 크기를 가집니다. 광학 현미경으로 겨우 형태를 구분할 수 있는 한계에 가까운 영역입니다.',
    '흥미롭게도 미토콘드리아는 자신만의 독자적인 DNA를 가지고 있습니다. 이 때문에 과학자들은 미토콘드리아가 원래는 독립적으로 살던 세균이었는데, 아주 오래전 더 큰 세포에게 잡아먹힌 뒤 서로 도움을 주고받으며 함께 살게 되었다는 "세포내공생설"을 제안합니다. 우리 몸의 모든 세포 속에는 이렇게 먼 과거 공생의 흔적이 남아 있는 셈입니다.'] },
  { exp: -5, title: '하나의 세포', compare: '적혈구 지름(약 7~8㎛)의 몇 배', paragraphs: [
    '세포 하나하나가 뚜렷하게 구분되는 크기입니다. 세포막으로 둘러싸인 세포질과 그 속의 핵을 관찰할 수 있습니다. 사람의 적혈구는 지름이 약 7~8마이크로미터로, 온몸 구석구석까지 산소를 실어 나르기 위해 특별히 작고 유연하게 만들어졌습니다.',
    '1665년 로버트 훅은 자신이 만든 현미경으로 코르크 조각을 관찰하다가 작은 방들이 촘촘히 늘어선 구조를 발견하고, 이를 수도사들이 지내는 작은 방(cell)에 빗대어 "세포"라 이름 붙였습니다. 이후 슐라이덴과 슈반은 모든 생물이 세포로 이루어져 있다는 "세포설"을 정립했고, 이는 오늘날 생명과학의 가장 기본적인 원리 중 하나가 되었습니다.'] },
  { exp: -4, title: '세포 조직의 시작', compare: '머리카락 굵기(약 70~100㎛)', paragraphs: [
    '광학 현미경으로 들어서는 영역입니다. 사람 머리카락 굵기와 비슷한 크기에서, 피부를 이루는 낱개의 세포와 조직 구조가 서서히 드러나기 시작합니다.',
    '우리 몸은 약 37조 개의 세포로 이루어져 있으며, 비슷한 모양과 기능을 가진 세포들이 모여 조직을, 여러 조직이 모여 기관을, 여러 기관이 모여 기관계를 이룹니다. 피부 역시 표피·진피·피하지방층이라는 여러 조직이 겹겹이 쌓인 하나의 커다란 기관입니다.'] },
  { exp: -3, title: '맨눈의 한계', compare: '모래알 하나 크기', paragraphs: [
    '사람 눈으로 구별할 수 있는 가장 작은 크기, 모래알 한 톨 정도의 규모입니다. 사람의 눈은 약 0.1mm(100마이크로미터) 정도까지만 두 점을 구별할 수 있어, 이보다 작아지면 현미경 같은 도구의 도움이 반드시 필요합니다.',
    '"맨눈으로 볼 수 있다"와 "볼 수 없다"를 가르는 이 경계는 과학사에서도 중요한 의미를 가집니다. 17세기 레이우엔훅이 손수 만든 현미경으로 이 경계 너머의 미생물 세계를 처음 들여다보기 전까지, 인류는 이 크기 아래에 무엇이 있는지 전혀 알지 못했습니다.'] },
  { exp: -2, title: '피부 표면 확대', compare: '손톱 하나 크기', paragraphs: [
    '피부의 주름과 솜털 하나하나가 뚜렷해지는 손톱 크기의 영역입니다. 맨눈의 분해능 한계에 가까워져, 이보다 더 작은 구조를 보려면 돋보기 정도의 확대가 필요합니다.',
    '피부는 우리 몸에서 가장 넓은 기관으로, 성인 기준 전체 면적이 약 1.5~2제곱미터에 이릅니다. 외부의 세균이나 자외선으로부터 몸을 보호하고, 체온을 조절하며, 촉각을 통해 세상을 느끼게 해 주는 다재다능한 기관입니다.'] },
  { exp: -1, title: '손등 위, 피부의 세계', compare: '어른 손바닥 크기', paragraphs: [
    '카메라가 손등에 가까이 다가가면 피부의 결과 솜털이 보이기 시작합니다. 우리 몸의 가장 바깥층인 표피가 눈에 들어오는 규모입니다.',
    '표피 세포는 끊임없이 새로 만들어지고 낡은 세포는 떨어져 나갑니다 — 약 한 달을 주기로 피부 표면이 완전히 새로운 세포로 교체됩니다. 우리가 매일 보는 "나의 손"은 사실 한 달 전의 손과는 물질적으로 다른, 늘 새로워지고 있는 손인 셈입니다.'] },
  { exp: 0, title: '일상 속 우리의 눈높이', compare: '성인의 팔 길이 정도(1m)', paragraphs: [
    '피크닉을 즐기는 사람의 모습, 우리가 매일 보는 눈높이의 세계입니다. 이 사진 한 장에는 책, 과일, 접시 같은 일상의 물건들이 담겨 있습니다 — 모두 우리와 비슷한 크기의, 익숙한 세계입니다.',
    '지금부터는 이 1미터를 기준으로 10배씩 시야를 넓혀 우주의 끝까지, 그리고 10배씩 좁혀 원자 속 쿼크까지 여행을 떠납니다. 매 단계마다 보이는 대상이 이전 단계보다 정확히 10배씩 커지거나 작아진다는 사실을 기억하며 관찰해 보세요.'] },
  { exp: 1, title: '담요를 벗어나 공원으로', compare: '3층 건물 높이 정도', paragraphs: [
    '피크닉 자리를 둘러싼 잔디밭 전체가 시야에 들어옵니다. 사람은 이제 풍경 속 작은 점처럼 보이기 시작합니다.',
    '겨우 10배 커졌을 뿐인데 우리가 인식하는 "세계"는 완전히 달라집니다. 방금 전까지 보이던 책의 글자나 과일의 질감은 더 이상 보이지 않고, 대신 잔디밭의 전체적인 형태와 공간감이 눈에 들어옵니다. 이렇게 관찰 스케일이 달라지면 같은 대상도 전혀 다른 정보를 우리에게 알려줍니다.'] },
  { exp: 2, title: '공원 전체', compare: '축구장 하나 길이 정도', paragraphs: [
    '공원의 나무와 산책로, 자동차들이 한눈에 보이는 규모입니다. 도시의 한 구역을 조망하는 시야입니다.',
    '이 정도 크기부터는 드론이나 헬리콥터를 이용한 항공 촬영으로 흔히 볼 수 있는 풍경이 됩니다. 지도 서비스의 위성 사진을 확대·축소해 본 경험이 있다면, 지금 이 감각과 비슷하다고 생각하면 됩니다.'] },
  { exp: 3, title: '도시의 한 블록', compare: '도심 큰 블록 몇 개 크기', paragraphs: [
    '건물들이 모여 만든 거리와 구역이 보입니다. 사람의 존재는 더 이상 구별할 수 없을 만큼 작아졌습니다.',
    '도시 계획가나 건축가들은 바로 이 스케일에서 도시를 설계합니다. 도로의 폭, 건물 사이의 간격, 공원의 배치 같은 것들이 이 크기에서 사람들의 생활을 결정짓습니다.'] },
  { exp: 4, title: '도시 전체 조망', compare: '웬만한 도시 하나 전체 넓이', paragraphs: [
    '도시 전체의 도로망과 구획이 지도처럼 펼쳐집니다. 여객기가 순항하는 고도와 비슷한 높이에서 내려다보는 셈입니다.',
    '실제로 여객기의 순항 고도는 약 10~12km로, 정확히 이 스케일(10⁴ m)에 해당합니다. 창가 자리에서 아래를 내려다볼 때 도시가 마치 회로 기판처럼 보이는 이유가 바로 이 때문입니다.'] },
  { exp: 5, title: '대기권 바깥으로', compare: '카르만선(우주 경계, 고도 100km) 부근', paragraphs: [
    '지표면의 곡률이 서서히 느껴지기 시작하는 높이입니다. 이 부근을 흔히 지구 대기와 우주의 경계, 카르만선(고도 약 100km)이라 부릅니다.',
    '카르만선은 헝가리 출신 과학자 시어도어 폰 카르만의 계산에서 유래한, 국제적으로 통용되는 우주의 경계입니다. 이 고도를 넘으면 공기가 너무 희박해서 날개로 양력을 얻는 일반적인 비행기는 더 이상 날 수 없고, 로켓처럼 자체 추진력으로 움직이는 우주선만이 이 영역을 통과할 수 있습니다.'] },
  { exp: 6, title: '대륙의 일부', compare: '한반도 전체보다 조금 더 넓은 영역', paragraphs: [
    '국가 몇 개를 아우르는 넓은 지역이 한 화면에 들어옵니다. 지구가 둥글다는 사실이 뚜렷하게 보이는 규모입니다.',
    '국제우주정거장(ISS)이 지구를 도는 고도가 약 400km로, 이 스케일 근처입니다. 우주비행사들은 이 높이에서 국경선 없이 하나로 이어진 지구를 내려다보며 종종 인식의 전환을 경험한다고 이야기합니다.'] },
  { exp: 7, title: '지구 전체', compare: '지구 지름(약 12,742km)과 비슷', paragraphs: [
    '지구 전체가 하나의 파란 구슬처럼 보입니다. 대기, 바다, 대륙이 어우러진 우리 행성의 참모습입니다.',
    '지구의 지름은 약 12,742km, 표면의 71%가 물로 덮여 있습니다. 1972년 아폴로 17호 승무원이 촬영한 지구 전체 사진 "블루 마블(Blue Marble)"은 인류가 처음으로 자신이 사는 행성 전체를 눈으로 확인한 역사적인 순간이었습니다.'] },
  { exp: 8, title: '지구와 달 사이', compare: '지구-달 평균 거리(약 38만km)의 일부', paragraphs: [
    '지구를 벗어나 우주 공간으로 나갑니다. 지구와 달을 함께 시야에 담을 수 있는 거리입니다.',
    '지구와 달 사이의 평균 거리는 약 38만 km로, 빛의 속도로도 약 1.3초가 걸립니다. 아폴로 계획으로 달에 다녀온 우주비행사는 지금까지 단 12명뿐이며, 이들은 인류 중 유일하게 자신의 눈으로 지구 전체가 작은 구슬처럼 보이는 광경을 목격한 사람들입니다.'] },
  { exp: 9, title: '태양의 크기', compare: '태양 지름(약 139만km)과 비슷', paragraphs: [
    '태양계의 중심, 태양 하나의 크기와 맞먹는 규모입니다. 지구 100개 이상을 나란히 늘어놓아야 태양의 지름과 비슷해집니다.',
    '태양은 수소를 헬륨으로 융합시키는 핵융합 반응으로 스스로 빛을 내는 거대한 플라스마 덩어리입니다. 태양이 1초 동안 방출하는 에너지는 인류가 지금까지 만들어 쓴 모든 에너지를 합친 것보다도 많습니다. 태양빛이 지구까지 오는 데는 약 8분 20초가 걸립니다.'] },
  { exp: 10, title: '태양에 가까운 행성들', compare: '수성 공전 궤도 반지름 정도', paragraphs: [
    '태양에 가장 가까운 행성인 수성의 공전 궤도가 시야에 들어오는 규모입니다. 태양의 강한 중력이 지배하는 영역입니다.',
    '수성은 대기가 거의 없어 낮과 밤의 온도차가 무려 600°C에 이릅니다. 태양계 행성들은 모두 태양 주위를 도는데, 이 궤도 운동을 정확한 수식으로 처음 설명해낸 사람이 바로 요하네스 케플러입니다.'] },
  { exp: 11, title: '지구-태양 거리', compare: '1천문단위(AU, 약 1억 5천만km)', paragraphs: [
    '지구가 태양 주위를 도는 궤도 반지름과 같은 크기, 이른바 "1천문단위(AU)"입니다. 태양계 안 거리를 잴 때 널리 쓰이는 기준입니다.',
    '1AU는 약 1억 5천만 km에 해당합니다. 이 값을 처음 정밀하게 계산해낸 것은 18세기 금성의 태양면 통과 현상을 여러 나라 천문학자들이 동시에 관측한 국제 협력 프로젝트 덕분이었습니다.'] },
  { exp: 12, title: '목성 궤도 부근', compare: '목성 공전 궤도 반지름 정도', paragraphs: [
    '화성과 소행성대를 지나 거대 가스 행성인 목성의 궤도에 다다릅니다. 태양계 안쪽 암석 행성과 바깥쪽 가스 행성의 경계 지역입니다.',
    '목성은 태양계에서 가장 큰 행성으로, 지구가 1,300개 넘게 들어갈 정도의 부피를 가집니다. 목성의 강력한 중력은 소행성이나 혜성이 지구로 향하는 길목을 여러 차례 막아 주는 "우주 방패" 역할을 하는 것으로도 알려져 있습니다.'] },
  { exp: 13, title: '태양계 바깥 행성들', compare: '해왕성 공전 궤도 반지름 정도', paragraphs: [
    '태양계에서 가장 먼 행성인 해왕성의 궤도까지 시야가 넓어집니다. 태양빛은 이곳까지 오는 데 약 4시간이 걸립니다.',
    '해왕성은 1846년 실제 관측이 아니라 수학적 계산만으로 먼저 위치가 예측된 뒤 발견된 행성입니다. 천왕성의 궤도가 뉴턴의 중력 법칙대로 움직이지 않는 것을 이상하게 여긴 천문학자들이 "보이지 않는 행성의 중력 때문"이라 추론하고 그 위치를 계산해냈고, 실제로 그 자리에서 해왕성이 발견되었습니다.'] },
  { exp: 14, title: '태양계의 끝자락', compare: '태양권(헬리오스피어) 경계 부근', paragraphs: [
    '태양풍의 영향력이 약해지는 태양계의 실질적인 경계입니다. 보이저 탐사선이 통과한 영역이 바로 이 부근입니다.',
    '1977년 발사된 보이저 1호는 2012년 이 경계(태양권계면)를 넘어 성간 공간으로 진입한, 인류가 만든 물체 중 가장 멀리 나간 탐사선입니다. 보이저호에는 혹시 만날지 모를 외계 생명체를 위해 지구의 소리와 이미지를 담은 "골든 레코드"가 실려 있습니다.'] },
  { exp: 15, title: '가장 가까운 별을 향해', compare: '빛이 약 한 달 넘게 가야 하는 거리', paragraphs: [
    '태양계를 완전히 벗어나 성간 공간으로 나갑니다. 이제부터는 거리를 잴 때 킬로미터 대신 "광년(빛이 1년간 가는 거리)"이라는 단위를 쓰기 시작합니다.',
    '이 부근에는 태양계 형성 초기의 잔해로 이루어진 오르트 구름이 넓게 퍼져 있는 것으로 추정됩니다. 장주기 혜성들의 고향으로 여겨지는 이 영역은 태양의 중력이 미치는 가장 먼 가장자리이자, 다음 별까지 이어지는 광활한 빈 공간의 시작점입니다.'] },
  { exp: 16, title: '이웃 별들의 거리', compare: '가장 가까운 별 프록시마 켄타우리까지 거리(약 4.2광년)의 일부', paragraphs: [
    '태양이 아닌 다른 별들이 점점 가까워지는 규모입니다. 별과 별 사이는 상상 이상으로 텅 비어 있습니다.',
    '태양에서 가장 가까운 별인 프록시마 켄타우리까지의 거리는 약 4.2광년입니다. 현재 인류가 만든 가장 빠른 우주선으로도 이 별까지 가는 데 수만 년이 걸릴 만큼, 별과 별 사이의 거리는 우리의 직관을 아득히 뛰어넘습니다.'] },
  { exp: 17, title: '가까운 별들의 집합', compare: '태양 주변 10광년 이내 별들의 영역', paragraphs: [
    '태양을 둘러싼 몇몇 이웃 별들이 하나의 화면에 들어옵니다. 밤하늘에서 밝게 빛나는 별 중 일부가 이 거리 안에 있습니다.',
    '별의 밝기는 실제 밝기(절대등급)와 우리 눈에 보이는 밝기(겉보기등급)가 다릅니다. 아주 밝은 별이라도 멀리 있으면 어둡게 보이고, 상대적으로 어두운 별도 가까이 있으면 밝게 보입니다 — 밤하늘에서 가장 밝게 보이는 별들이 반드시 태양과 가장 가까운 별은 아닌 이유입니다.'] },
  { exp: 18, title: '국부 성간 구름', compare: '수십~수백 광년 규모의 성간 물질 영역', paragraphs: [
    '별과 별 사이를 채우는 희박한 가스와 먼지, 성간 물질의 존재가 느껴지는 규모입니다. 태양계는 이런 구름 속을 천천히 지나고 있습니다.',
    '성간 물질은 새로운 별이 태어나는 재료가 되기도 합니다. 거대한 가스 구름이 자체 중력으로 뭉치기 시작하면 중심부의 온도와 압력이 올라가고, 마침내 수소 핵융합이 시작되는 순간 새로운 별이 탄생합니다 — 태양도 약 46억 년 전 바로 이런 과정을 거쳐 태어났습니다.'] },
  { exp: 19, title: '우리은하 나선팔의 일부', compare: '은하수 나선팔 한 구역 크기', paragraphs: [
    '우리은하를 이루는 나선팔의 일부, 수많은 별이 모여 있는 지역이 보입니다. 태양은 이 나선팔 중 하나(오리온자리 팔)에 자리 잡고 있습니다.',
    '나선팔은 은하 전체가 회전하면서 만들어내는 밀도파 구조로, 별들이 실제로 그 모양대로 이동하는 것이 아니라 마치 교통 정체처럼 별이 지나가며 일시적으로 밀집되는 구간입니다. 태양은 은하 중심을 약 2억 3천만 년에 한 바퀴씩 돌고 있습니다.'] },
  { exp: 20, title: '은하 안쪽 깊숙이', compare: '은하 중심까지 거리의 일부', paragraphs: [
    '우리은하 중심부를 향해 시야가 확장됩니다. 수많은 별이 촘촘히 모인 은하 팽대부의 존재가 드러나기 시작합니다.',
    '우리은하 중심에는 태양 질량의 약 400만 배에 달하는 초거대질량 블랙홀, "궁수자리 A*"가 자리하고 있습니다. 2022년 사건지평선망원경(EHT) 국제 연구팀은 이 블랙홀의 실제 그림자 이미지를 최초로 촬영하는 데 성공했습니다.'] },
  { exp: 21, title: '우리은하 전체', compare: '은하수 지름(약 10만 광년)과 비슷', paragraphs: [
    '태양을 포함해 별 약 2000억 개로 이루어진 우리은하, 은하수 전체의 모습입니다. 소용돌이 모양의 나선팔 구조가 뚜렷하게 드러나는 규모입니다.',
    '맑은 날 밤 도시 불빛에서 멀리 떨어진 곳에 가면, 하늘을 가로지르는 희뿌연 띠로 우리은하의 일부를 직접 볼 수 있습니다. 옛사람들은 이 모습이 강물이 흐르는 것 같다 하여 "은하수(銀河水)", 즉 은빛 강이라는 이름을 붙였습니다.'] },
  { exp: 22, title: '국부은하군', compare: '안드로메다은하까지 거리(약 250만 광년)의 일부', paragraphs: [
    '우리은하와 이웃 은하들이 모인 "국부은하군" 영역입니다. 은하도 홀로 있지 않고 중력으로 묶여 무리를 이룹니다.',
    '안드로메다은하는 약 250만 광년 떨어져 있지만, 우리은하를 향해 초속 약 110km로 다가오고 있습니다. 약 40억 년 뒤에는 두 은하가 서로 충돌해 합쳐질 것으로 예측되는데, 별과 별 사이의 거리가 워낙 멀어 실제로 별들끼리 부딪힐 가능성은 거의 없다고 합니다.'] },
  { exp: 23, title: '은하들의 무리', compare: '국부초은하단 일부 영역', paragraphs: [
    '크고 작은 은하 수십 개가 무리 지어 있는 규모입니다. 은하 하나하나가 이제는 밝은 점 하나로 보이기 시작합니다.',
    '이런 은하 무리를 은하군(수십 개 이하) 또는 은하단(수백~수천 개)이라 부릅니다. 은하단 속 은하들 사이의 공간에는 수백만 도에 달하는 뜨거운 가스가 가득 차 있으며, 이는 X선 관측을 통해서만 확인할 수 있습니다.'] },
  { exp: 24, title: '초은하단', compare: '처녀자리 초은하단 규모', paragraphs: [
    '수천 개의 은하가 거대한 그물처럼 얽혀 있는 초은하단 규모입니다. 우주의 거대 구조가 서서히 그 모습을 드러냅니다.',
    '우리은하가 속한 초은하단은 "라니아케아(Laniakea)"라 불리며, 하와이어로 "가늠할 수 없는 하늘"이라는 뜻입니다. 2014년 천문학자들은 은하들의 이동 방향을 분석해 이 초은하단의 경계를 처음으로 지도로 그려냈습니다.'] },
  { exp: 25, title: '우주의 거미줄 구조', compare: '우주 거대구조(필라멘트)의 한 자락', paragraphs: [
    '은하들이 실처럼 이어진 필라멘트와 그 사이의 거대한 빈 공간(보이드)이 대비되어 보입니다. 우주는 균일하지 않고 거미줄 같은 구조로 짜여 있습니다.',
    '이 거대한 그물 구조를 "우주 거대구조(cosmic web)"라 부릅니다. 초기 우주의 아주 미세한 밀도 차이가 중력에 의해 점점 증폭되면서 물질이 특정 영역으로 모여들었고, 그 결과 은하가 밀집된 필라멘트와 은하가 거의 없는 텅 빈 보이드가 뚜렷하게 갈라졌습니다.'] },
  { exp: 26, title: '관측 가능한 우주', compare: '관측 가능한 우주의 지평선 규모', paragraphs: [
    '인류가 빛으로 관측할 수 있는 우주의 한계에 다다랐습니다. 이 거대한 그물 무늬 하나하나가 은하 수천억 개가 모인 초은하단입니다.',
    '우주는 약 138억 년 전 빅뱅으로 시작되었고, 그 이후로 계속 팽창하고 있습니다. "관측 가능한 우주"란 빅뱅 이후 빛이 우리에게 도달할 수 있었던 최대 범위를 뜻하며, 그 너머에도 우주는 계속 이어져 있을 것으로 추정되지만 우리는 그 빛을 아직 볼 수 없습니다. Powers of Ten 여행은 여기, 우리가 알 수 있는 우주의 끝에서 마무리됩니다.'] },
];

// 지수(exp)에 맞는 실제 이미지 파일 경로를 채워 넣는다
STEPS.forEach(step => {
  const n = Math.abs(step.exp).toString().padStart(2, '0');
  const prefix = step.exp < 0 ? 'm' : 'p';
  step.file = `powers_of_ten_steps/step_${prefix}${n}_2.jpg`;
});

const TOTAL = STEPS.length; // 45

// 모든 단계 이미지를 미리 불러와 둔다 (전환 도중 로딩이 덜 되어 화면이 흐릿하게 보이는 것을 방지)
const imageCache = {};
STEPS.forEach(step => {
  const img = new Image();
  img.src = step.file;
  imageCache[step.file] = img;
});

// ---------- 2. 유틸 ----------
// 지수 표기는 유니코드 위 첨자(⁻¹⁵ 등) 대신 실제 <sup>/<tspan> 태그로 그린다.
// 유니코드 위 첨자는 글꼴에 따라 일부 글자가 깨져 보이는 경우가 있어 이 방식이 더 안전하다.

// HTML 요소용: "10<sup>-15</sup> m" 형태
function expToHTML(exp) {
  return `10<sup>${exp}</sup>`;
}
// SVG <text> 요소용: <tspan>으로 위 첨자를 흉내낸다
function expToSVG(exp) {
  return `10<tspan baseline-shift="super" font-size="65%">${exp}</tspan>`;
}
// 스크린리더 aria 속성 등 순수 텍스트가 필요한 곳에 사용 (HTML 태그 불가)
function expToPlain(exp) {
  return `10^${exp}`;
}

// 컨테이너보다 텍스트가 길면 글자 크기를 단계적으로 줄인다 (모바일 레이아웃 보호)
function autoFitText(el, maxPx = 32, minPx = 14, step = 1) {
  let size = maxPx;
  el.style.fontSize = size + 'px';
  while (el.scrollWidth > el.clientWidth && size > minPx) {
    size -= step;
    el.style.fontSize = size + 'px';
  }
}

// ---------- 3. DOM 참조 ----------
const el = {
  magExponent: document.getElementById('mag-exponent'),
  magMultiple: document.getElementById('mag-multiple'),
  magCompare: document.getElementById('mag-compare'),
  stepTitle: document.getElementById('step-title'),
  stepDesc: document.getElementById('step-desc'),
  btnZoomIn: document.getElementById('btn-zoom-in'),
  btnZoomOut: document.getElementById('btn-zoom-out'),
  btnReset: document.getElementById('btn-reset'),
  btnAutoIn: document.getElementById('btn-auto-in'),
  btnAutoOut: document.getElementById('btn-auto-out'),
  rulerTrack: document.getElementById('ruler-track'),
  rulerFill: document.getElementById('ruler-fill'),
  rulerHandle: document.getElementById('ruler-handle'),
  rulerTicks: document.getElementById('ruler-ticks'),
  imgCurrent: document.getElementById('img-current'),
  imgNext: document.getElementById('img-next'),
  badgeGroup: document.getElementById('badge-group'),
  badgeExp: document.getElementById('badge-exp'),
  badgeLabel: document.getElementById('badge-label'),
  stageWrap: document.getElementById('stage-wrap'),
  stage: document.getElementById('stage'),
  btnHelp: document.getElementById('btn-help'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalClose: document.getElementById('modal-close'),
  btnToggleSound: document.getElementById('btn-toggle-sound'),
  btnToggleGuide: document.getElementById('btn-toggle-guide'),
  speedSlider: document.getElementById('speed-slider'),
  speedValue: document.getElementById('speed-value'),
  guideGroup: document.getElementById('guide-group'),
  guideInnerRect: document.getElementById('guide-inner-rect'),
  guideInnerLabel: document.getElementById('guide-inner-label'),
};

// ---------- 4. 눈금자 생성 ----------
// 지수가 낮을수록(-18) 왼쪽, 높을수록(26) 오른쪽에 위치 (가로 배치)
STEPS.forEach((step, idx) => {
  const tick = document.createElement('button');
  tick.type = 'button';
  // 4단계마다 + 양 끝만 라벨을 표시해 눈금자가 너무 빽빽해지지 않도록 한다
  const isMajor = (idx % 4 === 0 || idx === TOTAL - 1);
  tick.className = 'ruler-tick' + (isMajor ? ' tick-major' : ' tick-minor');
  tick.innerHTML = isMajor ? expToHTML(step.exp) : '·';
  tick.dataset.index = idx;
  tick.addEventListener('click', () => { stopAutoplay(); goToStep(idx); });
  el.rulerTicks.appendChild(tick);
});
const tickEls = Array.from(el.rulerTicks.children);

// ---------- 5. 상태 및 화면 갱신 ----------
let currentIndex = STEPS.findIndex(s => s.exp === 0); // 기준점(1m)에서 시작
let animToken = 0; // 진행 중인 애니메이션을 새 전환이 무효화할 때 쓰는 표식
let transitionDuration = 450; // 줌 전환에 걸리는 시간(ms), 속도 슬라이더로 조절

function updateStaticUI(idx) {
  const step = STEPS[idx];

  el.magExponent.innerHTML = `${expToHTML(step.exp)} m`;
  autoFitText(el.magExponent, 32, 16);
  el.magMultiple.innerHTML = `기준(1 m)의 ${expToHTML(step.exp)}배`;
  el.magCompare.textContent = step.compare;

  el.stepTitle.textContent = step.title;
  el.stepDesc.innerHTML = step.paragraphs.map(p => `<p>${p}</p>`).join('');

  el.badgeExp.innerHTML = `${expToSVG(step.exp)} m`;
  el.badgeLabel.textContent = step.title;

  // 눈금자 핸들 위치 (0~100%, 왼쪽이 0)
  const percent = (idx / (TOTAL - 1)) * 100;
  el.rulerHandle.style.left = percent + '%';
  el.rulerFill.style.width = percent + '%';
  el.rulerHandle.setAttribute('aria-valuenow', String(step.exp));
  el.rulerHandle.setAttribute('aria-valuemax', String(STEPS[TOTAL - 1].exp));
  el.rulerHandle.setAttribute('aria-valuetext', `${expToPlain(step.exp)} 미터`);

  tickEls.forEach((t, i) => t.classList.toggle('active', i === idx));

  el.btnZoomIn.disabled = idx === 0;
  el.btnZoomOut.disabled = idx === TOTAL - 1;
  el.btnAutoIn.disabled = idx === 0;
  el.btnAutoOut.disabled = idx === TOTAL - 1;

  updateGuideOverlay(idx);
}

// 가이드라인: 한 단계 더 확대하면(전체의 1/10 영역) 보이는 범위를 사각형으로 표시
function updateGuideOverlay(idx) {
  const hasNextZoomIn = idx > 0;
  const show = guideEnabled && hasNextZoomIn;
  el.guideGroup.classList.toggle('hidden-guide', !show);
  if (hasNextZoomIn) {
    const nextExp = STEPS[idx - 1].exp;
    el.guideInnerLabel.innerHTML = expToSVG(nextExp) + ' m';
  }
}

// SVG는 viewBox 좌표계라 화면(스테이지) 폭이 좁아지면 배지·스케일바 글자도 함께 작아진다.
// 화면 크기와 상관없이 항상 읽을 수 있는 크기로 보이도록 실제 렌더링 폭에 반비례해
// 역보정 스케일을 적용한다 (모바일에서 글자가 너무 작아지는 문제 방지).
const STAGE_REF_WIDTH = 900; // 오버레이 글자 크기를 설계한 기준 스테이지 폭(px)
function syncStageOverlayScale() {
  const w = el.stage.getBoundingClientRect().width;
  if (!w) return;
  const k = Math.max(0.6, Math.min(STAGE_REF_WIDTH / w, 2.5)).toFixed(3);
  el.badgeGroup.setAttribute('transform', `translate(20,20) scale(${k})`);
  el.guideInnerLabel.setAttribute('transform', `translate(500,435) scale(${k}) translate(-500,-435)`);
}

// 애니메이션 도중 상태가 꼬였을 때(창이 백그라운드로 가서 rAF가 멈추는 등) 항상
// 되돌아올 수 있는 깨끗한 기준 상태로 두 이미지를 맞춘다
function snapImages() {
  el.imgCurrent.style.opacity = '1';
  el.imgNext.style.opacity = '0';
  el.stage.style.transform = 'scale(1)';
}

// requestAnimationFrame으로 두 이미지를 크로스페이드 + 살짝 확대/축소 펄스
function crossfadeTo(newIndex) {
  const direction = newIndex > currentIndex ? 'out' : 'in'; // 지수 증가=줌아웃, 감소=줌인
  const nextFile = STEPS[newIndex].file;
  const token = ++animToken; // 이 전환보다 나중에 시작된 전환이 있으면 무시하기 위한 표식
  snapImages(); // 이전에 중단된 애니메이션이 남아있어도 깨끗하게 시작
  playZoomTone(direction);

  function startFade() {
    if (token !== animToken) return; // 그 사이 더 최신 전환이 시작됐으면 건너뜀
    el.imgNext.setAttribute('href', nextFile);
    el.imgNext.style.opacity = '0';

    const duration = transitionDuration;
    const startTime = performance.now();

    function frame(now) {
      if (token !== animToken) return; // 중간에 다른 단계로 이동하면 이 루프는 중단
      const t = Math.min(1, (now - startTime) / duration);
      el.imgNext.style.opacity = String(t);
      el.imgCurrent.style.opacity = String(1 - t);

      // 살짝 확대되었다가 제자리로 돌아오는 펄스 (줌 방향에 따라 부호 반전)
      const pulse = Math.sin(t * Math.PI) * (direction === 'in' ? 0.035 : -0.025);
      el.stage.style.transform = `scale(${1 + pulse})`;

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        el.imgCurrent.setAttribute('href', nextFile);
        snapImages();
      }
    }
    requestAnimationFrame(frame);
  }

  // 이미지가 완전히 로드되기 전에 페이드를 시작하면 화면이 흐릿하게 깨져 보이므로
  // 미리 불러온(preload) 이미지가 준비된 뒤에만 전환을 시작한다
  const cached = imageCache[nextFile];
  if (cached && cached.complete && cached.naturalWidth > 0) {
    startFade();
  } else {
    const img = cached || new Image();
    imageCache[nextFile] = img;
    img.addEventListener('load', startFade, { once: true });
    if (!cached) img.src = nextFile;
  }
}

function goToStep(idx) {
  idx = Math.max(0, Math.min(TOTAL - 1, idx));
  if (idx === currentIndex) return;
  updateStaticUI(idx);
  crossfadeTo(idx);
  currentIndex = idx;
}

// ---------- 6. 버튼 조작 (줌인 / 기준점 / 줌아웃) ----------
const STEP_ZERO_INDEX = STEPS.findIndex(s => s.exp === 0);

el.btnZoomIn.addEventListener('click', () => { stopAutoplay(); initAudio(); goToStep(currentIndex - 1); });
el.btnZoomOut.addEventListener('click', () => { stopAutoplay(); initAudio(); goToStep(currentIndex + 1); });
el.btnReset.addEventListener('click', () => { stopAutoplay(); initAudio(); goToStep(STEP_ZERO_INDEX); });

// ---------- 6-1. 자동 줌인 / 줌아웃 재생 ----------
let autoplayTimer = null;
let autoplayDirection = null; // 'in' | 'out' | null

function updateAutoplayButtonsUI() {
  el.btnAutoIn.classList.toggle('active', autoplayDirection === 'in');
  el.btnAutoIn.textContent = autoplayDirection === 'in' ? '⏸ 정지' : '▶ 자동 줌인';
  el.btnAutoOut.classList.toggle('active', autoplayDirection === 'out');
  el.btnAutoOut.textContent = autoplayDirection === 'out' ? '⏸ 정지' : '▶ 자동 줌아웃';
}

function stopAutoplay() {
  if (autoplayTimer) { clearTimeout(autoplayTimer); autoplayTimer = null; }
  autoplayDirection = null;
  updateAutoplayButtonsUI();
}

function startAutoplay(direction) {
  stopAutoplay();
  autoplayDirection = direction;
  updateAutoplayButtonsUI();
  const step = direction === 'in' ? -1 : 1;
  runAutoplayLoop(step);
}

// 자동재생 간격은 현재 전환 속도(transitionDuration)에 맞춰 매번 다시 계산한다
// (속도 슬라이더를 재생 도중 바꿔도 즉시 반영되도록 setTimeout 재귀로 구현)
function runAutoplayLoop(step) {
  const interval = transitionDuration + 200; // 전환이 끝날 시간을 넉넉히 두고 다음 단계로
  autoplayTimer = setTimeout(() => {
    if (autoplayDirection === null) return; // 그 사이 정지된 경우
    const next = currentIndex + step;
    if (next < 0 || next >= TOTAL) { stopAutoplay(); return; }
    goToStep(next);
    runAutoplayLoop(step);
  }, interval);
}

el.btnAutoIn.addEventListener('click', () => {
  initAudio();
  if (autoplayDirection === 'in') stopAutoplay();
  else startAutoplay('in');
});
el.btnAutoOut.addEventListener('click', () => {
  initAudio();
  if (autoplayDirection === 'out') stopAutoplay();
  else startAutoplay('out');
});

// ---------- 6-2. 전환 속도 슬라이더 / 가이드라인 토글 ----------
function updateSpeedLabel() {
  const ms = transitionDuration;
  const label = ms <= 300 ? '빠름' : ms >= 800 ? '느림' : '보통';
  el.speedValue.textContent = `${label} (${(ms / 1000).toFixed(2)}초)`;
}
el.speedSlider.addEventListener('input', () => {
  transitionDuration = Number(el.speedSlider.value);
  updateSpeedLabel();
});
updateSpeedLabel();

// ---------- 6-3. 효과음 / 가이드라인 토글 (상단바 버튼) ----------
let soundEnabled = true;
let guideEnabled = true;

el.btnToggleSound.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  el.btnToggleSound.classList.toggle('active', soundEnabled);
  el.btnToggleSound.setAttribute('aria-pressed', String(soundEnabled));
  if (soundEnabled) initAudio();
});
el.btnToggleGuide.addEventListener('click', () => {
  guideEnabled = !guideEnabled;
  el.btnToggleGuide.classList.toggle('active', guideEnabled);
  el.btnToggleGuide.setAttribute('aria-pressed', String(guideEnabled));
  updateGuideOverlay(currentIndex);
});

// ---------- 7. 눈금자 드래그 (마우스 + 터치 공용 Pointer Events) ----------
let dragging = false;

function indexFromClientX(clientX) {
  const rect = el.rulerTrack.getBoundingClientRect();
  const fraction = (clientX - rect.left) / rect.width; // 왼쪽=0, 오른쪽=1
  const clamped = Math.max(0, Math.min(1, fraction));
  return Math.round(clamped * (TOTAL - 1));
}

// setPointerCapture는 아주 드물게(예: 이미 해제된 포인터 ID) 예외를 던질 수 있으므로
// 안전하게 감싸서 호출한다. 실패해도 드래그 자체는 pointermove 리스너로 계속 동작한다.
function safeSetPointerCapture(elm, pointerId) {
  try { elm.setPointerCapture(pointerId); } catch (err) { /* 무시 */ }
}

el.rulerHandle.addEventListener('pointerdown', (e) => {
  e.preventDefault(); // 브라우저 기본 텍스트 선택/드래그 동작을 막아 커스텀 드래그와 충돌하지 않게 한다
  stopAutoplay();
  dragging = true;
  safeSetPointerCapture(el.rulerHandle, e.pointerId);
  initAudio();
});
el.rulerTrack.addEventListener('pointerdown', (e) => {
  if (e.target === el.rulerHandle) return;
  e.preventDefault();
  stopAutoplay();
  initAudio();
  goToStep(indexFromClientX(e.clientX));
  // 트랙을 누른 채로 바로 끌 수 있도록, 핸들이 아닌 트랙을 눌렀을 때도 드래그를 이어서 시작한다
  dragging = true;
  safeSetPointerCapture(el.rulerHandle, e.pointerId);
});
window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const idx = indexFromClientX(e.clientX);
  if (idx !== currentIndex) goToStep(idx);
});
// pointerup뿐 아니라 pointercancel(터치 취소, 창 밖으로 나감 등)에서도 반드시 드래그 상태를
// 풀어줘야 한다. 그렇지 않으면 포인터 캡처가 눈금자 핸들에 계속 남아 다른 버튼 클릭이
// 먹히지 않는 것처럼 보이는 문제가 생긴다.
function endRulerDrag(e) {
  if (!dragging) return;
  dragging = false;
  if (e && e.pointerId !== undefined && el.rulerHandle.hasPointerCapture(e.pointerId)) {
    el.rulerHandle.releasePointerCapture(e.pointerId);
  }
}
window.addEventListener('pointerup', endRulerDrag);
window.addEventListener('pointercancel', endRulerDrag);

// 키보드 접근성 (핸들에 포커스 후 방향키)
el.rulerHandle.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { stopAutoplay(); goToStep(currentIndex + 1); }
  if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { stopAutoplay(); goToStep(currentIndex - 1); }
});

// ---------- 8. 시뮬레이션 화면: 마우스 휠 & 두 손가락 핀치(터치) ----------
let wheelCooldown = false;
el.stageWrap.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (wheelCooldown) return;
  wheelCooldown = true;
  setTimeout(() => { wheelCooldown = false; }, 180);
  stopAutoplay();
  initAudio();
  if (e.deltaY > 0) goToStep(currentIndex + 1); // 휠 아래 = 줌아웃
  else goToStep(currentIndex - 1);              // 휠 위 = 줌인
}, { passive: false });

// 두 손가락 사이 화면좌표 거리를 계산해 핀치 줌인/줌아웃 판정 (태블릿 권장)
let pinchStartDist = null;
function touchDistance(touches) {
  const [a, b] = touches;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
el.stageWrap.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    stopAutoplay();
    pinchStartDist = touchDistance(e.touches);
    initAudio();
  }
}, { passive: true });
el.stageWrap.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2 && pinchStartDist !== null) {
    e.preventDefault();
    const dist = touchDistance(e.touches);
    const delta = dist - pinchStartDist;
    const THRESHOLD = 40; // 이 정도 손가락 간격 변화가 있어야 한 단계 이동
    if (Math.abs(delta) > THRESHOLD) {
      if (delta > 0) goToStep(currentIndex - 1); // 손가락을 벌리면 줌인
      else goToStep(currentIndex + 1);           // 손가락을 모으면 줌아웃
      pinchStartDist = dist; // 기준 거리 갱신 (연속 핀치 대응)
    }
  }
}, { passive: false });
el.stageWrap.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) pinchStartDist = null;
});

// ---------- 9. 도움말 모달 ----------
function openModal() { el.modalOverlay.hidden = false; }
function closeModal() { el.modalOverlay.hidden = true; }
el.btnHelp.addEventListener('click', () => { initAudio(); openModal(); });
el.modalClose.addEventListener('click', closeModal);
el.modalOverlay.addEventListener('click', (e) => { if (e.target === el.modalOverlay) closeModal(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !el.modalOverlay.hidden) closeModal(); });

// ---------- 10. Web Audio API 효과음 (외부 음원 없이 oscillator로 합성) ----------
let audioCtx = null;
function initAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();
}

function playTone({ startFreq, endFreq, duration, type = 'sine', gain = 0.08 }) {
  if (!audioCtx || !soundEnabled) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), audioCtx.currentTime + duration);

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(gain, audioCtx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gainNode).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration + 0.02);
}

// 줌인 = 상승 스윕음, 줌아웃 = 하강 스윕음
function playZoomTone(direction) {
  if (direction === 'in') {
    playTone({ startFreq: 320, endFreq: 900, duration: 0.16 });
  } else {
    playTone({ startFreq: 900, endFreq: 260, duration: 0.16 });
  }
}

// 탭이 백그라운드로 갔다가 돌아왔을 때 애니메이션이 멈춰 화면이 어중간하게
// 섞여 보일 수 있으므로, 다시 보이는 시점에 현재 단계 이미지로 확실히 맞춘다
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    animToken++; // 멈춰 있던 이전 프레임 루프를 무효화
    el.imgCurrent.setAttribute('href', STEPS[currentIndex].file);
    snapImages();
  }
});

// ---------- 11. 초기화 ----------
el.imgCurrent.setAttribute('href', STEPS[currentIndex].file);
el.rulerHandle.setAttribute('aria-valuemin', String(STEPS[0].exp)); // 실제 최소 지수(-18)로 보정
updateStaticUI(currentIndex);
syncStageOverlayScale();

window.addEventListener('resize', () => {
  autoFitText(el.magExponent, 32, 16);
  syncStageOverlayScale();
});
