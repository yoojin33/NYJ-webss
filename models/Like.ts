import mongoose, { Schema, Model } from 'mongoose'

export interface ILike {
  targetKey: string
  visitorId: string
  ipHash: string
}

const LikeSchema = new Schema<ILike>(
  {
    targetKey: { type: String, required: true, maxlength: 40 },
    visitorId: { type: String, required: true, maxlength: 40 },
    ipHash: { type: String, default: '', maxlength: 64 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

LikeSchema.index({ targetKey: 1, visitorId: 1 }, { unique: true })
LikeSchema.index({ ipHash: 1, createdAt: -1 })

const Like: Model<ILike> =
  mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema)
export default Like
