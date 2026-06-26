import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('Notifications');

  constructor(
    @InjectModel(Notification.name)
    private readonly model: Model<Notification>,
  ) {}

  // Enregistre la notification dans MongoDB et "envoie" l'email (simulé via log).
  async notifierReception(params: {
    destinataire: string;
    nomReceveur: string;
    montantEur: string;
    reference: string;
    transfertId: number;
  }) {
    const sujet = 'NORU - Vous avez reçu un transfert';
    const contenu =
      `Bonjour ${params.nomReceveur}, un transfert de ${params.montantEur} € ` +
      `(référence ${params.reference}) vous a été envoyé via NORU.`;

    const notif = await this.model.create({
      type: 'EMAIL',
      destinataire: params.destinataire,
      sujet,
      contenu,
      transfertId: params.transfertId,
      statutEnvoi: 'ENVOYE',
    });

    this.logger.log(
      `📧 (simulé) Email envoyé à ${params.destinataire} — ${sujet}`,
    );
    return notif;
  }

  findAll() {
    return this.model.find().sort({ dateEnvoi: -1 }).limit(100).exec();
  }
}
