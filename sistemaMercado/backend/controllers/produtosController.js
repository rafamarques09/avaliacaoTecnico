import {pool} from "../database/conexao.js";

async function listarProdutos(req, res){
    try {
        const [produtos] = await pool.query("SELECT * FROM produtos");
        res.status(200).json(produtos);
    } catch (error) {
        console.log("Erro ao buscar produtos" + error.message);
        res.status(500).json({ message: "Erro ao buscar produtos" });
    }
}

async function buscarProdutosPorID(req, res){
    try {
        const id = req.params.id;
        const [produtos] = await pool.query("SELECT * FROM produtos WHERE id=?",[id]);
        if(produtos.length === 0){
            return res.status(404).json({message:"Produto não encontrado"});
        }
        res.status(200).json(produtos[0]);
    } catch (error) {
        console.log("Erro ao buscar produtos"+ error.message );
        res.status(500).json({ message: "Erro ao buscar produtos"});
    }
}

async function cadastrarProduto(req, res) {
    try {
        const { titulo, autor, ano } = req.body;
        if (!titulo || !autor || !ano) {
            return res.status(400).json({ message: "Preencha todos os campos." });
        }
        const [resultado] = await pool.query("INSERT INTO livros(titulo, autor, ano) VALUES (?,?,?)", [titulo, autor, ano]);
        res.status(201).json({ message: "Livro cadastrado com sucesso", id: resultado.insertId });
    } catch (error) {
        console.log("Erro ao cadastrar livro", error.message);
        res.status(500).json({ message: "Erro ao cadastrar livro" });
    }
}

async function atualizarProduto(req,res) {
    try {
        const id = req.params.id;
        const {titulo, autor, ano} = req.body;
         if (!titulo || !autor || !ano) {
            return res.status(400).json({ message: "Preencha todos os campos." });
        }
        const [resultado] = await pool.query("UPDATE livros SET titulo=?, autor=?, ano=? WHERE id=?",[titulo,autor,ano,id]);
        if(resultado.affectedRows ===0){
            return res.status(404).json({message:"Livro não encontrado"});
        }
        res.status(200).json({message:"Livro atualizado com sucesso."});
    } catch (error) {
        console.log("Erro ao atualizar livro", error.message);
        res.status(500).json({ message: "Erro ao atualizar livro" });
    }
}

async function excluirProduto(req, res) {
    try {
        const id = req.params.id;
        const [resultado] = await pool.query("DELETE FROM livros WHERE id=?",[id]);
        if(resultado.affectedRows === 0){
            return res.status(404).json({message:"Livro não encontrado"});
        }
        res.status(200).json({message:"Livro excluído com sucesso."});
    } catch (error) {
        console.log("Erro ao excluir livro", error.message);
        res.status(500).json({ message: "Erro ao excluir livro" });
    }
}

export {listarProdutos, buscarProdutosPorID, cadastrarProduto, excluirProduto, atualizarProduto};