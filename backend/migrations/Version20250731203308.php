<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250731203308 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product CHANGE name name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE stock_movement ADD product_id INT NOT NULL, DROP product');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B54584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('CREATE INDEX IDX_BB1BC1B54584665A ON stock_movement (product_id)');
        $this->addSql('ALTER TABLE user CHANGE authtoken auth_token VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE stock_movement DROP FOREIGN KEY FK_BB1BC1B54584665A');
        $this->addSql('DROP INDEX IDX_BB1BC1B54584665A ON stock_movement');
        $this->addSql('ALTER TABLE stock_movement ADD product VARCHAR(255) NOT NULL, DROP product_id');
        $this->addSql('ALTER TABLE user CHANGE auth_token authtoken VARCHAR(255) NOT NULL');
    }
}
