CREATE DATABASE mercado;
USE mercado;

CREATE TABLE produtos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    urlImagem VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    validade DATE NOT NULL
);

INSERT INTO produtos (nome, categoria, urlImagem,preco, quantidade, validade) VALUES 
('Arroz Integral 5kg', 'Grãos e Cereais', 'https://zaffari.vtexassets.com/arquivos/ids/263151-300-300?v=638675529171730000&width=300&height=300&aspect=true',24.90, 50, '2027-10-15'),
('Feijão Preto 1kg', 'Grãos e Cereais','https://zaffari.vtexassets.com/arquivos/ids/317584-300-300?v=639173834134830000&width=300&height=300&aspect=true', 8.50, 100, '2027-06-20'),
('Azeite de Oliva Extra Virgem 500ml', 'Óleos e Temperos','https://zaffari.vtexassets.com/arquivos/ids/317807-300-300?v=639177489383600000&width=300&height=300&aspect=true', 32.00, 30, '2028-12-01'),
('Café em Pó 500g', 'Bebidas','https://zaffari.vtexassets.com/arquivos/ids/325119-300-300?v=639252713812000000&width=300&height=300&aspect=true', 18.75, 80, '2027-03-10'),
('Leite Integral 1L', 'Laticínios','https://zaffari.vtexassets.com/arquivos/ids/314958-300-300?v=639144724257730000&width=300&height=300&aspect=true', 5.49, 120, '2026-11-05');

SELECT * FROM produtos;