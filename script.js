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
  { exp: -18, title: '물질의 최전선', compare: '거대강입자가속기(LHC)가 탐사하는 최소 규모',
    desc: '현재 인류의 기술로 실험적으로 들여다볼 수 있는 가장 작은 영역입니다. 이보다 작은 세계에 무엇이 있는지는 아직 정확히 밝혀지지 않았습니다.' },
  { exp: -17, title: '쿼크의 활동 영역', compare: '실험으로 확인된 가장 작은 규모의 10배',
    desc: '양성자는 쿼크라는 더 작은 입자 3개로 이루어져 있습니다. 쿼크들은 강한 핵력을 매개하는 글루온으로 서로 단단히 묶여 있습니다.' },
  { exp: -16, title: '양성자 내부', compare: '양성자 지름의 10분의 1',
    desc: "양성자 속으로 더 들어가면 더 작은 입자들의 활동이 나타납니다. 이 영역부터는 우리가 아는 '크기' 개념이 점점 모호해집니다." },
  { exp: -15, title: '양성자와 중성자', compare: '양성자 지름(약 1.7fm)',
    desc: '원자핵을 이루는 양성자 하나, 중성자 하나의 크기입니다. 이들을 강하게 묶어주는 힘을 강한 핵력이라고 부릅니다.' },
  { exp: -14, title: '원자핵 도착', compare: '무거운 원자핵의 지름 정도',
    desc: '양성자와 중성자가 뭉쳐 이루어진 원자핵의 크기입니다. 전자구름에 비하면 원자핵은 놀랍도록 작고 밀도가 높습니다.' },
  { exp: -13, title: '원자핵을 향해', compare: '원자핵 지름의 10배 거리',
    desc: '원자핵에 점점 가까워지고 있습니다. 원자 전체 크기에 비해 원자핵이 얼마나 작은지 체감할 수 있는 단계입니다.' },
  { exp: -12, title: '텅 빈 원자 내부', compare: '원자핵까지 남은 거리',
    desc: '원자의 대부분은 실제로는 빈 공간입니다. 전자가 원자핵 주위를 아주 멀리서 돌고 있다는 것을 실감할 수 있는 규모입니다.' },
  { exp: -11, title: '전자구름 속으로', compare: '원자 반지름의 10분의 1',
    desc: '원자 내부, 전자가 확률적으로 존재하는 전자구름 안쪽으로 들어갑니다. 대부분은 텅 빈 공간이라는 사실이 드러나기 시작합니다.' },
  { exp: -10, title: '원자 하나', compare: '수소 원자 지름 정도(약 0.1nm)',
    desc: '드디어 물질을 이루는 기본 단위인 원자가 보이는 규모입니다. 원자핵을 둘러싼 전자구름의 바깥 경계가 이 크기를 결정합니다.' },
  { exp: -9, title: 'DNA 이중나선', compare: 'DNA 두 가닥 나선의 지름(약 2nm)',
    desc: '유전 정보를 담은 DNA 이중나선의 굵기와 비슷한 규모입니다. 원자 몇 개가 이어진 정도의 매우 작은 크기입니다.' },
  { exp: -8, title: '거대 분자', compare: 'DNA 두 가닥이 겹친 두께의 몇 배',
    desc: '단백질 같은 거대 분자들이 하나씩 구분되기 시작합니다. 생명 활동을 담당하는 분자 기계들의 크기입니다.' },
  { exp: -7, title: '바이러스의 세계', compare: '독감 바이러스 지름 정도',
    desc: '빛보다 짧은 파장을 쓰는 전자현미경이 필요한 영역입니다. 세포막의 두께나 커다란 바이러스 입자가 이 규모에 해당합니다.' },
  { exp: -6, title: '세포 속 소기관', compare: '세균(박테리아) 한 마리 크기',
    desc: '세포 안의 미토콘드리아 같은 소기관이나 커다란 세균이 보이기 시작하는 규모입니다. 광학 현미경 분해능의 한계에 가까워집니다.' },
  { exp: -5, title: '하나의 세포', compare: '적혈구 지름(약 7~8㎛)의 몇 배',
    desc: '세포 하나하나가 뚜렷하게 구분되는 크기입니다. 세포막으로 둘러싸인 세포질과 핵의 윤곽을 관찰할 수 있는 규모입니다.' },
  { exp: -4, title: '세포 조직의 시작', compare: '머리카락 굵기(약 70~100㎛)',
    desc: '광학 현미경으로 들어서는 영역입니다. 피부를 이루는 낱개의 세포와 조직 구조가 서서히 드러납니다.' },
  { exp: -3, title: '맨눈의 한계', compare: '모래알 하나 크기',
    desc: '사람 눈으로 구별할 수 있는 가장 작은 크기에 가깝습니다. 이보다 작아지면 현미경 없이는 아무것도 보이지 않습니다.' },
  { exp: -2, title: '피부 표면 확대', compare: '손톱 하나 크기',
    desc: '피부 주름과 솜털 하나하나가 뚜렷해집니다. 맨눈의 분해능 한계에 가까워져, 더 작은 구조는 돋보기가 필요합니다.' },
  { exp: -1, title: '손등 위, 피부의 세계', compare: '어른 손바닥 크기',
    desc: '카메라가 손등에 가까이 다가가면 피부의 결과 솜털이 보이기 시작합니다. 우리 몸의 가장 바깥층인 표피가 눈에 들어오는 규모입니다.' },
  { exp: 0, title: '일상 속 우리의 눈높이', compare: '성인의 팔 길이 정도(1m)',
    desc: '피크닉을 즐기는 사람의 모습, 우리가 매일 보는 눈높이의 세계입니다. 이제부터 10배씩 시야를 넓히며 우주 끝까지 나가봅니다.' },
  { exp: 1, title: '담요를 벗어나 공원으로', compare: '3층 건물 높이 정도',
    desc: '피크닉 자리를 둘러싼 잔디밭 전체가 시야에 들어옵니다. 사람은 이제 풍경 속 작은 점처럼 보이기 시작합니다.' },
  { exp: 2, title: '공원 전체', compare: '축구장 하나 길이 정도',
    desc: '공원의 나무와 산책로, 자동차들이 한눈에 보이는 규모입니다. 도시의 한 구역을 조망하는 시야입니다.' },
  { exp: 3, title: '도시의 한 블록', compare: '도심 큰 블록 몇 개 크기',
    desc: '건물들이 모여 만든 거리와 구역이 보입니다. 사람의 존재는 더 이상 구별할 수 없을 만큼 작아졌습니다.' },
  { exp: 4, title: '도시 전체 조망', compare: '웬만한 도시 하나 전체 넓이',
    desc: '도시 전체의 도로망과 구획이 지도처럼 펼쳐집니다. 여객기가 순항하는 고도와 비슷한 높이에서 내려다보는 셈입니다.' },
  { exp: 5, title: '대기권 바깥으로', compare: '카르만선(우주 경계, 고도 100km) 부근',
    desc: '지표면의 곡률이 서서히 느껴지기 시작하는 높이입니다. 이 부근을 흔히 지구 대기와 우주의 경계로 봅니다.' },
  { exp: 6, title: '대륙의 일부', compare: '한반도 전체보다 조금 더 넓은 영역',
    desc: '국가 몇 개를 아우르는 넓은 지역이 한 화면에 들어옵니다. 지구가 둥글다는 사실이 뚜렷하게 보이는 규모입니다.' },
  { exp: 7, title: '지구 전체', compare: '지구 지름(약 12,742km)과 비슷',
    desc: '이제 지구 전체가 하나의 파란 구슬처럼 보입니다. 대기, 바다, 대륙이 어우러진 우리 행성의 참모습입니다.' },
  { exp: 8, title: '지구와 달 사이', compare: '지구-달 평균 거리(약 38만km)의 일부',
    desc: '지구를 벗어나 우주 공간으로 나갑니다. 지구와 달을 함께 시야에 담을 수 있는 거리입니다.' },
  { exp: 9, title: '태양의 크기', compare: '태양 지름(약 139만km)과 비슷',
    desc: '태양계의 중심, 태양 하나의 크기와 맞먹는 규모입니다. 지구 100개 이상을 나란히 늘어놓아야 태양 지름과 비슷해집니다.' },
  { exp: 10, title: '태양에 가까운 행성들', compare: '수성 공전 궤도 반지름 정도',
    desc: '태양에 가장 가까운 행성인 수성의 공전 궤도가 시야에 들어오는 규모입니다. 태양의 강한 중력이 지배하는 영역입니다.' },
  { exp: 11, title: '지구-태양 거리', compare: '1천문단위(AU, 약 1억 5천만km)',
    desc: "지구가 태양 주위를 도는 궤도 반지름과 같은 크기, 이른바 '1천문단위(AU)'입니다. 태양계 안 거리를 잴 때 널리 쓰이는 기준입니다." },
  { exp: 12, title: '목성 궤도 부근', compare: '목성 공전 궤도 반지름 정도',
    desc: '화성과 소행성대를 지나 거대 가스 행성인 목성의 궤도에 다다릅니다. 태양계 안쪽 암석 행성과 바깥쪽 가스 행성의 경계 지역입니다.' },
  { exp: 13, title: '태양계 바깥 행성들', compare: '해왕성 공전 궤도 반지름 정도',
    desc: '태양계에서 가장 먼 행성인 해왕성의 궤도까지 시야가 넓어집니다. 태양빛은 이곳까지 오는 데 약 4시간이 걸립니다.' },
  { exp: 14, title: '태양계의 끝자락', compare: '태양권(헬리오스피어) 경계 부근',
    desc: '태양풍의 영향력이 약해지는 태양계의 실질적인 경계입니다. 보이저 탐사선이 통과한 영역이 바로 이 부근입니다.' },
  { exp: 15, title: '가장 가까운 별을 향해', compare: '빛이 약 한 달 넘게 가야 하는 거리',
    desc: "태양계를 완전히 벗어나 성간 공간으로 나갑니다. 이제부터는 거리를 잴 때 '광년(빛이 1년간 가는 거리)'을 쓰기 시작합니다." },
  { exp: 16, title: '이웃 별들의 거리', compare: '가장 가까운 별 프록시마 켄타우리까지 거리(약 4.2광년)의 일부',
    desc: '태양이 아닌 다른 별들이 점점 가까워지는 규모입니다. 별과 별 사이는 상상 이상으로 텅 비어 있습니다.' },
  { exp: 17, title: '가까운 별들의 집합', compare: '태양 주변 10광년 이내 별들의 영역',
    desc: '태양을 둘러싼 몇몇 이웃 별들이 하나의 화면에 들어옵니다. 밤하늘에 밝게 보이는 별 중 일부가 이 거리 안에 있습니다.' },
  { exp: 18, title: '국부 성간 구름', compare: '수십~수백 광년 규모의 성간 물질 영역',
    desc: '별과 별 사이를 채우는 희박한 가스와 먼지, 성간 물질의 존재가 느껴지는 규모입니다. 태양계는 이런 구름 속을 천천히 지나고 있습니다.' },
  { exp: 19, title: '우리은하 나선팔의 일부', compare: '은하수 나선팔 한 구역 크기',
    desc: '우리은하를 이루는 나선팔의 일부, 수많은 별이 모여 있는 지역이 보입니다. 태양은 이 나선팔 중 하나에 자리 잡고 있습니다.' },
  { exp: 20, title: '은하 안쪽 깊숙이', compare: '은하 중심까지 거리의 일부',
    desc: '우리은하 중심부를 향해 시야가 확장됩니다. 수많은 별이 촘촘히 모인 은하 팽대부의 존재가 드러나기 시작합니다.' },
  { exp: 21, title: '우리은하 전체', compare: '은하수 지름(약 10만 광년)과 비슷',
    desc: '태양을 포함해 별 약 2000억 개로 이루어진 우리은하, 은하수 전체의 모습입니다. 소용돌이 모양의 나선팔 구조가 뚜렷하게 드러나는 규모입니다.' },
  { exp: 22, title: '국부은하군', compare: '안드로메다은하까지 거리(약 250만 광년)의 일부',
    desc: "우리은하와 이웃 은하들이 모인 '국부은하군' 영역입니다. 은하도 홀로 있지 않고 중력으로 묶여 무리를 이룹니다." },
  { exp: 23, title: '은하들의 무리', compare: '국부초은하단 일부 영역',
    desc: '크고 작은 은하 수십 개가 무리 지어 있는 규모입니다. 은하 하나하나가 이제는 밝은 점 하나로 보이기 시작합니다.' },
  { exp: 24, title: '초은하단', compare: '처녀자리 초은하단 규모',
    desc: '수천 개의 은하가 거대한 그물처럼 얽혀 있는 초은하단 규모입니다. 우주의 거대 구조가 서서히 그 모습을 드러냅니다.' },
  { exp: 25, title: '우주의 거미줄 구조', compare: '우주 거대구조(필라멘트)의 한 자락',
    desc: '은하들이 실처럼 이어진 필라멘트와 그 사이의 거대한 빈 공간(보이드)이 대비되어 보입니다. 우주는 균일하지 않고 거미줄 같은 구조로 짜여 있습니다.' },
  { exp: 26, title: '관측 가능한 우주', compare: '관측 가능한 우주의 지평선 규모',
    desc: '인류가 빛으로 관측할 수 있는 우주의 한계에 다다랐습니다. 이 거대한 그물 무늬 하나하나가 은하 수천억 개가 모인 초은하단입니다.' },
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
  scalebarGroup: document.getElementById('scalebar-group'),
  scalebarText: document.getElementById('scalebar-text'),
  stageWrap: document.getElementById('stage-wrap'),
  stage: document.getElementById('stage'),
  btnHelp: document.getElementById('btn-help'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalClose: document.getElementById('modal-close'),
  chkSound: document.getElementById('chk-sound'),
  chkGuide: document.getElementById('chk-guide'),
  speedSlider: document.getElementById('speed-slider'),
  speedValue: document.getElementById('speed-value'),
  guideGroup: document.getElementById('guide-group'),
  guideInnerRect: document.getElementById('guide-inner-rect'),
  guideInnerLabel: document.getElementById('guide-inner-label'),
};

