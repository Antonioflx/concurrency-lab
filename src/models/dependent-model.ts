import { Schema, model, Document, Types } from 'mongoose'

export interface IDependent extends Document {
  participantId: Types.ObjectId
  name: string
  income: number
}

const dependentSchema = new Schema<IDependent>(
  {
    participantId: { type: Schema.Types.ObjectId, ref: 'Participant', required: true },
    name: { type: String, required: true },
    income: {
      type: Number,
      required: true,
      default: 0,
      validate: { validator: Number.isInteger, message: 'income deve ser um inteiro.' },
    },
  },
  { timestamps: true },
)

dependentSchema.index({ participantId: 1 })

export const DependentModel = model<IDependent>('Dependent', dependentSchema)
