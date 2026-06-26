// Dans un fichier de test, le corps des réponses HTTP (res.body) est de type
// `any` : on désactive donc les règles de typage strict ci-dessous.
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

// Tests d'intégration : on lance la vraie application (avec ses vraies BDD)
// et on vérifie les parcours principaux de bout en bout.
describe('NORU API (e2e)', () => {
  let app: INestApplication;
  let token = '';
  let beneficiaireId = 0;
  let transfertId = 0;
  // Email unique à chaque exécution pour ne pas entrer en conflit.
  const email = `test_${Date.now()}@noru.test`;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Mêmes réglages que dans main.ts.
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    // Nettoyage : on supprime le compte de test et ses données (RGPD).
    if (token) {
      await request(app.getHttpServer())
        .delete('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
    }
    await app.close();
  });

  it('inscription valide -> 201 + token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        motDePasse: 'motdepasse123',
        nom: 'Test',
        rgpdAccepte: true,
      })
      .expect(201);
    expect(res.body.access_token).toBeDefined();
    token = res.body.access_token;
  });

  it('inscription invalide -> 400', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'pasunemail',
        motDePasse: '123',
        nom: 'X',
        rgpdAccepte: false,
      })
      .expect(400);
  });

  it('connexion -> 201 + token', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, motDePasse: 'motdepasse123' })
      .expect(201);
  });

  it('route protégée sans token -> 401', () => {
    return request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });

  it('créer un bénéficiaire -> 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/beneficiaires')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nomComplet: 'Awa Test',
        email: 'awa@test.fr',
        iban: 'FR1420041010050500013M02606',
      })
      .expect(201);
    beneficiaireId = res.body.id;
    expect(beneficiaireId).toBeGreaterThan(0);
  });

  it('créer un transfert -> 201 + conversion correcte', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/transferts')
      .set('Authorization', `Bearer ${token}`)
      .send({ beneficiaireId, montantFcfa: 100000 })
      .expect(201);
    transfertId = res.body.id;
    expect(res.body.statut).toBe('EN_ATTENTE');
    expect(Number(res.body.montantEur)).toBeCloseTo(152.45, 2);
    expect(Number(res.body.fraisFcfa)).toBe(2000);
  });

  it('payer le transfert -> EN_ATTENTE devient PAYE', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/transferts/${transfertId}/payer`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.statut).toBe('PAYE');
  });

  it('un utilisateur normal est refusé sur l’espace admin -> 403', () => {
    return request(app.getHttpServer())
      .get('/api/admin/transferts')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
