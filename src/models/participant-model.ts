import { Schema, model, Document } from 'mongoose'

export interface IParticipant extends Document {
  name: string
  customFields: {
    totalIncome: number
    membersCount: number
    perCapitaIncome: number
  }
}

const participantSchema = new Schema<IParticipant>(
  {
    name: { type: String, required: true },
    customFields: {
      totalIncome: { type: Number, default: 0 },
      membersCount: { type: Number, default: 1 },
      perCapitaIncome: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
)

export const ParticipantModel = model<IParticipant>('Participant', participantSchema)
