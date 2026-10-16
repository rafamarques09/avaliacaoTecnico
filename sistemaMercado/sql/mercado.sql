CREATE DATABASE mercado;
USE mercado;

CREATE TABLE produtos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    validade DATE NOT NULL
);

INSERT INTO produtos (nome, categoria, preco, quantidade, validade) VALUES 
('Arroz Integral 5kg', 'Grãos e Cereais', 24.90, 50, '2027-10-15'),
('Feijão Preto 1kg', 'Grãos e Cereais', 8.50, 100, '2027-06-20'),
('Azeite de Oliva Extra Virgem 500ml', 'Óleos e Temperos', 32.00, 30, '2028-12-01'),
('Café em Pó 500g', 'Bebidas', 18.75, 80, '2027-03-10'),
('Leite Integral 1L', 'Laticínios', 5.49, 120, '2026-11-05');

SELECT * FROM produtos;
