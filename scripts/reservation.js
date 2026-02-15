document.addEventListener('DOMContentLoaded', function () {
    let discount = 0;
    let couponApplied = false;

    // Helper para formatar moeda
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', 'R$ ');
    }

    function getPrice(row) {
        // Pega o valor escondido que é um número inteiro
        const priceElement = row.querySelector('.item-price');
        return priceElement ? parseInt(priceElement.textContent, 10) : 0;
    }

    function updateSummary() {
        const rows = document.querySelectorAll('#cart-body tr');
        let subtotal = 0;
        let totalItems = 0;

        rows.forEach(row => {
            const price = getPrice(row);
            const qtyElement = row.querySelector('.item-qty');
            const qty = qtyElement ? parseInt(qtyElement.textContent, 10) : 0;
            
            subtotal += price * qty;
            totalItems += qty;
            
            // Atualiza o total visual de cada linha
            const itemTotalElement = row.querySelector('.item-total');
            if (itemTotalElement) {
                itemTotalElement.textContent = `R$ ${(price * qty).toLocaleString('pt-BR')}`;
            }
        });

        // Cálculo de descontos e totais
        let valorDesconto = couponApplied ? Math.round(subtotal * 0.10) : 0;
        let total = subtotal - valorDesconto;

        // Atualização dos elementos do DOM
        const subtotalEl = document.querySelector('.summary-subtotal');
        if(subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toLocaleString('pt-BR')}`;
        
        const totalEl = document.querySelector('.summary-total');
        if(totalEl) totalEl.textContent = `R$ ${total.toLocaleString('pt-BR')}`;
        
        const itemsEl = document.querySelector('.summary-items');
        if(itemsEl) itemsEl.textContent = `${totalItems} itens`;

        const discountEl = document.querySelector('.discount-value');
        if(discountEl) discountEl.textContent = `- R$ ${valorDesconto.toLocaleString('pt-BR')}`;

        const couponEl = document.querySelector('.coupon-value');
        if(couponEl) couponEl.textContent = couponApplied ? '10% OFF' : 'R$ 0,00';
    }

    function checkEmptyCart() {
        const cartBody = document.getElementById('cart-body');
        const cartContainer = document.getElementById('cart-container');
        const emptyCart = document.getElementById('empty-cart');
        
        // Verifica o número de linhas na tabela
        const itemsCount = cartBody.querySelectorAll('tr').length;

        if (itemsCount === 0) {
            // Carrinho vazio: Esconde tabela, mostra div de erro
            cartContainer.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                cartContainer.classList.add('hidden');
                emptyCart.classList.remove('hidden');
                emptyCart.classList.add('flex');
            }, 300); // Pequeno delay para animação suave
            
            // Zera visualmente o resumo
            document.querySelector('.summary-subtotal').textContent = 'R$ 0,00';
            document.querySelector('.summary-total').textContent = 'R$ 0,00';
            document.querySelector('.summary-items').textContent = '0 itens';
        } else {
            // Carrinho com itens: Mostra tabela
            cartContainer.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            emptyCart.classList.add('hidden');
            emptyCart.classList.remove('flex');
        }
    }

    // Event Listener para botões de Remover
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-remove')) {
            const row = e.target.closest('tr');
            if (row) {
                row.remove();
                updateSummary();
                checkEmptyCart();
            }
        }
    });

    // Event Listener para Quantidade (+ e -)
    document.querySelectorAll('.btn-qty').forEach(btn => {
        btn.addEventListener('click', function () {
            const isAdd = this.dataset.action === 'add';
            const qtySpan = this.closest('td').querySelector('.item-qty');
            let qty = parseInt(qtySpan.textContent, 10);
            
            if (isAdd) {
                qty++;
            } else if (qty > 1) {
                qty--;
            }
            
            qtySpan.textContent = qty;
            updateSummary();
        });
    });

    // Lógica do Cupom
    const couponBtn = document.querySelector('.btn-luxury.px-4');
    if (couponBtn) {
        couponBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const input = this.parentElement.querySelector('input');
            const msg = document.getElementById('coupon-message');
            
            if (input.value.trim().toUpperCase() === "L'OR&OMBRE2026") {
                couponApplied = true;
                msg.textContent = 'Cupom aplicado com sucesso! 10% de desconto.';
                msg.classList.remove('hidden', 'text-red-500');
                msg.classList.add('text-[#D4AF37]');
            } else {
                couponApplied = false;
                msg.textContent = 'Cupom inválido.';
                msg.classList.remove('hidden', 'text-[#D4AF37]');
                msg.classList.add('text-red-500');
            }
            updateSummary();
        });
    }

    // Botão Grande "+" do Carrinho Vazio
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function () {
            window.location.href = 'index.html#collection';
        });
    }

    // Inicialização
    updateSummary();
    checkEmptyCart();
});