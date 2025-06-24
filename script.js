class ForcaGame {
    constructor() {
        this.palavras = [
            { palavra: "pizza", dica: "Comida italiana redonda" },
            { palavra: "sushi", dica: "Comida japonesa com peixe cru" },
            { palavra: "hamburguer", dica: "Sanduíche americano" },
            { palavra: "feijoada", dica: "Prato típico brasileiro" },
            { palavra: "tacaca", dica: "Comida típica do Norte do Brasil" },
            { palavra: "minecraft", dica: "Jogo de blocos famoso" },
            { palavra: "creeper", dica: "Mob verde que explode" },
            { palavra: "diamante", dica: "Mineral mais valioso do jogo" },
            { palavra: "redstone", dica: "Material para circuitos" },
            { palavra: "enderdragon", dica: "Boss final do jogo" }
        ];
        
        this.palavraAtual = "";
        this.dicaAtual = "";
        this.palavraMascara = "";
        this.tentativas = 0;
        this.maxTentativas = 6;
        this.letrasUsadas = [];
        this.jogoTerminado = false;
        
        this.initializeElements();
        this.createAlphabet();
        this.novoJogo();
        this.bindEvents();
    }
    
    initializeElements() {
        this.wordDisplay = document.getElementById('wordDisplay');
        this.attemptsLeft = document.getElementById('attemptsLeft');
        this.usedLetters = document.getElementById('usedLetters');
        this.alphabet = document.getElementById('alphabet');
        this.gameMessage = document.getElementById('gameMessage');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.hangmanParts = [
            document.getElementById('head'),
            document.getElementById('body'),
            document.getElementById('leftArm'),
            document.getElementById('rightArm'),
            document.getElementById('leftLeg'),
            document.getElementById('rightLeg')
        ];
    }
    
    createAlphabet() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.alphabet.innerHTML = '';
        
        for (let letter of letters) {
            const btn = document.createElement('button');
            btn.className = 'letter-btn';
            btn.textContent = letter;
            btn.onclick = () => this.tentarLetra(letter.toLowerCase());
            this.alphabet.appendChild(btn);
        }
    }
    
    novoJogo() {
        // Escolher palavra aleatória
        const palavraObj = this.palavras[Math.floor(Math.random() * this.palavras.length)];
        this.palavraAtual = palavraObj.palavra.toLowerCase();
        this.dicaAtual = palavraObj.dica;
        
        // Resetar variáveis do jogo
        this.palavraMascara = '_'.repeat(this.palavraAtual.length);
        this.tentativas = 0;
        this.letrasUsadas = [];
        this.jogoTerminado = false;
        
        // Atualizar interface
        this.atualizarDisplay();
        this.resetarAlphabet();
        this.resetarBoneco();
        this.esconderMensagem();
        
        console.log('Nova palavra:', this.palavraAtual); // Para debug
    }
    
    tentarLetra(letra) {
        if (this.jogoTerminado || this.letrasUsadas.includes(letra)) {
            return;
        }
        
        this.letrasUsadas.push(letra);
        
        let acertou = false;
        let novaMascara = '';
        
        for (let i = 0; i < this.palavraAtual.length; i++) {
            if (this.palavraAtual[i] === letra) {
                novaMascara += letra;
                acertou = true;
            } else {
                novaMascara += this.palavraMascara[i];
            }
        }
        
        this.palavraMascara = novaMascara;
        
        if (!acertou) {
            this.tentativas++;
            this.mostrarParteBoneco();
        }
        
        this.atualizarDisplay();
        this.atualizarBotaoLetra(letra, acertou);
        this.verificarFimJogo();
    }
    
    mostrarParteBoneco() {
        if (this.tentativas <= this.hangmanParts.length) {
            this.hangmanParts[this.tentativas - 1].classList.add('show');
        }
    }
    
    atualizarDisplay() {
        this.wordDisplay.textContent = this.palavraMascara.split('').join(' ');
        this.attemptsLeft.textContent = this.maxTentativas - this.tentativas;
        this.usedLetters.textContent = this.letrasUsadas.length > 0 ? 
            this.letrasUsadas.join(', ').toUpperCase() : '-';
    }
    
    atualizarBotaoLetra(letra, acertou) {
        const botoes = this.alphabet.querySelectorAll('.letter-btn');
        botoes.forEach(btn => {
            if (btn.textContent.toLowerCase() === letra) {
                btn.classList.add(acertou ? 'correct' : 'used');
                btn.disabled = true;
            }
        });
    }
    
    verificarFimJogo() {
        if (!this.palavraMascara.includes('_')) {
            // Vitória
            this.jogoTerminado = true;
            this.mostrarBonecoFeliz();
            this.mostrarMensagem('🎉 PARABÉNS! VOCÊ VENCEU! 🎉', 'win');
        } else if (this.tentativas >= this.maxTentativas) {
            // Derrota
            this.jogoTerminado = true;
            this.mostrarBonecoEnforcado();
            this.mostrarMensagem(`💀 VOCÊ PERDEU! A palavra era: ${this.palavraAtual.toUpperCase()} 💀`, 'lose');
        }
    }
    
    mostrarBonecoFeliz() {
        // Mostrar todas as partes do boneco
        this.hangmanParts.forEach(part => {
            part.classList.add('show');
        });
        
        // Adicionar classe feliz
        const hangmanFigure = document.getElementById('hangman');
        const head = document.getElementById('head');
        
        hangmanFigure.classList.add('happy');
        head.classList.add('happy');
        
        // Remover a corda quando ganhar
        const rope = document.querySelector('.gallows-rope');
        if (rope) {
            rope.style.opacity = '0';
        }
    }
    
    mostrarBonecoEnforcado() {
        // Mostrar todas as partes do boneco
        this.hangmanParts.forEach(part => {
            part.classList.add('show');
        });
        
        // Adicionar classe morto
        const hangmanFigure = document.getElementById('hangman');
        const head = document.getElementById('head');
        
        hangmanFigure.classList.add('dead');
        head.classList.add('dead');
        
        // Manter a corda visível
        const rope = document.querySelector('.gallows-rope');
        if (rope) {
            rope.style.opacity = '1';
        }
    }
    
    mostrarMensagem(texto, tipo) {
        this.gameMessage.textContent = texto;
        this.gameMessage.className = `game-message show ${tipo}`;
    }
    
    esconderMensagem() {
        this.gameMessage.className = 'game-message';
    }
    
    resetarAlphabet() {
        const botoes = this.alphabet.querySelectorAll('.letter-btn');
        botoes.forEach(btn => {
            btn.classList.remove('used', 'correct');
            btn.disabled = false;
        });
    }
    
    resetarBoneco() {
        this.hangmanParts.forEach(part => {
            part.classList.remove('show');
        });
        
        // Limpar estados visuais
        const hangmanFigure = document.getElementById('hangman');
        const head = document.getElementById('head');
        
        hangmanFigure.classList.remove('happy', 'dead');
        head.classList.remove('happy', 'dead');
        
        // Restaurar a corda
        const rope = document.querySelector('.gallows-rope');
        if (rope) {
            rope.style.opacity = '1';
        }
    }
    
    mostrarDica() {
        if (!this.jogoTerminado) {
            alert(`💡 DICA: ${this.dicaAtual}`);
        }
    }
    
    bindEvents() {
        this.newGameBtn.onclick = () => this.novoJogo();
        this.hintBtn.onclick = () => this.mostrarDica();
        
        // Adicionar suporte para teclado
        document.addEventListener('keydown', (e) => {
            const letra = e.key.toLowerCase();
            if (letra >= 'a' && letra <= 'z') {
                this.tentarLetra(letra);
            }
        });
    }
}

