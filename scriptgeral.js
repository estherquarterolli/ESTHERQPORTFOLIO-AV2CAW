
document.addEventListener('DOMContentLoaded', () => {

    // Barra de Progresso de Scroll
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    if (scrollProgressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                const scrolled = (scrollTop / scrollHeight) * 100;
                scrollProgressBar.style.width = scrolled + '%';
            } else {
                scrollProgressBar.style.width = '0%';
            }
        });
    }

    //  Efeito de Digitação no Hero
    const heroTituloElement = document.getElementById('hero-titulo');
    if (heroTituloElement) {
        const textoOriginal = heroTituloElement.textContent;
        heroTituloElement.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < textoOriginal.length) {
                heroTituloElement.textContent += textoOriginal.charAt(i);
                i++;
                setTimeout(typeWriter, Math.random() * 100 + 50);
            } else {
                heroTituloElement.classList.add('typing-effect');
            }
        }
        setTimeout(typeWriter, 500);
    }

    //  Atualiza o ano no rodapé
    const anoAtualEl = document.getElementById('ano-atual');
    if (anoAtualEl) {
        anoAtualEl.textContent = new Date().getFullYear();
    }

    //  Links de Navegação Ativos (usando a versão mais robusta do script 1)
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length > 0) {
        const currentPageFile = window.location.pathname.split("/").pop() || "index.html";
        navLinks.forEach(link => {
            const linkFile = (link.getAttribute('href') || "").split("/").pop() || "index.html";
            link.classList.toggle('ativo', linkFile === currentPageFile);
        });
    }
    
    //  Alternador de Tema (Claro/Escuro)
    const botaoTema = document.getElementById('botao-tema');
    if (botaoTema) {
        const iconeTemaSVGContainer = document.getElementById('icone-tema');
        const corpo = document.body;
        const svgSol = '<path fill-rule="evenodd" d="M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM12 20a8 8 0 100-16 8 8 0 000 16zm0-14a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 6zm0 10.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM8.05 8.05a.75.75 0 011.06-1.06l1.062 1.06a.75.75 0 01-1.06 1.062L8.05 8.05zm6.951 6.951a.75.75 0 011.06-1.06l1.062 1.06a.75.75 0 11-1.06 1.062l-1.062-1.06zM6 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 016 12zm10.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM8.05 15.95a.75.75 0 011.06 1.06l-1.062 1.06a.75.75 0 11-1.06-1.062l1.062-1.06zM15.95 8.05a.75.75 0 011.06 1.06l-1.062 1.06a.75.75 0 01-1.06-1.062l1.062-1.06z" clip-rule="evenodd"></path>';
        const svgLua = '<path fill-rule="evenodd" d="M9.522.94a.75.75 0 01.738 1.2L3.05 17.416a.75.75 0 01-1.3-.75L8.792.965a.75.75 0 01.73-.024zM11.26.65a.75.75 0 00-1.061 1.06L3.95 16.737a.75.75 0 001.06 1.061L11.26.65z" clip-rule="evenodd" opacity=".5"></path><path d="M18.5 13.016a.75.75 0 00-1.113-.924 6.501 6.501 0 01-8.025-8.025.75.75 0 10-1.113-.924A8.001 8.001 0 1018.5 13.016z"></path>';
        
        const aplicarTema = (tema) => {
            if (tema === 'escuro') {
                corpo.classList.add('tema-escuro');
                if (iconeTemaSVGContainer) iconeTemaSVGContainer.innerHTML = svgSol;
                localStorage.setItem('temaPortifolioEsther', 'escuro');
            } else {
                corpo.classList.remove('tema-escuro');
                if (iconeTemaSVGContainer) iconeTemaSVGContainer.innerHTML = svgLua;
                localStorage.setItem('temaPortifolioEsther', 'claro');
            }
        };

        botaoTema.addEventListener('click', () => {
            aplicarTema(corpo.classList.contains('tema-escuro') ? 'claro' : 'escuro');
        });

        const temaSalvo = localStorage.getItem('temaPortifolioEsther');
        const temaPreferidoSistema = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
        aplicarTema(temaSalvo || temaPreferidoSistema);
    }

    // Controle de Música
    const musicaFundo = document.getElementById('musica-fundo');
    if (musicaFundo) {
        const botaoMusicaHeader = document.getElementById('botao-musica-header');
        const iconeMusicaSVGContainer = document.getElementById('icone-musica');
        const svgPlay = '<path d="M6 19V5l14 7-14 7Z"></path>';
        const svgPause = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>';

        const atualizarIconeMusica = () => {
            if (!iconeMusicaSVGContainer || !musicaFundo) return;
            iconeMusicaSVGContainer.innerHTML = musicaFundo.paused ? svgPlay : svgPause;
        };

        if (botaoMusicaHeader) {
            musicaFundo.volume = 0.2;
            
            const playPromise = musicaFundo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Autoplay da música bloqueado. Interação do usuário necessária.", error);
                    atualizarIconeMusica();
                });
            }

            botaoMusicaHeader.addEventListener('click', () => {
                if (musicaFundo.paused) {
                    musicaFundo.play().catch(e => console.error("Erro ao tocar música:", e));
                } else {
                    musicaFundo.pause();
                }
            });

            musicaFundo.onplay = atualizarIconeMusica;
            musicaFundo.onpause = atualizarIconeMusica;
            musicaFundo.onended = atualizarIconeMusica;
            musicaFundo.onerror = () => atualizarIconeMusica();
            setTimeout(atualizarIconeMusica, 100);
        }
    }

});