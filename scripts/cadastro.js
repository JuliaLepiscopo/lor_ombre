document.addEventListener('DOMContentLoaded', function () {
    // 1. Definição dos IDs das sessões
    const steps = [
        'step-cadastro-form', // Div do formulário inicial
        'step-codigo',        // Div dos 4 campos de código
        'cadastro-success'    // Div da mensagem final de sucesso
    ];

    // 2. Função para alternar entre as telas
    function showStep(stepId) {
        steps.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.classList.add('hidden');
        });

        const target = document.getElementById(stepId);
        if (target) {
            target.classList.remove('hidden');
        }
    }

    // --- LÓGICA DE INICIALIZAÇÃO (CORRIGIDA) ---
    // Removemos a verificação do localStorage aqui.
    // Sempre que der F5, ele vai forçar a tela inicial (Login/Cadastro).
    showStep('step-cadastro-form');

    // --- PASSO 1: SUBMISSÃO DO CADASTRO ---
    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validação de campos obrigatórios
            const requiredFields = cadastroForm.querySelectorAll('input, select');
            let allFilled = true;
            requiredFields.forEach(field => {
                if (field.type !== 'checkbox' && !field.value.trim()) {
                    allFilled = false;
                    field.classList.add('border-red-500');
                } else if (field.type === 'checkbox' && !field.checked) {
                    allFilled = false;
                    field.classList.add('ring-2', 'ring-red-500');
                } else {
                    field.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
                }
            });
            if (!allFilled) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            // Validação simples de senha
            const password = document.getElementById('reg-password');
            const confirmPassword = document.getElementById('reg-password-confirm');
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                alert("As senhas não coincidem. Por favor, verifique.");
                password.classList.add('border-red-500');
                confirmPassword.classList.add('border-red-500');
                return;
            }

            // Avança para o código
            showStep('step-codigo');
            startTimer();
        });
    }

    // --- PASSO 2: VALIDAÇÃO DO CÓDIGO ---
    const btnConfirmarCodigo = document.getElementById('btn-confirmar-codigo');
    const codigoInputs = document.querySelectorAll('.codigo-input');

    if (btnConfirmarCodigo) {
        btnConfirmarCodigo.addEventListener('click', function (e) {
            e.preventDefault();

            const code = Array.from(codigoInputs).map(i => i.value).join('');

            if (code === '0000') {
                // Aqui salvamos que ele completou, caso queira usar em OUTRA página,
                // mas não usaremos para bloquear o F5 nesta página mais.
                localStorage.setItem('user_registered', 'true');
                showStep('cadastro-success');
            } else {
                alert("Código inválido. Tente novamente.");
                codigoInputs.forEach(i => i.value = '');
                codigoInputs[0].focus();
            }
        });
    }

    // --- AUTO-AVANÇAR NOS INPUTS DO CÓDIGO ---
    codigoInputs.forEach((input, idx) => {
        input.addEventListener('input', function () {
            if (this.value.length === 1 && idx < codigoInputs.length - 1) {
                codigoInputs[idx + 1].focus();
            }
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && this.value === '' && idx > 0) {
                codigoInputs[idx - 1].focus();
            }
        });
    });

    // --- LÓGICA DO TIMER ---
    let timerInterval; // Variável declarada fora para ser acessível

    function startTimer() {
        let timer = 30;
        const timerSpan = document.getElementById('codigo-timer');

        // Limpa intervalo anterior se existir
        if (timerInterval) clearInterval(timerInterval);

        if (timerSpan) timerSpan.textContent = '00:30';

        timerInterval = setInterval(() => {
            timer--;
            if (timerSpan) {
                timerSpan.textContent = `00:${timer.toString().padStart(2, '0')}`;
            }
            if (timer <= 0) clearInterval(timerInterval);
        }, 1000);
    }
});