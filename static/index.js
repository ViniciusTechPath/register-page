function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    strCPF = strCPF.replace(/\D/g, '');
    if (strCPF.length !== 11 || strCPF === "00000000000") return false;
    for (var i = 1; i <= 9; i++) {
        Soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;
    if (Resto === 10 || Resto === 11) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10))) return false;
    Soma = 0;
    for (i = 1; i <= 10; i++) {
        Soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;
    if (Resto === 10 || Resto === 11) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

// Função para validar CPF enquanto digita
function validarCPF() {
    var cpf = $("#cpf").val();
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    var resultado = TestaCPF(cpf);
    var resultadoDiv = $("#resultado");
    if (cpf.length === 11) { // Verifica se o campo está completo
        if (resultado) {
            console.log("CPF válido");
        } else {
            console.log("CPF inválido");
        }
    } else {
        resultadoDiv.html(""); // Limpa a mensagem se o campo não estiver completo
    }
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;

    const invalidos = [
        "00000000000000", "11111111111111", "22222222222222", "33333333333333",
        "44444444444444", "55555555555555", "66666666666666", "77777777777777",
        "88888888888888", "99999999999999"
    ];
    if (invalidos.includes(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
}

function validarCNPJEnquantoDigita() {
    let cnpj = $("#cnpj").val();
    let resultado = $("#resultado");

    if (cnpj.length === 18) {
        cnpj = cnpj.replace(/\D/g, '');
        if (validarCNPJ(cnpj)) {
            console.log("CPNJ válido");
        } else {
            console.log("CPNJ inválido");
        }
    } else {
        resultado.html("");
    }
}

$(document).ready(function () {
    $("#telefonePessoa").inputmask("(99) 99999-9999");
    $("#telefoneEmpresa").inputmask("(99) 99999-9999");
});

$(document).ready(function () {
    $("#cnpj").inputmask("99.999.999/9999-99");
    $("#cnpj").on('input', validarCNPJEnquantoDigita);
});

$(document).ready(function () {
    $("#cpf").inputmask("999.999.999-99");
    $("#cpf").on('input', validarCPF);
});

// https://www.youtube.com/watch?v=nJtwKUQkAGo - Preenchimento automático do endereço a partir do CEP usando HTML + JavaScript + BrasilAPI

function buscaCep(campo) {
    let cep = campo.value.replace(/\D/g, '');
    let mensagemErro = document.getElementById('cepError');
    mensagemErro.innerHTML = "";

    limparCamposEndereco(campo);

    if (cep !== "" && cep.length === 8) {
        let urlapi = "https://brasilapi.com.br/api/cep/v1/" + cep;

        let request = new XMLHttpRequest();
        request.open("GET", urlapi);
        request.send();

        request.onload = function () {
            if (request.status === 200) {
                let endereco = JSON.parse(request.response);

                if (campo.id === "cepEmpresa") {
                    document.getElementById("ruaEmpresa").value = endereco.street;
                    document.getElementById("bairroEmpresa").value = endereco.neighborhood;
                    document.getElementById("cidadeEmpresa").value = endereco.city;
                    document.getElementById("ufEmpresa").value = endereco.state;

                    bloquearCampo("ruaEmpresa");
                    bloquearCampo("bairroEmpresa");
                    bloquearCampo("cidadeEmpresa");
                    bloquearCampo("ufEmpresa");
                } else if (campo.id === "cepPessoa") {
                    document.getElementById("ruaPessoa").value = endereco.street;
                    document.getElementById("bairroPessoa").value = endereco.neighborhood;
                    document.getElementById("cidadePessoa").value = endereco.city;
                    document.getElementById("ufPessoa").value = endereco.state;

                    bloquearCampo("ruaPessoa");
                    bloquearCampo("bairroPessoa");
                    bloquearCampo("cidadePessoa");
                    bloquearCampo("ufPessoa");
                }

                mensagemErro.innerHTML = "";

            } else if (request.status === 404) {
                mensagemErro.innerHTML = "CEP não encontrado. Verifique e tente novamente."; // Mensagem de CEP não encontrado
                limparCamposEndereco(campo);
            } else {
                mensagemErro.innerHTML = "Erro ao buscar o CEP. Tente novamente mais tarde."; // Mensagem de erro genérico
                limparCamposEndereco(campo);
            }
        };
    } else if (cep.length !== 8) {
        mensagemErro.innerHTML = "O CEP deve ter 8 dígitos numéricos.";
        limparCamposEndereco(campo);
    }
}

function bloquearCampo(idCampo) {
    let campo = document.getElementById(idCampo);
    campo.readOnly = true;
    campo.style.backgroundColor = "#e9ecef";
}

function limparCamposEndereco(campo) {
    if (campo.id === "cepEmpresa") {
        document.getElementById("ruaEmpresa").value = "";
        document.getElementById("bairroEmpresa").value = "";
        document.getElementById("cidadeEmpresa").value = "";
        document.getElementById("ufEmpresa").value = "";

        desbloquearCampo("ruaEmpresa");
        desbloquearCampo("bairroEmpresa");
        desbloquearCampo("cidadeEmpresa");
        desbloquearCampo("ufEmpresa");
    } else if (campo.id === "cepPessoa") {
        document.getElementById("ruaPessoa").value = "";
        document.getElementById("bairroPessoa").value = "";
        document.getElementById("cidadePessoa").value = "";
        document.getElementById("ufPessoa").value = "";

        desbloquearCampo("ruaPessoa");
        desbloquearCampo("bairroPessoa");
        desbloquearCampo("cidadePessoa");
        desbloquearCampo("ufPessoa");
    }
}

function desbloquearCampo(idCampo) {
    let campo = document.getElementById(idCampo);
    campo.readOnly = false;
    campo.style.backgroundColor = "#ffffff";
}

window.onload = function () {
    let cepEmpresa = document.getElementById("cepEmpresa");
    let cepPessoa = document.getElementById("cepPessoa");

    $(cepEmpresa).inputmask("99999-999");
    $(cepPessoa).inputmask("99999-999");

    cepEmpresa.addEventListener("blur", function () { buscaCep(cepEmpresa); });
    cepPessoa.addEventListener("blur", function () { buscaCep(cepPessoa); });
};