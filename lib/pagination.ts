// ?page= 값을 안전한 양의 정수로 변환 (이상한 값이면 1)
export function parsePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? Math.min(n, 100000) : 1
}

// 화면에 보여 줄 페이지 번호 목록. 많을 때는 처음/끝/현재 주변만 보여 주고 사이는 'gap'(…)
export function getPageList(
  current: number,
  total: number,
): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const wanted = new Set<number>([1, total, current - 1, current, current + 1])
  const sorted = Array.from(wanted)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)

  const result: (number | 'gap')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('gap')
    result.push(p)
  })
  return result
}
