const nasa = (title: string, path: string) => ({ title: "NASA · " + title, url: "https://science.nasa.gov/" + path });
export const topicSources: Record<string, {title:string;url:string}[]> = {
  sun:[nasa("태양의 구조와 자전","sun/facts/")],
  mercury:[nasa("수성의 자전과 태양일","mercury/facts/")],
  venus:[nasa("금성의 대기와 자전","venus/venus-facts/")],
  earth:[nasa("지구의 사실","earth/facts/")],
  mars:[nasa("화성의 사실","mars/facts/")],
  jupiter:[nasa("목성의 사실","jupiter/jupiter-facts/"),nasa("목성의 위성 · 2026년 8월","jupiter/jupiter-moons/"),{title:"ESA · 주스 탐사 일정",url:"https://www.esa.int/Science_Exploration/Space_Science/Juice"}],
  saturn:[nasa("토성의 사실","saturn/facts/"),nasa("토성의 위성 · 2026년 8월","saturn/moons/"),nasa("드래곤플라이 탐사 계획","mission/dragonfly/")],
  uranus:[nasa("천왕성의 사실","uranus/facts/"),nasa("천왕성의 위성 · 2026년 8월","uranus/moons/facts/")],
  neptune:[nasa("해왕성의 사실","neptune/neptune-facts/"),nasa("해왕성의 위성","neptune/moons/")],
  "big-bang":[nasa("우주의 역사","universe/overview/"),nasa("우주배경복사와 초기 우주","mission/webb/early-universe/")],
  "star-life":[nasa("별의 종류와 진화","universe/stars/")],
  "milky-way":[nasa("은하의 구조","universe/galaxies/"),nasa("은하의 분류","universe/galaxies/types/")],
  andromeda:[nasa("안드로메다 관측","mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/"),nasa("2025년 충돌 가능성 재검토","missions/hubble/apocalypse-when-hubble-casts-doubt-on-certainty-of-galactic-collision/")],
  "large-magellanic-cloud":[nasa("가까운 이웃 대마젤란운","earth/earth-observatory/the-galaxy-next-door/"),nasa("타란툴라 성운","missions/webb/a-cosmic-tarantula-caught-by-nasas-webb/")],
  m87:[nasa("M87 블랙홀 영상","universe/black-holes/black-hole-image-makes-history-nasa-telescopes-coordinated-observations/"),nasa("은하의 분류","universe/galaxies/types/")],
};

for (const id of ["sun", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"]) {
  topicSources[id].push({title:"NASA/JPL · 행성의 크기와 주기",url:"https://ssd.jpl.nasa.gov/planets/phys_par.html"});
}
