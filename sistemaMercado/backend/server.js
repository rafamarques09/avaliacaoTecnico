import express from "express";

import "dotenv/config";
import produtosRoutes from "./routes/produtosRoutes.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import {testarConexao} from "./database/conexao.js";

const app = express();
const PORT  = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(express.json());

app.use("/produtos", produtosRoutes);

app.get("/", function(req,res){
    res.status(200).json({message:"API do mercado funcionando"});
});

async function iniciarServidor() {
    try {
        await testarConexao();
        app.listen(PORT, function(){
            console.log(`Servidor rodando em http://localhost:${PORT}`)
        });
    } catch (error) {
        console.log("Não foi possível iniciar o servidor");
        console.log(error.message);
    }
}

iniciarServidor();