// Valores padrão para a identidade da marca e estilo
const defaultConfig = {
  brand_name: "L'Or & Ombre",
  hero_title: "O luxo traduzido em notas",
  hero_subtitle:
    "Fragrâncias exclusivas criadas para aqueles que apreciam o extraordinário",
  cta_button: "EXPLORAR COLEÇÃO",
  background_color: "#0D0D0D",
  surface_color: "#1A1A1A",
  text_color: "#9CA3AF",
  primary_action_color: "#D4AF37",
  secondary_action_color: "#C5A028",
  font_family: "Cormorant Garamond",
  font_size: 16,
};

let config = { ...defaultConfig };

// Atualização da página com base na configuração recebida
async function onConfigChange(cfg) {
  config = { ...defaultConfig, ...cfg };

  // Atualização de textos buscando por IDs específicos
  const elements = ['nav-brand', 'hero-title', 'hero-subtitle', 'cta-button', 'about-title', 'about-description'];
  elements.forEach(id => {
    if (document.getElementById(id)) {
      document.getElementById(id).textContent = config[id.replace('-', '_')] || defaultConfig[id.replace('-', '_')];
    }
  });

  // Aplica degradê de fundo usando as cores configuradas
  const bgColor = config.background_color || defaultConfig.background_color;
  const surfaceColor = config.surface_color || defaultConfig.surface_color;
  document.body.style.background = `linear-gradient(180deg, ${bgColor} 0%, ${surfaceColor} 50%, ${bgColor} 100%)`;

  // Define cores globais de texto e botões
  const textColor = config.text_color || defaultConfig.text_color;
  const primaryColor = config.primary_action_color || defaultConfig.primary_action_color;
  const secondaryColor = config.secondary_action_color || defaultConfig.secondary_action_color;

  document.querySelectorAll('.text-gray-400, .text-gray-500').forEach(el => el.style.color = textColor);
  document.querySelectorAll('.btn-luxury').forEach(el => {
    el.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
  });

  // Fonte e tamanho
  document.body.style.fontFamily = `${config.font_family || defaultConfig.font_family}, Georgia, serif`;
  document.documentElement.style.fontSize = `${config.font_size || defaultConfig.font_size}px`;
}

// Função para atualizar a navbar caso o usuário esteja logado
function updateNavbarUser() {
    const userArea = document.getElementById('nav-user-area');
    const isRegistered = localStorage.getItem('user_registered') === 'true';
    const userPicture = localStorage.getItem('user_picture');
    const userName = localStorage.getItem('user_name');

    // Se houver usuário logado e a div existir na página
    if (isRegistered && userArea) {
        userArea.innerHTML = `
            <div class="flex items-center gap-4 group cursor-pointer relative">
                <span class="font-cinzel text-[#D4AF37] text-[10px] tracking-[0.2em] hidden md:block uppercase">
                    ${userName}
                </span>
                <div class="w-10 h-10 rounded-full border border-[#D4AF37]/30 overflow-hidden group-hover:border-[#D4AF37] transition-all duration-500 shadow-lg shadow-[#D4AF37]/10">
                    <img src="${userPicture}" alt="Perfil" class="w-full h-full object-cover">
                </div>
                
                <button onclick="logout()" class="absolute -bottom-8 right-0 text-[10px] text-gray-500 hover:text-[#D4AF37] font-cinzel tracking-widest hidden group-hover:block bg-black/80 px-2 py-1 backdrop-blur-sm">
                    SAIR
                </button>
            </div>
            <a href="./reservation.html" class="btn-luxury px-6 py-2 text-black font-cinzel text-xs tracking-widest">
                RESERVAR
            </a>
        `;
    }
}

// Função para deslogar
function logout() {
    localStorage.removeItem('user_registered');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_picture');
    localStorage.removeItem('user_email');
    window.location.reload(); // Recarrega para voltar aos botões originais
}

document.addEventListener('DOMContentLoaded', () => {

  // Carrossel infinito de perfumistas
  const scrollContainer = document.querySelector('.animate-scroll');
  if (scrollContainer) {
    console.log("Carrossel de Perfumistas ativado.");
  }

  // Link ativo (LINHA AMARELA FIXA)
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    // Pega o nome do arquivo do link
    const linkPage = link.getAttribute('href').split("/").pop();

    // Reseta a classe
    link.classList.remove('nav-link-active');

    // Se a página atual for igual ao destino do link, ativa a linha
    if (currentPage === linkPage) {
      link.classList.add('nav-link-active');
    }
  });

  // Formulário de Contato
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showSuccessMessage();
    });
  }

  // Garante que a função rode assim que o DOM estiver pronto
  updateNavbarUser();
});

// Função para mostrar mensagem de sucesso após envio do formulário
function showSuccessMessage() {
  const msg = document.getElementById('success-message');
  if (msg) {
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 3000);
  }
}

// Scroll Suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});