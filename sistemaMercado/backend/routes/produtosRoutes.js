import express from "express";
import { listarProdutos, buscarProdutosPorID, cadastrarProduto, atualizarProduto, excluirProduto } from "../controllers/produtosController.js";

const router = express.Router();

router.get("/", listarProdutos);
router.get("/:id", buscarProdutosPorID);
router.post("/", cadastrarProduto);
router.put("/:id", atualizarProduto);
router.delete("/:id", excluirProduto);


export default router;