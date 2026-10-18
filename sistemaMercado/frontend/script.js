const btn = document.getElementById("btnBuscar");
const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");

const filtroCategoria = document.getElementById("filtroCategoria");
const ordenarPor = document.getElementById("ordenarPor");

const formulario = document.getElementById("formProduto");
const campoNome = document.getElementById("nome");
const campoCategoria = document.getElementById("categoria");
const campoUrlImagem = document.getElementById("urlImagem");
const campoPreco = document.getElementById("preco");
const campoQuantidade = document.getElementById("quantidade");
const campoValidade = document.getElementById("validade");

const modalEdicao = document.getElementById("modalEdicao");
const modalTitulo = document.getElementById("modalTitulo");
const formEditar = document.getElementById("formEditar");
const camposEdicaoContainer = document.getElementById("camposEdicaoContainer");
const campoEditNome = document.getElementById("editNome");
const campoEditCategoria = document.getElementById("editCategoria");
const campoEditUrlImagem = document.getElementById("editUrlImagem");
const campoEditPreco = document.getElementById("editPreco");
const campoEditQuantidade = document.getElementById("editQuantidade");
const campoEditValidade = document.getElementById("editValidade");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnSalvarEdicao = document.getElementById("btnSalvarEdicao");

let idEdicao = null;
let acaoAtual = "editar";

btn.addEventListener("click", buscarProdutos);
formulario.addEventListener("submit", salvarProduto);
formEditar.addEventListener("submit", executarAcaoModal);

if (filtroCategoria) {
    filtroCategoria.addEventListener("change", buscarProdutos);
}
if (ordenarPor) {
    ordenarPor.addEventListener("change", buscarProdutos);
}

if (btnFecharModal) {
    btnFecharModal.addEventListener("click", fecharModal);
}

async function carregarFiltroCategorias() {
    try {
        const resposta = await fetch("http://localhost:3000/produtos");
        if (!resposta.ok) return;
        
        const produtos = await resposta.json();
        const categoriaSelecionadaAntes = filtroCategoria.value;
        
        const categoriasUnicas = [...new Set(produtos.map(p => p.categoria))].filter(Boolean);
        
        filtroCategoria.innerHTML = '<option value="">Todas as Categorias</option>';
        
        categoriasUnicas.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            if (cat === categoriaSelecionadaAntes) {
                option.selected = true;
            }
            filtroCategoria.appendChild(option);
        });
    } catch (error) {
        console.log("Erro ao carregar categorias: " + error);
    }
}

carregarFiltroCategorias();

async function buscarProdutos() {
    try {
        mensagem.textContent = "Buscando produtos...";
        
        let url = "http://localhost:3000/produtos?";
        const params = new URLSearchParams();

        if (filtroCategoria && filtroCategoria.value) {
            params.append("categoria", filtroCategoria.value);
        }
        if (ordenarPor && ordenarPor.value) {
            params.append("ordenar", ordenarPor.value);
        }

        const resposta = await fetch(url + params.toString());
        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }
        const produtos = await resposta.json();

        listaProdutos.innerHTML = "";
        if (produtos.length === 0) {
            mensagem.textContent = "Nenhum produto encontrado";
            return;
        }

        for (let i = 0; i < produtos.length; i++) {
            listaProdutos.innerHTML += `<tr>
            <td>${produtos[i].id}</td>
            <td>${produtos[i].nome}</td>
            <td>${produtos[i].categoria}</td>
            <td><img src="${produtos[i].urlImagem}" alt="${produtos[i].nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td>R$ ${Number(produtos[i].preco).toFixed(2).replace('.', ',')}</td>
            <td>${produtos[i].quantidade}</td>
            <td>${produtos[i].validade}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn-editar" onclick="editarProduto(${produtos[i].id})">Editar</button>
                    <button class="btn-excluir" onclick="prepararExclusao(${produtos[i].id}, '${produtos[i].nome}')">Excluir</button>
                </div>
            </td>
</tr>`;
        }
        mensagem.textContent = produtos.length + " Produtos encontrados.";
    } catch (error) {
        mensagem.textContent = "Não foi possível encontrar os produtos";
        console.log("Erro: " + error);
    }
}

async function salvarProduto(evento) {
    evento.preventDefault();
    if (idEdicao === null) {
        await cadastrarProduto();
    } else {
        await atualizarproduto();
    }
}

