CREATE TABLE utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE storage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    taille_fichier INT NOT NULL, -- taille en octets
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
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
CREATE TABLE lien_fichier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fichier_id INT NOT NULL,
    lien VARCHAR(255) NOT NULL,
    date_expiration DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL 1 DAY),
    FOREIGN KEY (fichier_id) REFERENCES storage(id)
);