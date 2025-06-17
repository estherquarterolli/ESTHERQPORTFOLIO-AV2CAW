/**
 * pagina-projetos.js
 * Contém a lógica específica para o carrossel de projetos.
 * Deve ser incluído apenas na página que contém o carrossel.
 */
document.addEventListener('DOMContentLoaded', () => {

    // Carrossel de Projetos (versão refatorada e mais legível)
    const carrosselTrilho = document.querySelector('.carrossel-trilho');
    if (carrosselTrilho) {
        const cartoes = document.querySelectorAll('.cartao-projeto');
        const botaoPrev = document.querySelector('.carrossel-botao.prev');
        const botaoNext = document.querySelector('.carrossel-botao.next');

        if (cartoes.length > 0) {
            let indiceAtual = 0;
            let arrastando = false;
            let inicioX;
            let scrollEsquerdaTrilho;
            let larguraCartaoComMargem = 0;

            const calcularLarguraCartao = () => {
                const primeiroCartao = cartoes[0];
                const estilos = getComputedStyle(primeiroCartao);
                larguraCartaoComMargem = primeiroCartao.offsetWidth + (parseInt(estilos.marginRight) || 0);
            };
            
            const moverParaSlide = (indice) => {
                if (larguraCartaoComMargem === 0) calcularLarguraCartao();
                if (larguraCartaoComMargem > 0) {
                    const deslocamento = -indice * larguraCartaoComMargem;
                    carrosselTrilho.style.transform = `translateX(${deslocamento}px)`;
                }
            };

            const atualizarBotoes = () => {
                if (botaoPrev && botaoNext && carrosselTrilho.parentElement && larguraCartaoComMargem > 0) {
                    const container = carrosselTrilho.parentElement;
                    const slidesVisiveis = Math.floor(container.offsetWidth / larguraCartaoComMargem);
                    const maxIndice = Math.max(0, cartoes.length - slidesVisiveis);
                    
                    botaoPrev.style.display = (indiceAtual === 0) ? "none" : "flex";
                    botaoNext.style.display = (indiceAtual >= maxIndice) ? "none" : "flex";
                }
            };
            
            const ajustarIndice = () => {
                if (carrosselTrilho.parentElement && larguraCartaoComMargem > 0) {
                    const container = carrosselTrilho.parentElement;
                    const slidesVisiveis = Math.floor(container.offsetWidth / larguraCartaoComMargem);
                    const maxIndice = Math.max(0, cartoes.length - slidesVisiveis);
                    if (indiceAtual > maxIndice) indiceAtual = maxIndice;
                    if (indiceAtual < 0) indiceAtual = 0;
                }
            };

            const inicializarCarrossel = () => {
                calcularLarguraCartao();
                ajustarIndice();
                moverParaSlide(indiceAtual);
                atualizarBotoes();
            };

            if (botaoNext) {
                botaoNext.addEventListener("click", () => {
                    const container = carrosselTrilho.parentElement;
                    const slidesVisiveis = Math.floor(container.offsetWidth / larguraCartaoComMargem);
                    if (indiceAtual < cartoes.length - slidesVisiveis) {
                        indiceAtual++;
                        moverParaSlide(indiceAtual);
                        atualizarBotoes();
                    }
                });
            }

            if (botaoPrev) {
                botaoPrev.addEventListener("click", () => {
                    if (indiceAtual > 0) {
                        indiceAtual--;
                        moverParaSlide(indiceAtual);
                        atualizarBotoes();
                    }
                });
            }

            // Lógica de arrastar (Drag and Drop)
            const inicioArrastar = evento => {
                arrastando = true;
                carrosselTrilho.classList.add("arrastando");
                inicioX = evento.pageX || evento.touches[0].pageX;
                const transformStyle = getComputedStyle(carrosselTrilho).transform;
                scrollEsquerdaTrilho = (transformStyle === "none") ? 0 : (new DOMMatrixReadOnly(transformStyle)).m41;
                carrosselTrilho.style.transition = "none";
            };

            const arrastar = evento => {
                if (!arrastando) return;
                evento.preventDefault();
                const xAtual = evento.pageX || evento.touches[0].pageX;
                const diferencaX = xAtual - inicioX;
                carrosselTrilho.style.transform = `translateX(${scrollEsquerdaTrilho + diferencaX}px)`;
            };

            const fimArrastar = evento => {
                if (!arrastando) return;
                arrastando = false;
                carrosselTrilho.classList.remove("arrastando");
                carrosselTrilho.style.transition = "transform 0.5s ease-out";
                
                const xFinal = evento.pageX || (evento.changedTouches && evento.changedTouches[0].pageX);
                if (xFinal === undefined) return;

                const diferencaX = xFinal - inicioX;
                if (Math.abs(diferencaX) > larguraCartaoComMargem / 4) {
                    indiceAtual += (diferencaX < 0 ? 1 : -1);
                }
                
                ajustarIndice();
                moverParaSlide(indiceAtual);
                atualizarBotoes();
            };

            carrosselTrilho.addEventListener("mousedown", inicioArrastar);
            document.addEventListener("mousemove", arrastar);
            document.addEventListener("mouseup", fimArrastar);
            document.addEventListener("mouseleave", evento => { if (arrastando) fimArrastar(evento); });

            carrosselTrilho.addEventListener("touchstart", inicioArrastar, { passive: true });
            document.addEventListener("touchmove", arrastar, { passive: false });
            document.addEventListener("touchend", fimArrastar);

            window.addEventListener("resize", inicializarCarrossel);
            inicializarCarrossel();
        }
    }
});