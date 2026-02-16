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

async function onConfigChange(cfg) {
  config = { ...defaultConfig, ...cfg };

  // Atualiza os textos principais (Hero e Nav) com base na nova configuração
  document.getElementById("nav-brand").textContent =
    config.brand_name || defaultConfig.brand_name;
  document.getElementById("hero-title").textContent =
    config.hero_title || defaultConfig.hero_title;
  document.getElementById("hero-subtitle").textContent =
    config.hero_subtitle || defaultConfig.hero_subtitle;
  document.getElementById("cta-button").textContent =
    config.cta_button || defaultConfig.cta_button;

  // Atualiza a interface quando as configurações mudam
  const bgColor =
    config.background_color || defaultConfig.background_color;
  const surfaceColor =
    config.surface_color || defaultConfig.surface_color;
  const textColor = config.text_color || defaultConfig.text_color;
  const primaryColor =
    config.primary_action_color || defaultConfig.primary_action_color;
  const secondaryColor =
    config.secondary_action_color || defaultConfig.secondary_action_color;

  document.body.style.background = `linear-gradient(180deg, ${bgColor} 0%, ${surfaceColor} 50%, ${bgColor} 100%)`;

  // Sincroniza as cores dos elementos secundários com o tema escolhido
  document
    .querySelectorAll(".text-gray-400, .text-gray-500")
    .forEach((el) => {
      el.style.color = textColor;
    });

  // Atualiza cores de botões
  document.querySelectorAll(".btn-luxury").forEach((el) => {
    el.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
  });

  // Atualiza família da fonte
  const fontFamily = config.font_family || defaultConfig.font_family;
  document.body.style.fontFamily = `${fontFamily}, Georgia, serif`;

  // Atualiza tamanho da fonte
  const baseSize = config.font_size || defaultConfig.font_size;
  document.documentElement.style.fontSize = `${baseSize}px`;
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

// Mostra mensagem de sucesso temporária
function showSuccessMessage() {
  const msg = document.getElementById("success-message");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 3000);
}

// Controla o envio do formulário de contato para mostrar a mensagem de sucesso
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    showSuccessMessage();
  });
}

//Implementa rolagem suave para links de navegação
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Garante que a função rode assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', updateNavbarUser);