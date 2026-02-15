// --- Função showStep global para navegação entre etapas ---
let showStepGlobal; // Variável para guardar a referência

document.addEventListener('DOMContentLoaded', function () {
    const steps = ['step-login', 'step-codigo', 'step-entrega', 'step-endereco', 'step-lojas', 'step-confirmacao'];
    // Definição da função showStep
    function showStep(stepId) {
        steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        const target = document.getElementById(stepId);
        if (target) {
            target.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    // Exporta a função para uso global
    window.showStep = showStep;
    // ... resto do seu código ...
});
document.addEventListener('DOMContentLoaded', function () {
    console.log("Script de compra carregado!"); // Para confirmar que o JS rodou

    // 1. Definição das Telas
    const steps = ['step-login', 'step-codigo', 'step-entrega', 'step-endereco', 'step-lojas', 'step-confirmacao'];
    let timerInterval;

    // Elementos Globais
    const codigoInputs = document.querySelectorAll('.codigo-input');
    const timerSpan = document.getElementById('codigo-timer');

    // --- FUNÇÃO DE NAVEGAÇÃO SIMPLES (SEM MEMÓRIA) ---
    function showStep(stepId) {
        // Esconde todas as telas
        steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        // Mostra apenas a tela pedida
        const target = document.getElementById(stepId);
        if (target) {
            target.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // REMOVIDO: localStorage.setItem('checkout_step'...) 
        // Não salvamos mais o passo para não travar no F5.
    }

    // --- TIMER ---
    function startTimer() {
        let timer = 30;
        if (timerInterval) clearInterval(timerInterval);
        if (timerSpan) timerSpan.textContent = '00:30';

        timerInterval = setInterval(() => {
            timer--;
            if (timerSpan) timerSpan.textContent = `00:${timer.toString().padStart(2, '0')}`;
            if (timer <= 0) clearInterval(timerInterval);
        }, 1000);
    }

    // --- AUTO-AVANÇAR NOS INPUTS DO CÓDIGO ---
    codigoInputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && idx < codigoInputs.length - 1) codigoInputs[idx + 1].focus();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && idx > 0) codigoInputs[idx - 1].focus();
        });
    });

    // ============================================================
    //  A LÓGICA DO BOTÃO ENTRAR (SIMPLES E DIRETA)
    // ============================================================

    const btnEntrar = document.getElementById('btn-entrar-login');
    console.log(btnEntrar)

    if (btnEntrar) {
        btnEntrar.addEventListener('click', function (e) {
            e.preventDefault();
            console.log("Botão Entrar clicado!");

            // 1. Pega os campos
            const emailField = document.getElementById('login-email');
            const passField = document.getElementById('login-password');

            // 2. Validação: Campos estão vazios?
            if (!emailField.value.trim() || !passField.value.trim()) {
                alert("Por favor, preencha E-mail e Senha.");
                return; // Para tudo aqui se estiver vazio
            }

            // 3. Verifica se é cadastrado
            const isRegistered = localStorage.getItem('user_registered');
            console.log("Usuário registrado?", isRegistered);

            if (isRegistered === 'true') {
                // SUCESSO: Vai para a tela de Código
                console.log("Indo para validação...");
                showStep('step-codigo');
                startTimer();
            } else {
                // FALHA: Manda para o cadastro
                alert("Cadastro não encontrado. Redirecionando...");
                window.location.href = "register.html";
            }
        });
    } else {
        console.error("ERRO: Botão 'btn-entrar-login' não foi encontrado no HTML.");
    }

    // --- OUTROS BOTÕES (CÓDIGO, ENDEREÇO, ETC) ---

    // Botão Validar Código (0000)
    const btnConfirmarCode = document.getElementById('btn-confirmar-codigo');
    if (btnConfirmarCode) {
        btnConfirmarCode.addEventListener('click', function (e) {
            e.preventDefault();
            const code = Array.from(codigoInputs).map(i => i.value).join('');

            if (code === '0000') {
                showStep('step-entrega'); // Vai para a entrega
                if (timerInterval) clearInterval(timerInterval);
            } else {
                alert("Código inválido. Tente 0000.");
                codigoInputs.forEach(i => i.value = '');
                codigoInputs[0].focus();
            }
        });
    }

    // Busca de CEP
    const cepInput = document.getElementById('cep-input');
    if (cepInput) {
        cepInput.addEventListener('input', function () {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(r => r.json())
                    .then(data => {
                        if (!data.erro) {
                            document.getElementById('logradouro').value = data.logradouro || '';
                            document.getElementById('bairro').value = data.bairro || '';
                            document.getElementById('cidade').value = data.localidade || '';
                            document.getElementById('estado').value = data.uf || '';
                        }
                    });
            }
        });
    }

    // Botão Salvar Endereço
    const btnSalvarEntrega = document.getElementById('btn-salvar-entrega');
    if (btnSalvarEntrega) {
        btnSalvarEntrega.addEventListener('click', function (e) {
            e.preventDefault();
            showStep('step-endereco');
        });
    }

    // Botão Alterar Endereço
    const btnAlterarEndereco = document.getElementById('btn-alterar-endereco');
    if (btnAlterarEndereco) {
        btnAlterarEndereco.addEventListener('click', function (e) {
            e.preventDefault();
            showStep('step-entrega');
        });
    }

    // Navegação Final
    const btnIrLojas = document.getElementById('btn-ir-lojas');
    if (btnIrLojas) {
        btnIrLojas.addEventListener('click', function (e) {
            e.preventDefault();
            showStep('step-lojas');
        });
    }

    document.querySelectorAll('.btn-selecionar-loja').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            showStep('step-confirmacao');
        });
    });

    // ============================================================
    //  INICIALIZAÇÃO PADRÃO (SEM RESTAURAÇÃO DE PASSO)
    // ============================================================
    // Sempre começa no login ao dar F5 ou abrir a página
    showStep('step-login');
});

