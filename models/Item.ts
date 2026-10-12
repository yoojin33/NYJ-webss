import mongoose, { Schema, Model } from 'mongoose'
import { TYPES, ItemType } from '@/lib/constants'

export interface IItem {
  type: ItemType
  title: string
  description: string
  sourceUrl: string
  pageUrl: string
  tags: string[]
}

const ItemSchema = new Schema<IItem>(
  {
    type: { type: String, enum: [...TYPES], required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    sourceUrl: { type: String, trim: true, maxlength: 300, default: '' },
    pageUrl: { type: String, trim: true, maxlength: 300, default: '' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
)

const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema)

export default Item
