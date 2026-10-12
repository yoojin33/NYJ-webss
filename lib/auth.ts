import crypto from 'crypto'

// 관리자 비밀번호 검사 (타이밍 공격을 피하기 위해 해시 후 timingSafeEqual 사용)
export function isAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD
  const given = request.headers.get('x-admin-password') ?? ''
  if (!expected) return false
  const a = crypto.createHash('sha256').update(given).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}
