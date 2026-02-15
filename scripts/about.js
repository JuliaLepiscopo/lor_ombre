
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