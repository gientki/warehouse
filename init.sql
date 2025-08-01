
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    auth_token VARCHAR(255) NOT NULL
);

INSERT INTO user (email, auth_token) VALUES ('admin@example.com', 'demo-token');

CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS stock_movement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantity INT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    product_id INT NOT NULL,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);
