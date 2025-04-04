document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const imagesContainer = document.getElementById('images-container');
    const originalImage = document.getElementById('original-image');
    const congratulationsElement = document.getElementById('congratulations');
    const clickCounterElement = document.getElementById('counter');
    const progressBarElement = document.getElementById('progress-bar');
    const explosionButton = document.getElementById('explosion-button');
    const explosionContainer = document.getElementById('explosion-container');
    const restartContainer = document.getElementById('restart-container');
    const restartButton = document.getElementById('restart-button');
    const explosionSound = document.getElementById('explosion-sound');
    const buttonSound = document.getElementById('button-sound');

    // Image sources
    const imageSources = {
        primary: 'narisi.webp',
        alternate: 'sayori.webp'
    };

    // Function to randomly select an image source (10% chance for alternate)
    function getRandomImageSource() {
        return Math.random() < 0.1 ? imageSources.alternate : imageSources.primary;
    }

    // Game variables
    let clickCount = 0;
    const targetClicks = Math.floor(Math.random() * 31) + 20; // Random number between 20 and 50
    console.log(`Target clicks to win: ${targetClicks}`);

    // Set up the original image
    // Randomly select the initial image (10% chance for alternate)
    originalImage.src = getRandomImageSource();

    // Set up the original image click handler
    originalImage.addEventListener('click', handleImageClick);

    // Update UI function
    function updateUI() {
        // Update counter
        clickCounterElement.textContent = clickCount;

        // Update progress bar
        const progressPercentage = (clickCount / targetClicks) * 100;
        progressBarElement.style.width = `${Math.min(progressPercentage, 100)}%`;

        // Change progress bar color as we get closer to the target
        if (progressPercentage < 30) {
            progressBarElement.style.backgroundColor = '#4CAF50'; // Green
        } else if (progressPercentage < 60) {
            progressBarElement.style.backgroundColor = '#FFC107'; // Yellow
        } else {
            progressBarElement.style.backgroundColor = '#FF5722'; // Orange-red
        }
    }

    // Function to handle image clicks
    function handleImageClick(event) {
        // Prevent handling if the game is already won
        if (clickCount >= targetClicks) return;

        // Create a new image element instead of cloning
        const newImage = document.createElement('img');
        newImage.classList.add('clickable-image', 'new-image');
        newImage.alt = 'Click me!';

        // Randomly select image source (10% chance for alternate image)
        newImage.src = getRandomImageSource();

        // Get image dimensions from the clicked image
        const imageWidth = event.target.width || 150;
        const imageHeight = event.target.height || 150;

        // Generate random position within the viewport
        const maxX = window.innerWidth - imageWidth;
        const maxY = window.innerHeight - imageHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        // Generate random size variation (between 70% and 130% of original size)
        const sizeVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3

        // Style the new image
        newImage.style.left = `${randomX}px`;
        newImage.style.top = `${randomY}px`;
        newImage.style.maxWidth = `${200 * sizeVariation}px`; // Apply size variation

        // Generate random rotation (between -20 and 20 degrees)
        const randomRotation = Math.floor(Math.random() * 41) - 20; // -20 to 20
        newImage.style.transform = `rotate(${randomRotation}deg)`;

        // Wait for the image to load before adding it to the container
        newImage.onload = function() {
            // Add click handler to the new image
            newImage.addEventListener('click', handleImageClick);

            // Add the new image to the container
            imagesContainer.appendChild(newImage);
        };

        // Increment click count
        clickCount++;

        // Update UI
        updateUI();

        // Check if the game is won
        if (clickCount >= targetClicks) {
            setTimeout(showCongratulations, 500);
        }
    }

    // Function to show congratulations
    function showCongratulations() {
        // Show the congratulations message
        congratulationsElement.classList.remove('hidden');

        console.log('Congratulations shown, explosion button ready');

        // Make sure the explosion button has the event listener
        if (explosionButton) {
            // Ensure the button is properly styled
            explosionButton.style.backgroundColor = '#FF5722';
            explosionButton.style.animation = 'pulse 1.5s infinite';

            // Make sure the event listener is attached
            explosionButton.addEventListener('click', createExplosion);
        }

        // Trigger multiple confetti bursts
        const confettiDuration = 3000; // 3 seconds of confetti
        const endTime = Date.now() + confettiDuration;

        // Initial big burst
        confetti({
            particleCount: 200,
            spread: 160,
            origin: { y: 0.6 }
        });

        // Continuous smaller bursts
        const interval = setInterval(() => {
            if (Date.now() > endTime) {
                return clearInterval(interval);
            }

            // Random position for each burst
            const xPosition = Math.random();

            confetti({
                particleCount: 50,
                spread: 70,
                origin: { x: xPosition, y: Math.random() - 0.2 }
            });
        }, 200);
    }

    // Initialize UI
    updateUI();

    // Set up the explosion button
    if (explosionButton) {
        explosionButton.addEventListener('click', createExplosion);
    }

    // Set up the restart button
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }

    // Function to create an enhanced explosion effect
    function createExplosion() {
        // Play explosion sound
        if (explosionSound) {
            explosionSound.currentTime = 0;
            explosionSound.play().catch(e => console.log('Audio play failed:', e));
        }

        // Hide congratulations message
        congratulationsElement.classList.add('hidden');

        // Show explosion container
        explosionContainer.classList.remove('hidden');

        // Create flash effect
        const flash = document.createElement('div');
        flash.classList.add('explosion-flash');
        explosionContainer.appendChild(flash);

        // Create shockwave effect
        const shockwave = document.createElement('div');
        shockwave.classList.add('shockwave');
        explosionContainer.appendChild(shockwave);

        // Add shake effect to the entire page
        document.body.classList.add('shake');

        // Create explosion particles
        const numParticles = 150;
        const colors = ['#FF5722', '#FF9800', '#FFEB3B', '#FFC107', '#F44336', '#E91E63'];

        // Clear any existing particles
        explosionContainer.innerHTML = '';
        explosionContainer.appendChild(flash);
        explosionContainer.appendChild(shockwave);

        // Create particles
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('explosion-particle');

            // Random position (centered around the middle of the screen)
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Random angle and distance from center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.min(window.innerWidth, window.innerHeight) * 0.8;

            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            // Random size
            const size = 20 + Math.random() * 100;

            // Random color
            const color = colors[Math.floor(Math.random() * colors.length)];

            // Set styles
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;

            // Add to container
            explosionContainer.appendChild(particle);
        }

        // Create fire particles that rise up
        for (let i = 0; i < 50; i++) {
            const fire = document.createElement('div');
            fire.classList.add('fire-particle');

            // Random position at the bottom of the screen
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight - Math.random() * 100;

            // Random size
            const size = 10 + Math.random() * 30;

            // Set styles
            fire.style.left = `${x}px`;
            fire.style.top = `${y}px`;
            fire.style.width = `${size}px`;
            fire.style.height = `${size}px`;

            // Add to container
            explosionContainer.appendChild(fire);
        }

        // Hide all images with a fade-out effect
        const allImages = document.querySelectorAll('.clickable-image');
        allImages.forEach(img => {
            img.style.transition = 'all 0.5s ease';
            img.style.opacity = '0';
            setTimeout(() => {
                img.style.display = 'none';
            }, 500);
        });

        // Remove shake effect after animation completes
        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 500);

        // Show restart button after a delay
        setTimeout(() => {
            explosionContainer.classList.add('hidden');
            restartContainer.classList.remove('hidden');
        }, 2500);
    }

    // Function to restart the game
    function restartGame() {
        // Play button sound
        if (buttonSound) {
            buttonSound.currentTime = 0;
            buttonSound.play().catch(e => console.log('Audio play failed:', e));
        }

        // Hide restart container
        restartContainer.classList.add('hidden');

        // Reset click count
        clickCount = 0;

        // Generate new target
        const newTarget = Math.floor(Math.random() * 31) + 20;
        console.log(`New target clicks to win: ${newTarget}`);

        // Remove all duplicated images
        const allDuplicates = document.querySelectorAll('.clickable-image:not(#original-image)');
        allDuplicates.forEach(img => img.remove());

        // Randomly select a new image for the original image (10% chance for alternate)
        originalImage.src = getRandomImageSource();

        // Show and reset the original image
        originalImage.style.display = 'block';
        originalImage.style.opacity = '1';

        // Update UI
        updateUI();
    }
});
