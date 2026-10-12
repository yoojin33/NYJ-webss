import mongoose, { Mongoose } from 'mongoose'

const uri: string = process.env.MONGODB_URI ?? ''
if (!uri) {
  throw new Error('.env.local 에 MONGODB_URI 를 설정하세요.')
}

interface MongooseCache {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined
}

// 개발 모드에서 핫 리로드 때 연결이 중복 생성되지 않도록 전역에 캐시
const cached: MongooseCache =
  global._mongoose ?? (global._mongoose = { conn: null, promise: null })

export default async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false })
  }
  cached.conn = await cached.promise
  return cached.conn
}
