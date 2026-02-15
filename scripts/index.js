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

  // Estado atual das configurações
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

  // Atualiza cores de texto
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
