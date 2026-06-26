import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

// Document MongoDB : journal des notifications envoyées aux receveurs.
@Schema({
  collection: 'notifications',
  timestamps: { createdAt: 'dateEnvoi', updatedAt: false },
})
export class Notification {
  @Prop({ required: true, default: 'EMAIL' })
  type: string;

  @Prop({ required: true })
  destinataire: string;

  @Prop({ required: true })
  sujet: string;

  @Prop({ required: true })
  contenu: string;

  @Prop()
  transfertId: number;

  @Prop({ required: true, default: 'ENVOYE' })
  statutEnvoi: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
