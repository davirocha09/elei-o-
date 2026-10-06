const candidatos = {
    "22": {
        nome: "Yuri22",
        partido: "P22 - Partido 22",
        vice: "Tio San",
        fotoVice: "imagens/vice-tiosan.png",
        foto: "imagens/22.png"
    },
    "07": {
        nome: "Coringa",
        partido: "PDL - Partido da Loud",
        vice: "Gabepeixe",
        fotoVice: "imagens/vice-gabepeixe.png",
        foto: "imagens/07.png"
    },
    "69": {
        nome: "Jon Vlogs",
        partido: "PJV - Partido do Jon Vlogs",
        vice: "Queridão",
        fotoVice: "imagens/vice-queridão.png",
        foto: "imagens/69.png"
    },
    "67": {
        nome: "Renato Cariani",
        partido: "PRC - Partido do Renato Cariani",
        vice: "Julio Balestrin",
        fotoVice: "imagens/vice-julio.png",
        foto: "imagens/67.png"
    },
    "77": {
        nome: "Gordão da XJ",
        partido: "PQP - Partido do Queridão Popular",
        vice: "Gordão NS",
        fotoVice: "imagens/vice-gordaons.png",
        foto: "imagens/77.png"
    },
    "90": {
        nome: "Bistecone",
        partido: "PDB - Partido da Bisteca",
        vice: "Renato Cariani",
        fotoVice: "imagens/vice-eduardo.png",
        foto: "imagens/90.png"
    },
    "13": {
        nome: "Lula",
        partido: "PT - Partido dos Trabalhadores",
        vice: "Geraldo Alckmin",
        fotoVice: "imagens/vice-geraldo.png",
        foto: "imagens/lula.png"
    },
    "38": {
        nome: "Alanzoka",
        partido: "PDS - Partido dos Streamers",
        vice: "Brino",
        fotoVice: "imagens/vice-brino.png",
        foto: "imagens/38.png"
    },
    "19": {
        nome: "Dona",
        partido: "P19 - Partido 19",
        vice: "Astro",
        fotoVice: "imagens/vice-astro.png",
        foto: "imagens/19.png"
    },
};

let numeroDigitado = "";
let votoBranco = false;
let votoFinalizado = false;

const CHAVE_VOTOS = "urnaPresidenteVotos";

function votosIniciais() {
    const base = {};
    Object.keys(candidatos).forEach(numero => base[numero] = 0);
    base.branco = 0;
    base.nulo = 0;
    return base;
}

function obterVotos() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE_VOTOS));
        return salvo && typeof salvo === "object" ? { ...votosIniciais(), ...salvo } : votosIniciais();
    } catch {
        return votosIniciais();
    }
}

function salvarVotos(votos) {
    localStorage.setItem(CHAVE_VOTOS, JSON.stringify(votos));
}

function registrarVoto() {
    const votos = obterVotos();

    if (votoBranco) {
        votos.branco++;
    } else if (candidatos[numeroDigitado]) {
        votos[numeroDigitado]++;
    } else {
        votos.nulo++;
    }

    salvarVotos(votos);
    atualizarContador();
}

function atualizarContador() {
    const votos = obterVotos();
    const total = Object.values(votos).reduce((soma, valor) => soma + Number(valor || 0), 0);
    const totalEl = document.getElementById("total-votos");
    const resultadoEl = document.getElementById("resultado-votos");

    if (!totalEl || !resultadoEl) return;

    totalEl.textContent = total;

    const linhas = Object.entries(candidatos).map(([numero, candidato]) => `
        <div class="linha-voto"><span>${numero} - ${candidato.nome}</span><strong>${votos[numero] || 0}</strong></div>
    `);

    linhas.push(`<div class="linha-voto"><span>Brancos</span><strong>${votos.branco || 0}</strong></div>`);
    linhas.push(`<div class="linha-voto"><span>Nulos</span><strong>${votos.nulo || 0}</strong></div>`);

    resultadoEl.innerHTML = linhas.join("");
}

