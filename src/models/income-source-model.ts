import { Schema, model, Document, Types } from 'mongoose'
import { TIncomeSourceType } from '@shared-types/simulation-types'

export interface IIncomeSource extends Document {
  participantId: Types.ObjectId
  type: TIncomeSourceType
  value: number
}

const incomeSourceSchema = new Schema<IIncomeSource>(
  {
    participantId: { type: Schema.Types.ObjectId, ref: 'Participant', required: true },
    type: {
      type: String,
      required: true,
      enum: [
        'salary',
        'freelance',
        'pension',
        'rental',
        'benefits',
        'investments',
        'alimony',
        'royalties',
        'sideBusiness',
        'other',
      ],
    },
    value: {
      type: Number,
      required: true,
      default: 0,
      validate: { validator: Number.isInteger, message: 'value deve ser um inteiro.' },
    },
  },
  { timestamps: true },
)

incomeSourceSchema.index({ participantId: 1, type: 1 }, { unique: true })

export const IncomeSourceModel = model<IIncomeSource>('IncomeSource', incomeSourceSchema)
