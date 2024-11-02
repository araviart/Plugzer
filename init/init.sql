CREATE TABLE utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE dossier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    nom VARCHAR(255) NOT NULL,
    dossier_parent_id INT, -- ID du dossier parent (facultatif)
    path TEXT,
    lastOpenedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id),
    FOREIGN KEY (dossier_parent_id) REFERENCES dossier(id) ON DELETE SET NULL
);

CREATE TABLE storage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    nom VARCHAR(255) NOT NULL,
    taille_fichier INT NOT NULL, -- taille en octets
    dossier_parent_id INT, -- ID du dossier parent (facultatif)
    path TEXT,
    fileNameInStorage VARCHAR(255) NOT NULL,
    lastOpenedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id),
    FOREIGN KEY (dossier_parent_id) REFERENCES dossier(id) ON DELETE SET NULL
);

DELIMITER //

CREATE FUNCTION peut_ajouter_fichier(utilisateur_id INT, taille_fichier INT) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE espace_total INT;

    SELECT IFNULL(SUM(taille_fichier), 0) INTO espace_total
    FROM storage
    WHERE utilisateur_id = utilisateur_id;

    RETURN (espace_total + taille_fichier <= 2 * 1024 * 1024 * 1024);
END //

DELIMITER ;

CREATE TABLE `lien_fichier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fichier_id` int NOT NULL,
  `lien` varchar(255) NOT NULL,
  `visites` INT DEFAULT 0,
  `isOnline` BOOLEAN DEFAULT TRUE,
  `date_expiration` TIMESTAMP NOT NULL DEFAULT ((curdate() + interval 1 day)),
  PRIMARY KEY (`id`),
  KEY `fichier_id` (`fichier_id`),
  CONSTRAINT `lien_fichier_ibfk_1` FOREIGN KEY (`fichier_id`) REFERENCES `storage` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE max_storage (
    id INT PRIMARY KEY,
    max_storage BIGINT NOT NULL DEFAULT 2147483648 -- 2 Go en octets
);

-- Insérer la valeur par défaut de 2 Go
INSERT INTO max_storage (id, max_storage) VALUES (1, 2147483648);

DELIMITER //

CREATE FUNCTION get_total_storage_used(utilisateur_id INT) RETURNS BIGINT
DETERMINISTIC
BEGIN
    DECLARE total_storage_used BIGINT;

    -- Calcule la somme de la taille des fichiers pour l'utilisateur donné
    SELECT IFNULL(SUM(taille_fichier), 0) INTO total_storage_used
    FROM storage
    WHERE utilisateur_id = utilisateur_id;

    RETURN total_storage_used;
END //

DELIMITER ;
