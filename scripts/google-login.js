// scripts/google-login.js

// --- CONFIGURAÇÃO ---
// COLE AQUI O SEU CLIENT ID QUE VOCÊ COPIOU NO PASSO 3
const CLIENT_ID = '41152404475-0vsca7h7oi96hk2vp12iarf35tn65tf5.apps.googleusercontent.com';

// Origens esperadas — adicione aqui localhost/dev URLs e o domínio em produção
const ALLOWED_ORIGINS = [
    'https://l-or-ombre.vercel.app',
    'http://localhost:8000',
    'http://localhost:5173',
    'http://127.0.0.1:5500'
];

// --- VARIÁVEIS GLOBAIS ---
let tokenClient;

// 1. INICIALIZAÇÃO
// Essa função roda assim que a página carrega para deixar o Google pronto
function initGoogle() {
    console.log('initGoogle() chamado. origin=', location.origin);

    if (!ALLOWED_ORIGINS.includes(location.origin)) {
        console.warn('Origem atual não está na lista `ALLOWED_ORIGINS`. Verifique as origens autorizadas no Google Cloud Console.');
        console.warn('Origens permitidas (config em arquivo):', ALLOWED_ORIGINS);
    }

    // Cria badge de status para debugging visual
    createGoogleStatusBadge();

    if (window.google) {
        try {
            // Configura o cliente de token (ideal para botões customizados)
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                callback: (tokenResponse) => {
                    // Essa parte roda DEPOIS que o usuário escolheu a conta no popup
                    console.log('tokenResponse recebido', tokenResponse);
                    if (tokenResponse && tokenResponse.access_token) {
                        fetchUserData(tokenResponse.access_token);
                    }
                },
            });
            // Exponha tokenClient para debug em console
            window.tokenClient = tokenClient;
            window.initGoogle = initGoogle;
            console.log('Google Login inicializado! tokenClient exposto em window.tokenClient');
            updateGoogleStatus('ready');
        } catch (err) {
            console.error('Erro ao inicializar google.accounts.oauth2.initTokenClient:', err);
            updateGoogleStatus('error');
        }
    } else {
        console.warn('window.google não está disponível ainda. O script do Google pode não ter carregado.');
        updateGoogleStatus('no-google-script');
    }
}

// Cria um badge simples no canto superior direito para indicar status do Google Login
function createGoogleStatusBadge() {
    if (document.getElementById('google-status-badge')) return;
    const badge = document.createElement('div');
    badge.id = 'google-status-badge';
    badge.style.position = 'fixed';
    badge.style.right = '12px';
    badge.style.top = '12px';
    badge.style.padding = '8px 10px';
    badge.style.background = 'rgba(0,0,0,0.6)';
    badge.style.color = '#F5E3B3';
    badge.style.border = '1px solid rgba(212,175,55,0.15)';
    badge.style.borderRadius = '6px';
    badge.style.fontSize = '12px';
    badge.style.zIndex = 9999;
    badge.style.fontFamily = 'sans-serif';
    badge.textContent = 'GoogleLogin: inic.';
    document.body.appendChild(badge);
}

function updateGoogleStatus(state) {
    const badge = document.getElementById('google-status-badge');
    if (!badge) return;
    if (state === 'ready') {
        badge.textContent = 'GoogleLogin: pronto';
        badge.style.background = 'rgba(29, 29, 29, 0.8)';
        badge.style.color = '#D4AF37';
    } else if (state === 'no-google-script') {
        badge.textContent = 'GoogleLogin: script ausente';
        badge.style.background = 'rgba(80,0,0,0.8)';
        badge.style.color = '#ffb4b4';
    } else if (state === 'error') {
        badge.textContent = 'GoogleLogin: erro';
        badge.style.background = 'rgba(80,0,0,0.8)';
        badge.style.color = '#ffb4b4';
    } else if (state === 'attempt') {
        badge.textContent = 'GoogleLogin: tentativa';
        badge.style.background = 'rgba(0,0,0,0.7)';
        badge.style.color = '#fff';
    }
}

// 2. BUSCAR DADOS DO USUÁRIO
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

            // --- SUCESSO! AQUI ACONTECE O LOGIN ---

            // 1. Salva os dados no navegador (simulando banco de dados)
            localStorage.setItem('user_registered', 'true');
            localStorage.setItem('user_name', data.name);
            localStorage.setItem('user_email', data.email);
            localStorage.setItem('user_picture', data.picture); // Salva a foto se quiser usar

            // 2. Feedback visual
            alert(`Bem-vindo(a), ${data.given_name}! Login realizado com sucesso.`);

            // 3. Redirecionamento (Lógica do seu site)
            // Se a função showStep existir (estiver no mesmo contexto), avança.
            if (typeof showStep === 'function') {
                showStep('step-codigo'); // Pula o login e vai para a próxima etapa
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

// 3. CONECTAR O BOTÃO
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

            // O MOMENTO DO CLIQUE
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