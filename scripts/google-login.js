const CLIENT_ID = '41152404475-0vsca7h7oi96hk2vp12iarf35tn65tf5.apps.googleusercontent.com';

// IMPORTANTE: Para segurança, o Google exige que você registre as origens (domínios) de onde seu site será acessado.
const ALLOWED_ORIGINS = [
    'https://l-or-ombre.vercel.app',
    'http://localhost:8000',
    'http://localhost:5173',
    'http://127.0.0.1:5500'
];
let tokenClient;

// Função de inicialização do Google Login. Configura o tokenClient e verifica origens autorizadas.
function initGoogle() {
    console.log('initGoogle() chamado. origin=', location.origin);

    if (!ALLOWED_ORIGINS.includes(location.origin)) {
        console.warn('Origem atual não está na lista `ALLOWED_ORIGINS`. Verifique as origens autorizadas no Google Cloud Console.');
        console.warn('Origens permitidas (config em arquivo):', ALLOWED_ORIGINS);
    }


    if (window.google) {
        try {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                // Define as permissões solicitadas: acesso ao perfil básico e e-mail do usuário.
                scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                callback: (tokenResponse) => {
                //Roda quando o Google retornar o token (após login)
                    console.log('tokenResponse recebido', tokenResponse);
                    if (tokenResponse && tokenResponse.access_token) {
                        fetchUserData(tokenResponse.access_token);
                    }
                },
            });
            // Token client criado com sucesso, expõe para debug
            window.tokenClient = tokenClient;
            window.initGoogle = initGoogle;
            console.log('Google Login inicializado! tokenClient exposto em window.tokenClient');
        } catch (err) {
            console.error('Erro ao inicializar google.accounts.oauth2.initTokenClient:', err);
        }
    } else {
        console.warn('window.google não está disponível ainda. O script do Google pode não ter carregado.');
    }
}

// Usa o token para pedir Nome e Foto ao Google
function fetchUserData(accessToken) {
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Dados recebidos do Google:", data);


            // Persistência local: armazena dados da sessão para evitar novos logins após refresh (stateless)
            localStorage.setItem('user_registered', 'true');
            localStorage.setItem('user_name', data.name);
            localStorage.setItem('user_email', data.email);
            localStorage.setItem('user_picture', data.picture);

            // Feedback visual
            alert(`Bem-vindo(a), ${data.given_name}! Login realizado com sucesso.`);

            // Redirecionamento (Lógica do seu site)
            // Se a função showStep existir (estiver no mesmo contexto), avança.
            if (typeof showStep === 'function') {
                showStep('step-codigo'); // Pula o login e vai para a próxima etapa
                // Inicia o timer de verificação se disponível
                if (typeof window.startTimer === 'function') {
                    try { window.startTimer(); } catch (e) { console.error('Erro ao iniciar timer via window.startTimer:', e); }
                }
            } else {
                // Se não, recarrega a página para atualizar o estado
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
            alert("Erro ao conectar com o Google.");
        });
}

// Garantia de que o Google Login será inicializado mesmo que o script demore a carregar
document.addEventListener('DOMContentLoaded', () => {
    // Tenta inicializar (caso o script do Google já tenha carregado)
    initGoogle();

    // Se o script do Google demorar, o window.onload garante
    window.onload = initGoogle;

    const btnGoogle = document.getElementById('btn-google');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('btn-google clicado. tokenClient=', tokenClient, 'window.google=', !!window.google);

            // Se o tokenClient já estiver pronto, chama requestAccessToken. Caso contrário, tenta inicializar e chama novamente após 1s.
            if (tokenClient) {
                try {
                    tokenClient.requestAccessToken();
                } catch (err) {
                    console.error('Erro ao chamar requestAccessToken():', err);
                    alert('Erro ao iniciar o login Google. Veja o console para detalhes.');
                }
            } else {
                console.warn('tokenClient não está pronto. Tentando inicializar novamente...');
                alert('O sistema do Google ainda está carregando. Irei tentar novamente em 1s.');
                initGoogle(); // Tenta forçar a inicialização
                setTimeout(() => {
                    console.log('Tentativa pós-initGoogle: tokenClient=', tokenClient);
                    if (tokenClient) {
                        try { tokenClient.requestAccessToken(); } catch (err) { console.error(err); alert('Erro ao iniciar login após reinicializar.'); }
                    } else {
                        alert('Ainda não foi possível inicializar o Google. Verifique as origens autorizadas no Google Cloud Console e abra a página via HTTP(s).');
                    }
                }, 1000);
            }
        });
    } else {
        console.error("Botão Google (id=btn-google) não encontrado!");
    }
});