const topo = document.getElementById("topo");
const informacoes = document.getElementById("informacoes");
const foto = document.getElementById("foto-candidato");
const fotoVice = document.getElementById("foto-vice");
const nomeVice = document.getElementById("nome-vice");
const numero1 = document.getElementById("numero1");
const numero2 = document.getElementById("numero2");
const tela = document.getElementById("tela");

const botoesNumeros = document.querySelectorAll("[data-num]");
const btnBranco = document.getElementById("btn-branco");
const btnCorrigir = document.getElementById("btn-corrigir");
const btnConfirmar = document.getElementById("btn-confirmar");

function iniciarEtapa() {
    numeroDigitado = "";
    votoBranco = false;
    votoFinalizado = false;

    topo.style.visibility = "hidden";

    informacoes.innerHTML = "Nome:<br>Partido:<br>Vice:";

    foto.style.display = "none";
    foto.removeAttribute("src");
    fotoVice.style.display = "none";
    fotoVice.removeAttribute("src");
    nomeVice.textContent = "";

    numero1.textContent = "";
    numero2.textContent = "";

    numero1.classList.add("em-foco");
    numero2.classList.remove("em-foco");
}

function clicou(numero) {
    if (votoBranco || votoFinalizado) return;
    if (numeroDigitado.length >= 2) return;

    numeroDigitado += numero;

    if (numeroDigitado.length === 1) {
        numero1.textContent = numero;
        numero1.classList.remove("em-foco");
        numero2.classList.add("em-foco");
    } else {
        numero2.textContent = numero;
        numero2.classList.remove("em-foco");
        atualizarInterface();
    }
}

function atualizarInterface() {
    topo.style.visibility = "visible";

    const candidato = candidatos[numeroDigitado];

    if (candidato) {
        informacoes.innerHTML =
            `Nome: ${candidato.nome}<br>
             Partido: ${candidato.partido}<br>
             Vice: ${candidato.vice}`;

        foto.src = candidato.foto;
        foto.style.display = "block";
        nomeVice.textContent = candidato.vice;
        if (candidato.fotoVice) {
            fotoVice.src = candidato.fotoVice;
            fotoVice.style.display = "block";
        } else {
            fotoVice.style.display = "none";
            fotoVice.removeAttribute("src");
        }

        foto.onerror = () => {
            foto.style.display = "none";
        };
        fotoVice.onerror = () => {
            fotoVice.style.display = "none";
        };
    } else {
        informacoes.innerHTML =
            `<div class="voto-nulo">VOTO NULO</div>`;
        foto.style.display = "none";
        fotoVice.style.display = "none";
        fotoVice.removeAttribute("src");
        nomeVice.textContent = "";
    }
}

function branco() {
    if (numeroDigitado !== "" || votoFinalizado) return;

    votoBranco = true;
    topo.style.visibility = "visible";

    numero1.textContent = "";
    numero2.textContent = "";
    numero1.classList.remove("em-foco");
    numero2.classList.remove("em-foco");

    informacoes.innerHTML =
        `<div class="voto-branco">VOTO EM BRANCO</div>`;

    foto.style.display = "none";
    fotoVice.style.display = "none";
    nomeVice.textContent = "";
}

function corrigir() {
    iniciarEtapa();
atualizarContador();
}

function confirmar() {
    if (votoFinalizado) return;

    if (!votoBranco && numeroDigitado.length !== 2) {
        informacoes.innerHTML =
            `<div class="voto-nulo">DIGITE 2 NÚMEROS</div>`;
        return;
    }

    votoFinalizado = true;
    registrarVoto();

    tela.innerHTML = `<div class="tela--fim">FIM</div>`;

    setTimeout(() => {
        window.location.reload();
    }, 4000);
}

botoesNumeros.forEach((botao) => {
    botao.addEventListener("click", () => {
        clicou(botao.dataset.num);
    });
});

btnBranco.addEventListener("click", branco);
btnCorrigir.addEventListener("click", corrigir);
btnConfirmar.addEventListener("click", confirmar);

document.addEventListener("keydown", (event) => {
    if (/^[0-9]$/.test(event.key)) {
        clicou(event.key);
    }

    if (event.key === "Enter") {
        confirmar();
    }

    if (event.key === "Escape") {
        corrigir();
    }
});

iniciarEtapa();
atualizarContador();
