document.addEventListener('DOMContentLoaded', function() {
    // Definição das Sessões
    const steps = ['step-login', 'step-codigo', 'step-entrega', 'step-endereco', 'step-lojas', 'step-confirmacao'];
    let timerInterval;

    // Elementos Globais
    const codigoInputs = document.querySelectorAll('.codigo-input');
    const timerSpan = document.getElementById('codigo-timer');

    // Função para mostrar a etapa correta e esconder as outras
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

        // Salva o passo atual para manter o estado mesmo com F5, mas sem bloquear o F5
        localStorage.setItem('checkout_step', stepId);
    }

    // Inicia o timer de 30s, garantindo que o anterior seja limpo para evitar contagens duplicadas ou aceleradas.
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

     // Lógica de UX: Pular automaticamente para o próximo campo de código ou voltar ao apagar
    codigoInputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && idx < codigoInputs.length - 1) codigoInputs[idx + 1].focus();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && idx > 0) codigoInputs[idx - 1].focus();
        });
    });

    // Logica de Login Simulado
    const loginForm = document.getElementById('login-form-submit');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showStep('step-codigo');
        });
    }

    // Verifica se o código é '0000' e avança para a escolha do tipo de entrega
    const btnConfirmarCode = document.getElementById('btn-confirmar-codigo');
    if (btnConfirmarCode) {
        btnConfirmarCode.addEventListener('click', function(e) {

            e.preventDefault();

            const code = Array.from(codigoInputs).map(i => i.value).join('');

            if (code === '0000') {
                showStep('step-entrega');
                if (timerInterval) clearInterval(timerInterval);
            } else {
                alert("Código inválido. Tente novamente.");
            }
        });
    }

    // Busca de endereço via CEP
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

    // Salvar endereço e avançar para seleção de loja
    const btnSalvarEntrega = document.getElementById('btn-salvar-entrega');
    if (btnSalvarEntrega) {
        btnSalvarEntrega.addEventListener('click', function(e) {
            e.preventDefault();
            showStep('step-endereco');
        });
    }

    // Navegação final
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


    // Pega onde o usuário parou
    const savedStep = localStorage.getItem('checkout_step');
    // Verifica se ele está logado/registrado
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