// Efeitos sonoros simulados (usando Web Audio API básica)
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API não suportada');
        }
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playCorrect() {
        this.playTone(523.25, 0.2); // C5
    }
    
    playWrong() {
        this.playTone(220, 0.3, 'sawtooth'); // A3
    }
    
    playWin() {
        setTimeout(() => this.playTone(523.25, 0.2), 0);   // C5
        setTimeout(() => this.playTone(659.25, 0.2), 200); // E5
        setTimeout(() => this.playTone(783.99, 0.4), 400); // G5
    }
    
    playLose() {
        setTimeout(() => this.playTone(220, 0.3, 'sawtooth'), 0);   // A3
        setTimeout(() => this.playTone(196, 0.3, 'sawtooth'), 300); // G3
        setTimeout(() => this.playTone(174.61, 0.5, 'sawtooth'), 600); // F3
    }
}

// Adicionar partículas de fundo (efeito visual)
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.3';
        
        document.body.appendChild(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Adicionar novas partículas ocasionalmente
        if (Math.random() < 0.02 && this.particles.length < 50) {
            this.particles.push(this.createParticle());
        }
        
        // Atualizar e desenhar partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.opacity -= 0.001;
            
            if (particle.opacity <= 0 || 
                particle.x < 0 || particle.x > this.canvas.width ||
                particle.y < 0 || particle.y > this.canvas.height) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const game = new ForcaGame();
    const sounds = new SoundEffects();
    const particles = new ParticleSystem();
    
    // Adicionar efeitos sonoros ao jogo
    const originalTentarLetra = game.tentarLetra.bind(game);
    game.tentarLetra = function(letra) {
        if (this.jogoTerminado || this.letrasUsadas.includes(letra)) {
            return;
        }
        
        const palavraAntes = this.palavraMascara;
        originalTentarLetra(letra);
        
        // Tocar som baseado no resultado
        if (this.palavraMascara !== palavraAntes) {
            sounds.playCorrect();
        } else {
            sounds.playWrong();
        }
        
        // Tocar som de vitória/derrota
        if (this.jogoTerminado) {
            setTimeout(() => {
                if (!this.palavraMascara.includes('_')) {
                    sounds.playWin();
                } else {
                    sounds.playLose();
                }
            }, 500);
        }
    };
    
    console.log('🎮 Jogo da Forca - Estilo Minecraft carregado!');
    console.log('💡 Dica: Use o teclado para digitar as letras!');
});

