-- CreateTable
CREATE TABLE `utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(180) NOT NULL,
    `mot_de_passe` VARCHAR(255) NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `rgpd_accepte` BOOLEAN NOT NULL DEFAULT false,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beneficiaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_complet` VARCHAR(150) NOT NULL,
    `email` VARCHAR(180) NOT NULL,
    `iban` VARCHAR(34) NOT NULL,
    `utilisateur_id` INTEGER NOT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transfert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `montant_fcfa` DECIMAL(12, 2) NOT NULL,
    `montant_eur` DECIMAL(12, 2) NOT NULL,
    `frais_fcfa` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `taux_change` DECIMAL(10, 6) NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'PAYE', 'ENVOYE', 'RECU', 'ECHEC') NOT NULL DEFAULT 'EN_ATTENTE',
    `reference` VARCHAR(30) NOT NULL,
    `utilisateur_id` INTEGER NOT NULL,
    `beneficiaire_id` INTEGER NOT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `transfert_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `beneficiaire` ADD CONSTRAINT `beneficiaire_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfert` ADD CONSTRAINT `transfert_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfert` ADD CONSTRAINT `transfert_beneficiaire_id_fkey` FOREIGN KEY (`beneficiaire_id`) REFERENCES `beneficiaire`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
