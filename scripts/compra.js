document.addEventListener('DOMContentLoaded', function() {
    // 1. Definição das Sessões
    const steps = ['step-login', 'step-codigo', 'step-entrega', 'step-endereco', 'step-lojas', 'step-confirmacao'];
    let timerInterval;

    // Elementos Globais
    const codigoInputs = document.querySelectorAll('.codigo-input');
    const timerSpan = document.getElementById('codigo-timer');

    // --- FUNÇÃO DE NAVEGAÇÃO (SALVA O ESTADO) ---
    function showStep(stepId) {
        // Esconde todos
        steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        // Mostra o alvo
        const target = document.getElementById(stepId);
        if (target) {
            target.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // SALVA NO NAVEGADOR ONDE O USUÁRIO ESTÁ
        localStorage.setItem('checkout_step', stepId);
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

    // --- AUTO-AVANÇAR NOS INPUTS DE CÓDIGO ---
    codigoInputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && idx < codigoInputs.length - 1) codigoInputs[idx + 1].focus();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && idx > 0) codigoInputs[idx - 1].focus();
        });
    });

    // --- EVENTOS DOS BOTÕES ---

    // 1. LOGIN
    const loginForm = document.getElementById('login-form-submit');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showStep('step-codigo');
        });
    }

    // 2. VALIDAR CÓDIGO
    const btnConfirmarCode = document.getElementById('btn-confirmar-codigo');
    if (btnConfirmarCode) {
        btnConfirmarCode.addEventListener('click', function(e) {
            // Nota: type="button" no HTML já evita reload, mas preventDefault garante
            e.preventDefault();

            const code = Array.from(codigoInputs).map(i => i.value).join('');

            if (code === '0000') {
                showStep('step-entrega');
                if (timerInterval) clearInterval(timerInterval);
            } else {
                alert("Código inválido. Tente 0000.");
            }
        });
    }

    // 3. BUSCA DE CEP (AUTOMÁTICO)
    const cepInput = document.getElementById('cep-input');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
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

    // 4. SALVAR ENDEREÇO
    const btnSalvarEntrega = document.getElementById('btn-salvar-entrega');
    if (btnSalvarEntrega) {
        btnSalvarEntrega.addEventListener('click', function(e) {
            e.preventDefault();
            // Aqui você pode validar se os campos estão preenchidos
            showStep('step-endereco');
        });
    }

    // 5. NAVEGAÇÃO FINAL
    const btnIrLojas = document.getElementById('btn-ir-lojas');
    if (btnIrLojas) {
        btnIrLojas.addEventListener('click', function(e) {
            e.preventDefault();
            showStep('step-lojas');
        });
    }

    document.querySelectorAll('.btn-selecionar-loja').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showStep('step-confirmacao');
        });
    });

    // --- INICIALIZAÇÃO INTELIGENTE (AQUI ESTAVA O ERRO) ---

    // 1. Pega onde o usuário parou
    const savedStep = localStorage.getItem('checkout_step');
    // 2. Verifica se ele está logado/registrado
    const isRegistered = localStorage.getItem('user_registered');

    // Lógica: Se tem um passo salvo E o usuário está registrado, vai pra lá.
    if (savedStep && steps.includes(savedStep) && isRegistered === 'true') {
        showStep(savedStep);

        // Se recarregar na tela de código, reinicia o timer
        if (savedStep === 'step-codigo') {
            startTimer();
        }
    } else {
        // Se não tem nada salvo, começa do login
        showStep('step-login');
    }
});