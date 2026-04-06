document.addEventListener('DOMContentLoaded', function () {
    console.log("Script de compra carregado!");

    // Definição das Telas e Variáveis Globais
    const steps = ['step-login', 'step-codigo', 'step-entrega', 'step-endereco', 'step-lojas', 'step-confirmacao'];
    let timerInterval;
    const codigoInputs = document.querySelectorAll('.codigo-input');
    const timerSpan = document.getElementById('codigo-timer');

    // Funcão navegação
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

    // Exporta para uso global (necessário para o Google Login)
    window.showStep = showStep;

    // Timer e reenvio de código
    function startTimer() {
        let timer = 30;
        if (timerInterval) clearInterval(timerInterval);
        if (timerSpan) timerSpan.textContent = '00:30';
        removeResendButton();

        timerInterval = setInterval(() => {
            timer--;
            if (timerSpan) timerSpan.textContent = `00:${timer.toString().padStart(2, '0')}`;
            if (timer <= 0) {
                clearInterval(timerInterval);
                onTimerEnd();
            }
        }, 1000);
    }
    window.startTimer = startTimer;

    // Função para mostrar botão de reenvio após timer acabar
    function onTimerEnd() {
        if (timerSpan) {
            timerSpan.textContent = '';
            const btn = document.createElement('button');
            btn.id = 'btn-reenviar-codigo';
            btn.className = 'text-[#D4AF37] underline text-sm';
            btn.textContent = 'Reenviar código';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                codigoInputs.forEach(i => i.value = '');
                if (codigoInputs.length) codigoInputs[0].focus();
                alert('Código reenviado.');
                startTimer();
            });
            timerSpan.appendChild(btn);
        }
    }

    // Função para remover botão de reenvio (quando código é confirmado)
    function removeResendButton() {
        const btn = document.getElementById('btn-reenviar-codigo');
        if (btn) btn.remove();
    }

    // Lógica do Passo: Código de Verificação (foco automático, backspace e Enter)
    codigoInputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && idx < codigoInputs.length - 1) codigoInputs[idx + 1].focus();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && idx > 0) codigoInputs[idx - 1].focus();
            
            // Atalho Enter para validar código
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('btn-confirmar-codigo')?.click();
            }
        });
    });
    // Validação do código
    const btnConfirmarCode = document.getElementById('btn-confirmar-codigo');
    if (btnConfirmarCode) {
        btnConfirmarCode.addEventListener('click', (e) => {
            e.preventDefault();
            const code = Array.from(codigoInputs).map(i => i.value).join('');
            if (code === '0000') {
                showStep('step-entrega');
                if (timerInterval) clearInterval(timerInterval);
            } else {
                alert("Código inválido. Tente novamente.");
                codigoInputs.forEach(i => i.value = '');
                codigoInputs[0].focus();
            }
        });
    }

    // Lógica do passo login: validação simples e navegação para código, com Enter habilitado
    const btnEntrar = document.getElementById('btn-entrar-login');
    const loginInputs = [document.getElementById('login-email'), document.getElementById('login-password')];
    
    loginInputs.forEach(input => {
        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnEntrar?.click();
            }
        });
    });

    if (btnEntrar) {
        btnEntrar.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value.trim();

            if (!email || !pass) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            if (localStorage.getItem('user_registered') === 'true') {
                showStep('step-codigo');
                startTimer();
            } else {
                alert("Cadastro não encontrado.");
                window.location.href = "register.html";
            }
        });
    }

    // Lógica do passo endereço: preenchimento automático via CEP, validação dos campos e navegação para resumo, com Enter habilitado
    const addressFields = ['cep-input', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado'];
    addressFields.forEach(id => {
        const field = document.getElementById(id);
        field?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('btn-salvar-entrega')?.click();
            }
        });
    });

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
                            document.getElementById('numero').focus();
                        }
                    });
            }
        });
    }

    // Validação dos campos de endereço e navegação para resumo
    const btnSalvarEntrega = document.getElementById('btn-salvar-entrega');
    if (btnSalvarEntrega) {
        btnSalvarEntrega.addEventListener('click', (e) => {
            e.preventDefault();
            const requiredIds = ['cep-input', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];
            let allFilled = true;

            requiredIds.forEach(id => {
                const field = document.getElementById(id);
                if (!field?.value.trim()) {
                    allFilled = false;
                    field.style.borderBottomColor = '#ef4444';
                } else {
                    field.style.borderBottomColor = '';
                }
            });

            if (allFilled) showStep('step-endereco');
            else alert('Preencha os campos obrigatórios.');
        });
    }

    // Navegação para alterar endereço e voltar para lojas
    document.getElementById('btn-alterar-endereco')?.addEventListener('click', (e) => {
        e.preventDefault();
        showStep('step-entrega');
    });

    document.getElementById('btn-ir-lojas')?.addEventListener('click', (e) => {
        e.preventDefault();
        showStep('step-lojas');
    });

    document.querySelectorAll('.btn-selecionar-loja').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showStep('step-confirmacao');
        });
    });

    // Início padrão
    showStep('step-login');
});