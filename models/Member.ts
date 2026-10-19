import mongoose, { Schema, Model } from 'mongoose'

export interface IMember {
  name: string
  role: string
  sourceUrl: string
  pageUrl: string
}

const MemberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true, trim: true, maxlength: 30 },
    role: { type: String, trim: true, maxlength: 50, default: '' },
    sourceUrl: { type: String, trim: true, maxlength: 300, default: '' },
    pageUrl: { type: String, trim: true, maxlength: 300, default: '' },
  },
  { timestamps: true },
)

const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema)

export default Member
