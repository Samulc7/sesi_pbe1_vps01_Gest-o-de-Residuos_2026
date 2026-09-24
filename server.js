const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

const arquivo = "./dados.json";

function lerDados() {
    if (!fs.existsSync(arquivo)) {
        fs.writeFileSync(arquivo, "[]");
    }

    return JSON.parse(fs.readFileSync(arquivo, "utf8"));
}

function salvarDados(dados) {
    fs.writeFileSync(
        arquivo,
        JSON.stringify(dados, null, 2)
    );
}

app.get("/residuos", (req, res) => {
    const residuos = lerDados();
    res.json(residuos);
});

app.get("/residuos/:id", (req, res) => {
    const residuos = lerDados();

    const id = Number(req.params.id);

    const residuo = residuos.find(r => r.id === id);

    if (!residuo) {
        return res.status(404).json({
            mensagem: "Resíduo não encontrado"
        });
    }

    res.json(residuo);
});

app.post("/residuos", (req, res) => {

    console.log("BODY RECEBIDO:");
    console.log(req.body);

    const residuos = lerDados();

    const novoId = residuos.length > 0
        ? Math.max(...residuos.map(r => Number(r.id))) + 1
        : 1;

    const novoResiduo = {
        id: novoId,
        local: req.body.local,
        tipo_residuo: req.body.tipo_residuo,
        nivel_risco: req.body.nivel_risco,
        data_registro: req.body.data_registro,
        status: req.body.status
    };

    residuos.push(novoResiduo);

    salvarDados(residuos);

    res.status(201).json({
        mensagem: "Resíduo cadastrado com sucesso",
        residuo: novoResiduo
    });
});

app.put("/residuos/:id", (req, res) => {

    const residuos = lerDados();

    const id = Number(req.params.id);

    const indice = residuos.findIndex(r => r.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Resíduo não encontrado"
        });
    }

    residuos[indice] = {
        id: id,
        local: req.body.local,
        tipo_residuo: req.body.tipo_residuo,
        nivel_risco: req.body.nivel_risco,
        data_registro: req.body.data_registro,
        status: req.body.status
    };

    salvarDados(residuos);

    res.json({
        mensagem: "Resíduo atualizado com sucesso",
        residuo: residuos[indice]
    });
});

app.patch("/residuos/:id", (req, res) => {

    const residuos = lerDados();

    const id = Number(req.params.id);

    const indice = residuos.findIndex(r => r.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Resíduo não encontrado"
        });
    }

    if (req.body.local !== undefined) {
        residuos[indice].local = req.body.local;
    }

    if (req.body.tipo_residuo !== undefined) {
        residuos[indice].tipo_residuo = req.body.tipo_residuo;
    }

    if (req.body.nivel_risco !== undefined) {
        residuos[indice].nivel_risco = req.body.nivel_risco;
    }

    if (req.body.data_registro !== undefined) {
        residuos[indice].data_registro = req.body.data_registro;
    }

    if (req.body.status !== undefined) {
        residuos[indice].status = req.body.status;
    }

    salvarDados(residuos);

    res.json({
        mensagem: "Resíduo alterado com sucesso",
        residuo: residuos[indice]
    });
});

app.delete("/residuos/:id", (req, res) => {

    const residuos = lerDados();

    const id = Number(req.params.id);

    const indice = residuos.findIndex(r => r.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Resíduo não encontrado"
        });
    }

    const removido = residuos.splice(indice, 1)[0];

    salvarDados(residuos);

    res.json({
        mensagem: "Resíduo excluído com sucesso",
        residuo: removido
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});