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