async function cadastrarProduto() {
    try {
        const produto = {
            nome: campoNome.value,
            categoria: campoCategoria.value,
            urlImagem: campoUrlImagem.value,
            preco: campoPreco.value,
            quantidade: campoQuantidade.value,
            validade: campoValidade.value
        };

        const resposta = await fetch("http://localhost:3000/produtos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        formulario.reset();
        await carregarFiltroCategorias();
        await buscarProdutos();
        mensagem.textContent = "Produto cadastrado com sucesso!";
    } catch (error) {
        mensagem.textContent = "Não foi possível cadastrar o produto";
        console.log("Erro: " + error);
    }
}

async function editarProduto(id) {
    try {
        const resposta = await fetch("http://localhost:3000/produtos/" + id);
        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }
        const produto = await resposta.json();

        acaoAtual = "editar";
        modalTitulo.textContent = "Editar Produto";
        camposEdicaoContainer.style.display = "block";
        btnSalvarEdicao.textContent = "Salvar";

        campoEditNome.value = produto.nome;
        campoEditCategoria.value = produto.categoria;
        campoEditUrlImagem.value = produto.urlImagem;
        campoEditPreco.value = produto.preco;
        campoEditQuantidade.value = produto.quantidade;

        if (produto.validade && produto.validade.includes('/')) {
            const partes = produto.validade.split('/');
            campoEditValidade.value = `${partes[2]}-${partes[1]}-${partes[0]}`;
        } else {
            campoEditValidade.value = produto.validade || '';
        }

        idEdicao = produto.id;
        modalEdicao.style.display = "flex";
        mensagem.textContent = "Editando produto de ID: " + produto.id;
    } catch (error) {
        mensagem.textContent = "Não foi possível editar o produto";
        console.log("Erro: " + error);
    }
}

function prepararExclusao(id, nomeProduto) {
    acaoAtual = "excluir";
    idEdicao = id;

    modalTitulo.textContent = "Confirmar Exclusão";
    camposEdicaoContainer.style.display = "none";

    let msgExclusao = document.getElementById("msgExclusaoModal");
    if (!msgExclusao) {
        msgExclusao = document.createElement("p");
        msgExclusao.id = "msgExclusaoModal";
        formEditar.insertBefore(msgExclusao, formEditar.firstChild);
    }
    msgExclusao.textContent = `Tem certeza que deseja excluir o produto "${nomeProduto}"?`;

    btnSalvarEdicao.textContent = "Sim, Excluir";
    modalEdicao.style.display = "flex";
}

async function executarAcaoModal(evento) {
    evento.preventDefault();
    if (acaoAtual === "editar") {
        await atualizarproduto();
    } else {
        await excluirProdutoConfirmado();
    }
}

async function atualizarproduto() {
    try {
        const produto = {
            nome: campoEditNome.value,
            categoria: campoEditCategoria.value,
            urlImagem: campoEditUrlImagem.value,
            preco: campoEditPreco.value,
            quantidade: campoEditQuantidade.value,
            validade: campoEditValidade.value
        };

        const resposta = await fetch("http://localhost:3000/produtos/" + idEdicao, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();
        fecharModal();
        await carregarFiltroCategorias();
        await buscarProdutos();
        mensagem.textContent = dados.message || "Produto atualizado com sucesso!";
    } catch (error) {
        mensagem.textContent = "Não foi possível atualizar o produto";
        console.log("Erro: " + error);
    }
}

async function excluirProdutoConfirmado() {
    try {
        const resposta = await fetch("http://localhost:3000/produtos/" + idEdicao, {
            method: "DELETE"
        });
        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }
        const dados = await resposta.json();
        fecharModal();
        await carregarFiltroCategorias();
        await buscarProdutos();
        mensagem.textContent = dados.message || "Produto excluído com sucesso!";
    } catch (error) {
        mensagem.textContent = "Não foi possível excluir o produto";
        console.log("Erro: " + error);
    }
}

function fecharModal() {
    modalEdicao.style.display = "none";
    formEditar.reset();
    camposEdicaoContainer.style.display = "block";
    const msgExclusao = document.getElementById("msgExclusaoModal");
    if (msgExclusao) msgExclusao.remove();
    btnSalvarEdicao.textContent = "Salvar";
    idEdicao = null;
    acaoAtual = "editar";
}