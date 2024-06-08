function learnMore() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', (event) => {
    const productSlides = document.querySelectorAll('.product-slide');
    let currentIndex = 0;

    function showNextProduct() {
        productSlides[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % productSlides.length;
        productSlides[currentIndex].style.display = 'block';
    }

    setInterval(showNextProduct, 5000); // Promijenite broj za željeni interval između promjena (u milisekundama)
});

document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const box = 32;

    function resizeCanvas() {
        // Postavi dimenzije platna prema širini prozora, zaokruži na najbliži višekratnik box-a
        canvas.width = Math.floor((window.innerWidth - 40) / box) * box;
        canvas.height = Math.floor((canvas.width / 2) / box) * box;
    }

    resizeCanvas();

    const nescafeImage = new Image();
    nescafeImage.src = 'nessAi.png'; // Putanja do slike limenke Nescafea

    let snake = [];
    snake[0] = {
        x: Math.floor((canvas.width / box) / 2) * box,
        y: Math.floor((canvas.height / box) / 2) * box
    };

    let food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };

    let highscore = localStorage.getItem('highscore') || 0; // Učitavanje highscore-a iz lokalnog skladišta
    let score = 0;
    let d;
    let game; // Dodajmo promjenjivu za spremanje intervala igre

    document.addEventListener('keydown', direction);
    document.addEventListener('keydown', preventScroll);

    function direction(event) {
        if (event.keyCode == 37 && d != 'RIGHT') {
            d = 'LEFT';
        } else if (event.keyCode == 38 && d != 'DOWN') {
            d = 'UP';
        } else if (event.keyCode == 39 && d != 'LEFT') {
            d = 'RIGHT';
        } else if (event.keyCode == 40 && d != 'UP') {
            d = 'DOWN';
        }
    }

    function preventScroll(event) {
        if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
        }
    }

    function collision(newHead, array) {
        for (let i = 0; i < array.length; i++) {
            if (newHead.x == array[i].x && newHead.y == array[i].y) {
                return true;
            }
        }
        return false;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.drawImage(nescafeImage, snake[i].x, snake[i].y, box, box); // Koristimo sliku Nescafea za zmijicu
        }

        ctx.drawImage(nescafeImage, food.x, food.y, box, box);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d == 'LEFT') snakeX -= box;
        if (d == 'UP') snakeY -= box;
        if (d == 'RIGHT') snakeX += box;
        if (d == 'DOWN') snakeY += box;

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * (canvas.width / box)) * box,
                y: Math.floor(Math.random() * (canvas.height / box)) * box
            };
        } else {
            snake.pop();
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        // Check collision with walls, allowing the snake to go slightly out of bounds
        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(game);
            gameOver();
            return;
        }

        snake.unshift(newHead);

        ctx.fillStyle = 'white';
        ctx.font = '45px Changa one';
        ctx.fillText(score, 2 * box, 1.6 * box);
        ctx.fillText("Highscore: " + highscore, canvas.width - 250, 1.6 * box); // Prikaz highscore-a
    }

    game = setInterval(draw, 100); // Inicijalno postavljanje intervala

    // Dodajte event listener za promjenu veličine prozora
    window.addEventListener('resize', () => {
        resizeCanvas();
        initializeGame();
    });

    // Funkcija za prikazivanje poruke Game Over i gumba za ponovno pokretanje igre
    function gameOver() {
        ctx.fillStyle = 'white';
        ctx.font = '50px Changa one';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

        // Provjera i ažuriranje highscore-a
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore); // Pohrana highscore-a u lokalno skladište
            // Prikaz poruke o obaranju highscore-a
            ctx.fillStyle = 'gold';
            ctx.fillText('Oborili ste highscore!', canvas.width / 2, canvas.height / 2 + 50);
            ctx.fillText('Osvojili ste Nescafe!', canvas.width / 2, canvas.height / 2 + 100);
        } else {
            // Prikaži postignuti rezultat i highscore
            ctx.fillStyle = 'white';
            ctx.font = '25px Changa one';
            ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 50);
            ctx.fillText('Highscore: ' + highscore, canvas.width / 2, canvas.height / 2 + 100);
        }

        const restartButton = document.getElementById('restartButton');
        restartButton.style.display = 'block'; // Prikaži gumb za ponovno pokretanje igre

        restartButton.addEventListener('click', () => {
            restartButton.style.display = 'none'; // Sakrij gumb za ponovno pokretanje igre
            initializeGame(); // Ponovno pokreni igru
        });
    }

    // Inicijalizacija igre
    function initializeGame() {
        clearInterval(game); // Zaustavi trenutni interval igre

        snake = [];
        snake[0] = {
            x: Math.floor((canvas.width / box) / 2) * box,
            y: Math.floor((canvas.height / box) / 2) * box
        };

        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };

        score = 0;
        d = undefined;

        game = setInterval(draw, 100); // Ponovno postavljanje intervala igre
    }

    // Dodavanje funkcionalnosti za elegantno skrolanje i animacije
    const sections = document.querySelectorAll('.fade-in');

    const options = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('not-visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    const smoothScroll = (target) => {
        document.querySelector(target).scrollIntoView({
            behavior: 'smooth'
        });
    };

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            smoothScroll(target);
        });
    });

    document.querySelector('button[onclick="learnMore()"]').addEventListener('click', () => {
        smoothScroll('#about');
    });
});
