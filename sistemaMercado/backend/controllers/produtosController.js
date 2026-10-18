import { pool } from "../database/conexao.js";

function formatarData(data) {
    if (!data) return null;
    const d = new Date(data);
    if (isNaN(d.getTime())) return null;
    
    const dia = String(d.getUTCDate()).padStart(2, '0');
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
    const ano = d.getUTCFullYear();
    
    return `${dia}/${mes}/${ano}`;
}

async function listarProdutos(req, res) {
    try {
        const { categoria, ordenar } = req.query;

        let query = "SELECT * FROM produtos WHERE 1=1";
        const params = [];

        if (categoria && categoria.trim() !== "") {
            query += " AND categoria = ?";
            params.push(categoria);
        }

        const ordenacoesValidas = {
            "id": "id ASC",
            "nome-asc": "nome ASC",
            "nome-desc": "nome DESC",
            "preco-asc": "preco ASC",
            "preco-desc": "preco DESC",
            "quantidade-asc": "quantidade ASC",
            "quantidade-desc": "quantidade DESC",
            "validade-asc": "validade ASC"
        };

        if (ordenar && ordenacoesValidas[ordenar]) {
            query += ` ORDER BY ${ordenacoesValidas[ordenar]}`;
        } else {
            query += " ORDER BY id ASC";
        }

        const [produtos] = await pool.query(query, params);

        const produtosFormatados = produtos.map(produto => {
            if (produto.validade) {
                produto.validade = formatarData(produto.validade);
            }
            return produto;
        });

        res.status(200).json(produtosFormatados);
    } catch (error) {
        console.log("Erro ao listar e filtrar produtos: " + error.message);
        res.status(500).json({ message: "Erro ao buscar produtos" });
    }
}

async function buscarProdutosPorID(req, res) {
    try {
        const id = req.params.id;
        const [produtos] = await pool.query("SELECT * FROM produtos WHERE id = ?", [id]);
        
        if (produtos.length === 0) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        const produto = produtos[0];
        produto.validade = formatarData(produto.validade);

        res.status(200).json(produto);
    } catch (error) {
        console.log("Erro ao buscar produto por ID: " + error.message);
        res.status(500).json({ message: "Erro ao buscar produto" });
    }
}

async function cadastrarProduto(req, res) {
    try {
        const { nome, categoria, urlImagem, preco, quantidade, validade } = req.body;
        
        if (!nome || !categoria || !urlImagem || preco === undefined || preco === null || preco === "" || quantidade === undefined || quantidade === null || quantidade === "" || !validade) {
            return res.status(400).json({ message: "Preencha todos os campos." });
        }

        const [resultado] = await pool.query(
            "INSERT INTO produtos (nome, categoria, urlImagem, preco, quantidade, validade) VALUES (?, ?, ?, ?, ?, ?)", 
            [nome, categoria, urlImagem, preco, quantidade, validade]
        );
        
        res.status(201).json({ message: "Produto cadastrado com sucesso", id: resultado.insertId });
    } catch (error) {
        console.log("Erro ao cadastrar produto: ", error.message);
        res.status(500).json({ message: "Erro ao cadastrar produto" });
    }
}

async function atualizarProduto(req, res) {
    try {
        const id = req.params.id;
        const { nome, categoria, urlImagem, preco, quantidade, validade } = req.body;
        
        if (!nome || !categoria || !urlImagem || preco === undefined || preco === null || preco === "" || quantidade === undefined || quantidade === null || quantidade === "" || !validade) {
            return res.status(400).json({ message: "Preencha todos os campos." });
        }

        const [resultado] = await pool.query(
            "UPDATE produtos SET nome = ?, categoria = ?, urlImagem = ?, preco = ?, quantidade = ?, validade = ? WHERE id = ?", 
            [nome, categoria, urlImagem, preco, quantidade, validade, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        
        res.status(200).json({ message: "Produto atualizado com sucesso." });
    } catch (error) {
        console.log("Erro ao atualizar produto: ", error.message);
        res.status(500).json({ message: "Erro ao atualizar produto" });
    }
}

async function excluirProduto(req, res) {
    try {
        const id = req.params.id;
        const [resultado] = await pool.query("DELETE FROM produtos WHERE id = ?", [id]);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        
        res.status(200).json({ message: "Produto excluído com sucesso." });
    } catch (error) {
        console.log("Erro ao excluir produto: ", error.message);
        res.status(500).json({ message: "Erro ao excluir produto" });
    }
}

export { listarProdutos, buscarProdutosPorID, cadastrarProduto, excluirProduto, atualizarProduto };