// ---------- 4. 눈금자 생성 ----------
// 지수가 낮을수록(-18) 아래, 높을수록(26) 위에 위치 (column-reverse 레이아웃)
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
  el.stepDesc.textContent = step.desc;

  el.badgeExp.innerHTML = `${expToSVG(step.exp)} m`;
  el.badgeLabel.textContent = step.title;
  el.scalebarText.innerHTML = `${expToSVG(step.exp)} m`;

  // 눈금자 핸들 위치 (0~100%)
  const percent = (idx / (TOTAL - 1)) * 100;
  el.rulerHandle.style.bottom = percent + '%';
  el.rulerFill.style.height = percent + '%';
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
  const show = el.chkGuide.checked && hasNextZoomIn;
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
  el.scalebarGroup.setAttribute('transform', `translate(20,940) scale(${k})`);
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

el.chkGuide.addEventListener('change', () => updateGuideOverlay(currentIndex));

// ---------- 7. 눈금자 드래그 (마우스 + 터치 공용 Pointer Events) ----------
let dragging = false;

function indexFromClientY(clientY) {
  const rect = el.rulerTrack.getBoundingClientRect();
  const fraction = (rect.bottom - clientY) / rect.height; // 아래=0, 위=1
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
  goToStep(indexFromClientY(e.clientY));
  // 트랙을 누른 채로 바로 끌 수 있도록, 핸들이 아닌 트랙을 눌렀을 때도 드래그를 이어서 시작한다
  dragging = true;
  safeSetPointerCapture(el.rulerHandle, e.pointerId);
});
window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const idx = indexFromClientY(e.clientY);
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
  if (!audioCtx || !el.chkSound.checked) return;
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
