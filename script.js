// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Handle page loader
    const pageLoader = document.querySelector('.page-loader');
    
    // Hide loader after page loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('hidden');
        
        // Check if today is Thomas's birthday (April 3rd)
        checkBirthdayAndCelebrate();
        
        // Check if we need to resume confetti on page load
        resumeConfettiIfNeeded();
      }, 500);
    });
    
    // Backup to hide loader if load event doesn't trigger
    setTimeout(() => {
      pageLoader.classList.add('hidden');
    }, 2500);
    
    // Initialize animations
    initAnimations();
    
    // Flip card functionality with improved animations
    const flipCard = document.getElementById('flip-card');
    const flipButton = document.getElementById('flip-button');
    
    // Add click event to the card and button with smoother animation
    flipCard.addEventListener('click', function() {
      flipCard.classList.toggle('flipped');
      // Play card flip sound effect
      playSound('flip');
    });
    
    flipButton.addEventListener('click', function(e) {
      // Prevent the click from propagating to the card
      e.stopPropagation();
      flipCard.classList.toggle('flipped');
      // Play card flip sound effect
      playSound('flip');
    });
    
    // Birthday countdown functionality
    updateCountdown();
    
    // Update countdown every second for more dynamic display
    setInterval(updateCountdown, 1000);
    
    // Add parallax effect to nature images
    initParallax();

    // Initialize gallery image hover effects
    initGallery();
    
    // Add back to top button functionality
    initBackToTop();
    
    // Add preview button functionality
    const previewButton = document.getElementById('preview-button');
    if (previewButton) {
      previewButton.addEventListener('click', function() {
        // Show birthday celebration
        previewBirthdayCelebration();
        
        // Add active class for animation
        this.classList.add('active');
        
        // Disable button temporarily to prevent multiple clicks
        this.disabled = true;
        
        // Enable button after animation completes
        setTimeout(() => {
          this.disabled = false;
          this.classList.remove('active');
        }, 2000);
      });
    }
    
    // Function to check if today is Thomas's birthday and trigger confetti
    function checkBirthdayAndCelebrate() {
      // Get the current date in Germany's timezone (CET/CEST)
      const options = { timeZone: 'Europe/Berlin' };
      const germanyTime = new Date().toLocaleString('en-US', options);
      const today = new Date(germanyTime);
      
      const month = today.getMonth(); // 0-indexed, so April is 3
      const day = today.getDate();
      
      console.log(`Current date in Germany: ${today.toDateString()} (Month: ${month}, Day: ${day})`);
      
      // If today is April 3rd (month 3, day 3) in Germany
      if (month === 3 && day === 3) {
        // Update header with special birthday message
        const header = document.querySelector('.header h1');
        if (header) {
          header.innerHTML = 'Happy Birthday Thomas! <span class="today-badge">Today!</span>';
          
          // Add CSS for the today badge
          const style = document.createElement('style');
          style.textContent = `
            .today-badge {
              display: inline-block;
              background-color: var(--primary);
              color: white;
              font-size: 1rem;
              padding: 0.3rem 0.8rem;
              border-radius: 2rem;
              margin-left: 1rem;
              vertical-align: middle;
              animation: pulse 1.5s infinite;
            }
          `;
          document.head.appendChild(style);
        }
        
        // Hide the preview button since it's the actual birthday
        const previewButton = document.getElementById('preview-button');
        if (previewButton) {
          previewButton.style.display = 'none';
          
          // Add a note explaining why the button is gone
          const buttonParent = previewButton.parentNode;
          const noteElement = document.createElement('p');
          noteElement.className = 'birthday-note';
          noteElement.textContent = "It's Thomas's birthday today! The celebration is active.";
          noteElement.style.cssText = `
            color: var(--secondary);
            font-weight: 500;
            font-size: 0.9rem;
            margin-top: 10px;
            animation: pulse 1.5s infinite;
          `;
          buttonParent.appendChild(noteElement);
        }
        
        // Launch confetti!
        fireConfetti();
        
        // Set an interval to continue confetti periodically
        const confettiInterval = setInterval(() => {
          fireConfetti(false); // Less intense for the interval
        }, 10000); // Every 10 seconds
        
        // Store the interval start time in localStorage
        const birthdayDate = `${today.getFullYear()}-04-03`;
        const confettiStartTime = Date.now();
        localStorage.setItem('confetti-birthday-date', birthdayDate);
        localStorage.setItem('confetti-start-time', confettiStartTime);
        
        // Check if we should continue the confetti (within 24 hours of starting)
        const checkConfettiDuration = () => {
          const currentTime = Date.now();
          const storedStartTime = parseInt(localStorage.getItem('confetti-start-time') || '0');
          const storedBirthdayDate = localStorage.getItem('confetti-birthday-date');
          const currentBirthdayDate = `${today.getFullYear()}-04-03`;
          
          // If 24 hours have passed or it's no longer the birthday, clear the interval
          if (currentTime - storedStartTime > 24 * 60 * 60 * 1000 || storedBirthdayDate !== currentBirthdayDate) {
            clearInterval(confettiInterval);
            localStorage.removeItem('confetti-start-time');
            localStorage.removeItem('confetti-birthday-date');
            console.log('Confetti stopped after 24 hours or date change');
          }
        };
        
        // Check duration every 5 minutes
        const durationCheckInterval = setInterval(checkConfettiDuration, 5 * 60 * 1000);
        
        // Check if user has already seen the surprise today
        const surpriseKey = `surprise-shown-${birthdayDate}`;
        const hasSeenSurprise = localStorage.getItem(surpriseKey);
        
        if (!hasSeenSurprise) {
          // Activate birthday surprise after 5 seconds if user hasn't seen it yet today
          setTimeout(() => {
            activateBirthdaySurprise();
            // Mark that user has seen the surprise today
            localStorage.setItem(surpriseKey, 'true');
          }, 5000);
        }
      } else {
        // If it's not the birthday anymore, clear any stored confetti data
        localStorage.removeItem('confetti-start-time');
        localStorage.removeItem('confetti-birthday-date');
      }
    }
    
    // Function to fire confetti animation
    function fireConfetti(fullBlast = true) {
      const duration = fullBlast ? 5000 : 3000;
      const particleCount = fullBlast ? 150 : 80;
      
      // Fire confetti from the left edge
      confetti({
        particleCount: particleCount,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.5 },
        colors: ['#fcd116', '#009b3a', '#ffffff'],
        startVelocity: 30,
        gravity: 0.8,
        drift: 0,
        ticks: 400,
        shapes: ['square', 'circle'],
        scalar: 1.2
      });
      
      // Fire confetti from the right edge
      confetti({
        particleCount: particleCount,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.5 },
        colors: ['#fcd116', '#009b3a', '#ffffff'],
        startVelocity: 30,
        gravity: 0.8,
        drift: 0,
        ticks: 400,
        shapes: ['square', 'circle'],
        scalar: 1.2
      });
      
      // Fire some confetti from the bottom for good measure (if full blast)
      if (fullBlast) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 270,
            spread: 120,
            origin: { x: 0.5, y: 1 },
            colors: ['#fcd116', '#009b3a', '#ffffff'],
            startVelocity: 40,
            gravity: 0.7,
            ticks: 300
          });
        }, 500);
      }
    }
    
    // Function to activate the birthday surprise with music and animations
    function activateBirthdaySurprise() {
      // Create surprise overlay container
      const surpriseOverlay = document.createElement('div');
      surpriseOverlay.className = 'surprise-overlay';
      document.body.appendChild(surpriseOverlay);
      
      // Add balloons
      createBalloons(surpriseOverlay);
      
      // Add gift box
      const giftBox = createGiftBox(surpriseOverlay);
      
      // Add CSS for the surprise elements
      addSurpriseStyles();
      
      // Play birthday song
      playBirthdaySong();
      
      // Add close button to dismiss the surprise
      const closeButton = document.createElement('button');
      closeButton.className = 'surprise-close';
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        // Fade out the surprise overlay
        surpriseOverlay.classList.add('surprise-exit');
        
        // Stop the music
        const audio = document.getElementById('birthday-song');
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        
        // Remove the overlay after animation
        setTimeout(() => {
          document.body.removeChild(surpriseOverlay);
        }, 1000);
      });
      surpriseOverlay.appendChild(closeButton);
      
      // Add a notice about one-time appearance
      const appearanceNote = document.createElement('div');
      appearanceNote.className = 'appearance-note';
      appearanceNote.textContent = 'This surprise appears once per day on Thomas\'s birthday';
      appearanceNote.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
        max-width: 90%;
      `;
      surpriseOverlay.appendChild(appearanceNote);
      
      // Animate the surprise entrance
      requestAnimationFrame(() => {
        surpriseOverlay.classList.add('surprise-active');
      });
      
      // Make the gift clickable to reveal a special message
      giftBox.addEventListener('click', () => {
        openGift(giftBox, surpriseOverlay);
      });
    }
    
    // Function to create floating balloons
    function createBalloons(container) {
      const colors = [
        'var(--primary)', 
        'var(--secondary)', 
        'var(--primary-light)', 
        'var(--accent)', 
        '#ff69b4', 
        '#ff7f50', 
        '#1e90ff'
      ];
      
      // Create 15 balloons
      for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Randomize balloon properties
        const size = Math.floor(Math.random() * (120 - 60) + 60);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.floor(Math.random() * 100);
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        // Set balloon styles
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.2}px`;
        balloon.style.backgroundColor = color;
        balloon.style.left = `${left}%`;
        balloon.style.animationDelay = `${delay}s`;
        balloon.style.animationDuration = `${duration}s`;
        
        // Create balloon string
        const string = document.createElement('div');
        string.className = 'balloon-string';
        
        // Append to balloon
        balloon.appendChild(string);
        container.appendChild(balloon);
      }
    }
    
    // Function to create a gift box
    function createGiftBox(container) {
      const giftContainer = document.createElement('div');
      giftContainer.className = 'gift-container';
      
      const giftBox = document.createElement('div');
      giftBox.className = 'gift-box';
      
      const giftLid = document.createElement('div');
      giftLid.className = 'gift-lid';
      
      const giftRibbon = document.createElement('div');
      giftRibbon.className = 'gift-ribbon';
      
      const giftBow = document.createElement('div');
      giftBow.className = 'gift-bow';
      
      const tapText = document.createElement('div');
      tapText.className = 'tap-text';
      tapText.innerText = 'Tap to Open';
      
      giftBox.appendChild(giftLid);
      giftBox.appendChild(giftRibbon);
      giftBox.appendChild(giftBow);
      giftContainer.appendChild(giftBox);
      giftContainer.appendChild(tapText);
      container.appendChild(giftContainer);
      
      return giftContainer;
    }
    
    // Function to open the gift and reveal a special message
    function openGift(giftContainer, container) {
      // Add opening animation class
      giftContainer.classList.add('gift-opening');
      
      // Create special message with animation
      setTimeout(() => {
        const messageCard = document.createElement('div');
        messageCard.className = 'birthday-message-card';
        
        const message = document.createElement('div');
        message.className = 'birthday-special-message';
        message.innerHTML = `
          <h2>Dear Thomas,</h2>
          <p>On this special day, we celebrate you! May your birthday be filled with love, joy, and beautiful moments to capture with your camera.</p>
          <p>Wishing you a year ahead filled with amazing adventures and breathtaking nature to photograph.</p>
          <p class="birthday-signature">With love from everyone</p>
          <div class="birthday-cake">
            <div class="cake-top"></div>
            <div class="cake-middle"></div>
            <div class="cake-bottom"></div>
            <div class="candle">
              <div class="flame"></div>
            </div>
          </div>
        `;
        
        messageCard.appendChild(message);
        container.appendChild(messageCard);
        
        // Remove gift box after it's opened
        setTimeout(() => {
          giftContainer.style.display = 'none';
        }, 1000);
        
        // Add particle burst on message reveal
        requestAnimationFrame(() => {
          createParticleBurst(container);
        });
      }, 1200);
    }
    
    // Function to create a particle burst effect
    function createParticleBurst(container) {
      const colors = [
        'var(--primary)', 
        'var(--secondary)', 
        'var(--primary-light)', 
        'var(--accent)', 
        '#ff69b4', 
        '#ff7f50', 
        '#1e90ff'
      ];
      
      // Create 50 particles
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Randomize particle properties
        const size = Math.floor(Math.random() * (12 - 5) + 5);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2; // Random angle in radians
        const distance = 100 + Math.random() * 100; // Random distance from center
        const duration = 0.5 + Math.random() * 1; // Animation duration
        
        // Calculate position
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        // Set particle styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.position = 'absolute';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.animation = `particle-fade-out ${duration}s forwards`;
        
        // Add to container
        container.appendChild(particle);
        
        // Animate the particle outward
        requestAnimationFrame(() => {
          particle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
        
        // Remove particle after animation
        setTimeout(() => {
          container.removeChild(particle);
        }, duration * 1000);
      }
    }
    
    // Function to play birthday song
    function playBirthdaySong() {
      // Create audio element if it doesn't exist
      if (!document.getElementById('birthday-song')) {
        const audio = document.createElement('audio');
        audio.id = 'birthday-song';
        
        // Check if a custom song has been set in localStorage
        const customSongUrl = localStorage.getItem('custom-birthday-song');
        
        // Use custom song if available, otherwise use the local music file
        if (customSongUrl) {
          audio.src = customSongUrl;
        } else {
          // Use the local music file in the music folder
          audio.src = 'music/happy-birthday-314197.mp3';
        }
        
        audio.loop = true;
        audio.volume = 0.5;
        
        // Add audio controls for user interaction
        const audioControls = document.createElement('div');
        audioControls.className = 'audio-controls';
        
        const muteButton = document.createElement('button');
        muteButton.innerHTML = '🔊';
        muteButton.className = 'audio-button';
        muteButton.addEventListener('click', () => {
          if (audio.muted) {
            audio.muted = false;
            muteButton.innerHTML = '🔊';
          } else {
            audio.muted = true;
            muteButton.innerHTML = '🔇';
          }
        });
        
        audioControls.appendChild(muteButton);
        
        // Add a button to change the song
        const changeSongButton = document.createElement('button');
        changeSongButton.innerHTML = '🎵';
        changeSongButton.className = 'audio-button change-song';
        changeSongButton.title = 'Change Birthday Song';
        changeSongButton.addEventListener('click', () => {
          const newSongUrl = prompt('Enter the URL of your custom birthday song or use "default" to use the local music file:', customSongUrl || '');
          if (newSongUrl && newSongUrl.trim() !== '') {
            if (newSongUrl.toLowerCase() === 'default') {
              // Reset to default local music
              localStorage.removeItem('custom-birthday-song');
              audio.src = 'music/happy-birthday-314197.mp3';
            } else {
              // Save the custom song URL
              localStorage.setItem('custom-birthday-song', newSongUrl);
              audio.src = newSongUrl;
            }
            
            // Play the updated song
            audio.play().catch(error => {
              alert('Error playing song. Please check if the URL is correct and try again.');
              console.error('Error playing audio:', error);
            });
          }
        });
        
        audioControls.appendChild(changeSongButton);
        
        // Add reset button to go back to local song
        const resetButton = document.createElement('button');
        resetButton.innerHTML = '🏠';
        resetButton.className = 'audio-button reset-song';
        resetButton.title = 'Use Local Music';
        resetButton.addEventListener('click', () => {
          // Reset to default local music
          localStorage.removeItem('custom-birthday-song');
          audio.src = 'music/happy-birthday-314197.mp3';
          audio.play().catch(error => {
            console.error('Error playing audio:', error);
          });
        });
        
        audioControls.appendChild(resetButton);
        document.body.appendChild(audioControls);
        document.body.appendChild(audio);
        
        // Add styles for the song buttons
        const audioButtonStyles = document.createElement('style');
        audioButtonStyles.textContent = `
          .change-song {
            margin-left: 8px;
            background: linear-gradient(135deg, #ff9966, #ff5e62);
          }
          .change-song:hover {
            background: linear-gradient(135deg, #ff5e62, #ff9966);
          }
          .reset-song {
            margin-left: 8px;
            background: linear-gradient(135deg, #3498db, #2980b9);
          }
          .reset-song:hover {
            background: linear-gradient(135deg, #2980b9, #3498db);
          }
        `;
        document.head.appendChild(audioButtonStyles);
        
        // Play audio (this may require user interaction on some browsers)
        try {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              // Auto-play was prevented, show a message to the user
              console.log('Auto-play prevented. Please interact with the page to enable sound.');
              
              // Create a play button
              const playButton = document.createElement('button');
              playButton.className = 'audio-play-button';
              playButton.innerHTML = 'Play Birthday Song';
              playButton.addEventListener('click', () => {
                audio.play();
                playButton.style.display = 'none';
              });
              document.body.appendChild(playButton);
            });
          }
        } catch (e) {
          console.log('Error playing audio:', e);
        }
      }
    }
    
    // Function to add CSS styles for the surprise elements
    function addSurpriseStyles() {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .surprise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          z-index: 10000;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 1s ease;
          backdrop-filter: blur(5px);
        }
        
        .surprise-active {
          opacity: 1;
        }
        
        .surprise-exit {
          opacity: 0;
        }
        
        .surprise-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
          z-index: 10001;
        }
        
        .surprise-close:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        
        /* Balloon styles */
        .balloon {
          position: absolute;
          bottom: -150px;
          border-radius: 50%;
          animation: float-up linear forwards;
          z-index: 10001;
        }
        
        .balloon-string {
          position: absolute;
          width: 1px;
          height: 100px;
          background-color: rgba(255, 255, 255, 0.7);
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(-120vh) rotate(20deg);
          }
        }
        
        /* Gift box styles */
        .gift-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 100px auto;
          cursor: pointer;
          transition: transform 0.3s;
          transform-origin: center bottom;
          animation: gift-bounce 2s infinite alternate;
          z-index: 10002;
        }
        
        .gift-container:hover {
          animation-play-state: paused;
          transform: scale(1.05);
        }
        
        .gift-box {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        
        .gift-lid {
          position: absolute;
          top: -20px;
          left: -10px;
          right: -10px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border-radius: 5px;
          z-index: 1;
          transform-origin: center;
          transition: transform 0.5s;
        }
        
        .gift-ribbon {
          position: absolute;
          top: 0;
          left: 50%;
          width: 30px;
          height: 100%;
          background: var(--secondary);
          transform: translateX(-50%);
          z-index: 2;
        }
        
        .gift-bow {
          position: absolute;
          top: -15px;
          left: 50%;
          width: 60px;
          height: 60px;
          background: var(--secondary);
          border-radius: 50%;
          transform: translateX(-50%);
          z-index: 3;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        .gift-bow::before, .gift-bow::after {
          content: '';
          position: absolute;
          width: 80px;
          height: 40px;
          background: var(--secondary);
          border-radius: 50% 50% 0 0;
        }
        
        .gift-bow::before {
          top: 0;
          left: -10px;
          transform: rotate(-30deg);
          transform-origin: right bottom;
        }
        
        .gift-bow::after {
          top: 0;
          right: -10px;
          transform: rotate(30deg);
          transform-origin: left bottom;
        }
        
        .tap-text {
          position: absolute;
          bottom: -40px;
          left: 0;
          width: 100%;
          text-align: center;
          color: white;
          font-size: 16px;
          font-weight: 500;
          opacity: 0.8;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes gift-bounce {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-20px);
          }
        }
        
        .gift-opening .gift-lid {
          transform: translateY(-60px) rotateZ(20deg);
        }
        
        .gift-opening .gift-box {
          animation: box-open 0.5s forwards;
        }
        
        @keyframes box-open {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(0);
          }
        }
        
        /* Birthday message card styles */
        .birthday-message-card {
          position: relative;
          width: 90%;
          max-width: 500px;
          margin: 0 auto;
          perspective: 1000px;
          z-index: 10003;
          animation: message-appear 1s forwards;
        }
        
        @keyframes message-appear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(50px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .birthday-special-message {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          color: white;
          text-align: center;
          border: 2px solid var(--primary-light);
          transform-style: preserve-3d;
          animation: card-rotate 1s forwards;
        }
        
        @keyframes card-rotate {
          0% {
            transform: rotateY(90deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
        
        .birthday-special-message h2 {
          font-size: 32px;
          margin-bottom: 20px;
          color: var(--secondary);
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        
        .birthday-special-message p {
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        .birthday-signature {
          font-style: italic;
          margin-top: 30px;
          font-size: 20px;
          color: var(--secondary);
        }
        
        /* Birthday cake styles */
        .birthday-cake {
          position: relative;
          width: 100px;
          height: 140px;
          margin: 30px auto 10px;
        }
        
        .cake-bottom {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 40px;
          background: #553c13;
          border-radius: 10px;
        }
        
        .cake-middle {
          position: absolute;
          bottom: 40px;
          width: 90%;
          height: 30px;
          left: 5%;
          background: #6b4b1a;
          border-radius: 10px;
        }
        
        .cake-top {
          position: absolute;
          bottom: 70px;
          width: 80%;
          height: 30px;
          left: 10%;
          background: #7a572e;
          border-radius: 10px;
        }
        
        .candle {
          position: absolute;
          bottom: 100px;
          left: 50%;
          width: 8px;
          height: 35px;
          background: linear-gradient(var(--primary), var(--primary-light));
          transform: translateX(-50%);
          border-radius: 4px;
          z-index: 1;
        }
        
        .flame {
          position: absolute;
          top: -15px;
          left: 50%;
          width: 12px;
          height: 20px;
          background: var(--secondary);
          border-radius: 50% 50% 35% 35%;
          transform: translateX(-50%);
          box-shadow: 0 0 10px var(--secondary), 0 0 20px var(--secondary);
          animation: flame 0.5s infinite alternate;
        }
        
        @keyframes flame {
          0% {
            transform: translateX(-50%) scale(1);
            box-shadow: 0 0 10px var(--secondary), 0 0 20px var(--secondary);
          }
          100% {
            transform: translateX(-50%) scale(1.1) skewX(5deg);
            box-shadow: 0 0 15px var(--secondary), 0 0 30px var(--secondary);
          }
        }
        
        /* Particle animation */
        @keyframes particle-fade-out {
          0% {
            opacity: 1;
            scale: 1;
          }
          100% {
            opacity: 0;
            scale: 0;
          }
        }
        
        /* Audio controls */
        .audio-controls {
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 10004;
        }
        
        .audio-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          transition: background 0.3s;
        }
        
        .audio-button:hover {
          background: var(--primary-light);
        }
        
        .audio-play-button {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 15px 30px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          z-index: 10005;
          transition: all 0.3s;
        }
        
        .audio-play-button:hover {
          background: var(--primary-light);
          transform: translate(-50%, -50%) scale(1.05);
        }
      `;
      
      document.head.appendChild(styleElement);
    }
    
    // Function to calculate and display countdown
    function updateCountdown() {
      const countdownElement = document.getElementById('countdown-timer');
      
      // Get the current date in Germany's timezone (CET/CEST)
      const options = { timeZone: 'Europe/Berlin' };
      const germanyTime = new Date().toLocaleString('en-US', options);
      const now = new Date(germanyTime);
      
      const currentYear = now.getFullYear();
      const nextYear = currentYear + 1;
      
      // Create date for this year's birthday (April 3rd) in German timezone
      const birthdayThisYear = new Date(`${currentYear}-04-03T00:00:00`);
      birthdayThisYear.setTime(birthdayThisYear.getTime() + getTimezoneOffsetForBerlin());
      
      let days, hours, minutes, seconds, countdownText;
      
      // If today is the birthday, we'll show a birthday message but also continue counting to next year
      if (now.getMonth() === 3 && now.getDate() === 3) {
        // Show a birthday message but also calculate countdown to next year
        showBirthdayMessageWithCountdown();
        
        // Calculate time to next year's birthday
        const nextBirthday = new Date(`${nextYear}-04-03T00:00:00`);
        nextBirthday.setTime(nextBirthday.getTime() + getTimezoneOffsetForBerlin());
        
        const difference = nextBirthday.getTime() - now.getTime();
        
        days = Math.floor(difference / (1000 * 60 * 60 * 24));
        hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        updateCountdownDisplay(days, hours, minutes, seconds, "until your next birthday!");
        return;
      }
      
      // If birthday has passed this year, set for next year
      if (now > birthdayThisYear) {
        // Next birthday calculation with correct leap year handling
        const nextBirthday = new Date(`${nextYear}-04-03T00:00:00`);
        nextBirthday.setTime(nextBirthday.getTime() + getTimezoneOffsetForBerlin());
        
        const difference = nextBirthday.getTime() - now.getTime();
        
        days = Math.floor(difference / (1000 * 60 * 60 * 24));
        hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        updateCountdownDisplay(days, hours, minutes, seconds, "until your next birthday!");
      } else {
        // Birthday is still coming up this year
        const difference = birthdayThisYear.getTime() - now.getTime();
        
        days = Math.floor(difference / (1000 * 60 * 60 * 24));
        hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        updateCountdownDisplay(days, hours, minutes, seconds, "until your birthday!");
      }
    }
    
    // Function to show birthday message with countdown for next year
    function showBirthdayMessageWithCountdown() {
      // Add birthday greeting if it doesn't exist yet
      if (!document.querySelector('.birthday-greeting')) {
        const birthdayGreeting = document.createElement('div');
        birthdayGreeting.className = 'birthday-greeting';
        birthdayGreeting.innerHTML = `
          <div class="birthday-message">
            <span class="birthday-icon">🎉</span>
            <span>Happy Birthday Today!</span>
            <span class="birthday-icon">🎉</span>
          </div>
          <div class="timezone-info"></div>
        `;
        
        // Get the timezone note element and place the greeting there
        const timezoneNote = document.querySelector('.timezone-note');
        if (timezoneNote) {
          timezoneNote.innerHTML = ''; // Clear any existing content
          timezoneNote.appendChild(birthdayGreeting);
        } else {
          // If timezone note doesn't exist, find the header and insert after the subtitle
          const headerSubtitle = document.querySelector('.header p');
          if (headerSubtitle && headerSubtitle.nextElementSibling) {
            headerSubtitle.nextElementSibling.appendChild(birthdayGreeting);
          }
        }
        
        // Add CSS for birthday message if not exists
        if (!document.querySelector('style[data-id="birthday-greeting-style"]')) {
          const style = document.createElement('style');
          style.dataset.id = "birthday-greeting-style";
          style.textContent = `
            .birthday-greeting {
              margin: 0.5rem auto;
              padding: 0.5rem;
              background: rgba(0, 155, 58, 0.2);
              border-radius: 0.5rem;
              animation: pulse 1.5s infinite;
              max-width: 400px;
            }
            
            .birthday-message {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.75rem;
              font-size: 1rem;
              font-weight: 700;
              color: var(--light);
            }
            
            .birthday-icon {
              font-size: 1.2rem;
              display: inline-block;
              transform-origin: center;
              animation: shake 1.5s infinite;
            }
            
            .timezone-info {
              font-size: 0.7rem;
              opacity: 0.7;
              margin-top: 0.25rem;
              font-style: italic;
              text-align: center;
            }
            
            @keyframes shake {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(15deg); }
              75% { transform: rotate(-15deg); }
            }
            
            .countdown-continuation {
              margin: 0.5rem auto 0;
              font-size: 0.8rem;
              font-weight: 500;
              color: var(--secondary);
              text-align: center;
              background: rgba(252, 209, 22, 0.1);
              padding: 0.3rem 0.6rem;
              border-radius: 1rem;
              max-width: fit-content;
            }
          `;
          document.head.appendChild(style);
        }
      }
      
      // Add text to explain the countdown is for next year
      const countdownElement = document.getElementById('countdown-timer');
      if (countdownElement) {
        // Add a label to clarify this is counting to next year
        if (!document.querySelector('.countdown-continuation')) {
          const continuation = document.createElement('div');
          continuation.className = 'countdown-continuation';
          continuation.textContent = 'Counting down to next year!';
          countdownElement.parentNode.insertBefore(continuation, countdownElement);
        }
      }
    }
    
    // Helper function to get timezone offset for Berlin
    function getTimezoneOffsetForBerlin() {
      // This function creates a date in Berlin timezone to get the proper offset
      const options = { timeZone: 'Europe/Berlin', timeZoneName: 'short' };
      const berlinDate = new Date().toLocaleString('en-US', options);
      const match = berlinDate.match(/(CET|CEST)$/);
      
      if (match) {
        // Offset in milliseconds
        return match[1] === 'CEST' ? 2 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;
      }
      
      // Default to CET if we can't determine
      return 1 * 60 * 60 * 1000;
    }
    
    // Function to update display when it's Thomas's birthday
    function updateBirthdayDisplay() {
      const countdownElement = document.getElementById('countdown-timer');
      if (countdownElement) {
        countdownElement.innerHTML = `
          <div class="birthday-message">
            <span class="birthday-icon">🎉</span>
            <span>Happy Birthday Today!</span>
            <span class="birthday-icon">🎉</span>
          </div>
          <div class="timezone-info"></div>
        `;
        
        // Add CSS for birthday message
        const style = document.createElement('style');
        style.textContent = `
          .birthday-message {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--light);
            animation: pulse 1.5s infinite;
          }
          
          .birthday-icon {
            font-size: 1.5rem;
            display: inline-block;
            transform-origin: center;
            animation: shake 1.5s infinite;
          }
          
          .timezone-info {
            font-size: 0.8rem;
            opacity: 0.7;
            margin-top: 8px;
            font-style: italic;
          }
          
          @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(15deg); }
            75% { transform: rotate(-15deg); }
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    function updateCountdownDisplay(days, hours, minutes, seconds, message) {
      const countdownElement = document.getElementById('countdown-timer');
      
      // Create more visually appealing countdown with spans
      countdownElement.innerHTML = `
        <span class="countdown-number">${days}<span class="countdown-label">days</span></span>
        <span class="countdown-number">${hours}<span class="countdown-label">hours</span></span>
        <span class="countdown-number">${minutes}<span class="countdown-label">minutes</span></span>
        <span class="countdown-number">${seconds}<span class="countdown-label">seconds</span></span>
        <span class="countdown-message">${message}</span>
      `;
    }
    
    // Initialize parallax effect on images
    function initParallax() {
      document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        const depthFactor = 20; // Adjust for more or less movement
        
        document.querySelectorAll('.nature-image, .card-bg-image').forEach(img => {
          const imgRect = img.getBoundingClientRect();
          const imgCenterX = imgRect.left + imgRect.width / 2;
          const imgCenterY = imgRect.top + imgRect.height / 2;
          
          // Only apply parallax if mouse is near the image (improves performance)
          const distance = Math.sqrt(
            Math.pow(e.clientX - imgCenterX, 2) + 
            Math.pow(e.clientY - imgCenterY, 2)
          );
          
          if (distance < 500) { // Only apply effect when mouse is within 500px
            const movementX = mouseX * depthFactor;
            const movementY = mouseY * depthFactor;
            img.style.transform = `translate(${movementX}px, ${movementY}px)`;
          }
        });
      });
    }
    
    // Initialize scroll animations using Intersection Observer API
    function initAnimations() {
      // Use IntersectionObserver for smoother scroll animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      }, {
        root: null, // viewport
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: '0px' // No margin
      });
      
      // Observe all fade-in elements
      document.querySelectorAll('.animate-fade-in').forEach((element, index) => {
        // Add staggered delay
      element.style.animationDelay = `${index * 0.2}s`;
        observer.observe(element);
      });
      
      // Add floating animation to countdown icon
      const countdownIcon = document.querySelector('.countdown .icon');
      if (countdownIcon) {
        countdownIcon.style.animation = 'pulse 2s infinite ease-in-out, float 4s infinite ease-in-out';
      }
    }
    
    // Add subtle zoom effect on gallery hover
    function initGallery() {
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
          this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
          setTimeout(() => {
            this.style.zIndex = '1';
          }, 300); // Reset z-index after transition
        });
        
        // Add click to view larger
        item.addEventListener('click', function() {
          const img = this.querySelector('img');
          if (img) {
            openLightbox(img.src, img.alt);
          }
        });
      });
    }
    
    // Lightbox for gallery images
    function openLightbox(src, alt) {
      // Create lightbox elements
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      
      const lightboxContent = document.createElement('div');
      lightboxContent.className = 'lightbox-content';
      
      const lightboxImg = document.createElement('img');
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'lightbox-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', () => {
        lightbox.classList.add('closing');
        setTimeout(() => {
          document.body.removeChild(lightbox);
        }, 300);
      });
      
      // Append elements
      lightboxContent.appendChild(lightboxImg);
      lightboxContent.appendChild(closeBtn);
      lightbox.appendChild(lightboxContent);
      document.body.appendChild(lightbox);
      
      // Animation timing
      setTimeout(() => {
        lightbox.classList.add('open');
      }, 10);
      
      // Close when clicking outside the image
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.classList.add('closing');
          setTimeout(() => {
            document.body.removeChild(lightbox);
          }, 300);
        }
      });
    }
    
    // Sound effects
    function playSound(type) {
      // This function is prepared for sound effects
      // Uncomment if you want to implement actual sounds
      /*
      const sounds = {
        flip: 'sounds/flip.mp3',
        click: 'sounds/click.mp3'
      };
      
      if (sounds[type]) {
        const audio = new Audio(sounds[type]);
        audio.volume = 0.3; // Lower volume
        audio.play().catch(e => {
          // Silent catch for browsers that block autoplay
        });
      }
      */
    }
    
    // Add CSS for the new elements
    addDynamicStyles();
    
    function addDynamicStyles() {
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .lightbox.open {
          opacity: 1;
        }
        
        .lightbox.closing {
          opacity: 0;
        }
        
        .lightbox-content {
          position: relative;
          max-width: 90%;
          max-height: 90%;
        }
        
        .lightbox-content img {
          max-width: 100%;
          max-height: 90vh;
          border-radius: 8px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
          transform: scale(0.9);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .lightbox.open .lightbox-content img {
          transform: scale(1);
        }
        
        .lightbox-close {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        
        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        
        .countdown-number {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          margin: 0 0.25rem;
          min-width: 50px;
          font-weight: 700;
          font-size: 1.2rem;
          color: white;
          line-height: 1.2;
        }
        
        .countdown-label {
          font-size: 0.7rem;
          font-weight: 400;
          text-transform: uppercase;
          opacity: 0.8;
          letter-spacing: 0.5px;
        }
        
        .countdown-message {
          margin-left: 0.5rem;
          font-weight: 300;
        }
        
        .animate-fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), 
                      transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .animate-fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        @media (max-width: 768px) {
          .countdown-number {
            min-width: 40px;
            font-size: 1rem;
            padding: 0.4rem 0.5rem;
          }
          
          .countdown-message {
            display: block;
            margin-top: 0.5rem;
            width: 100%;
          }
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Function to handle back to top button
    function initBackToTop() {
      const backToTopButton = document.getElementById('back-to-top');
      
      // Show button when user scrolls down 300px
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      });
      
      // Scroll to top when button is clicked
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // Function to preview birthday celebration
    function previewBirthdayCelebration() {
      // Fire initial confetti blast
      fireConfetti(true);
      
      // Show the header birthday message temporarily
      const header = document.querySelector('.header h1');
      const originalHeaderText = header.innerHTML;
      
      header.innerHTML = 'Happy Birthday Thomas! <span class="today-badge">Today in Germany!</span>';
      
      // Add CSS for the today badge if not already added
      if (!document.querySelector('style[data-id="today-badge-style"]')) {
        const badgeStyle = document.createElement('style');
        badgeStyle.dataset.id = "today-badge-style";
        badgeStyle.textContent = `
          .today-badge {
            display: inline-block;
            background-color: var(--primary);
            color: white;
            font-size: 1rem;
            padding: 0.3rem 0.8rem;
            border-radius: 2rem;
            margin-left: 1rem;
            vertical-align: middle;
            animation: pulse 1.5s infinite;
          }
        `;
        document.head.appendChild(badgeStyle);
      }
      
      // Update countdown display
      const countdownElement = document.getElementById('countdown-timer');
      const originalCountdownHTML = countdownElement.innerHTML;
      
      // Instead of just showing the birthday display, also show the countdown
      showBirthdayMessageWithCountdown();
      
      // Calculate and display countdown to next birthday
      const options = { timeZone: 'Europe/Berlin' };
      const germanyTime = new Date().toLocaleString('en-US', options);
      const now = new Date(germanyTime);
      const nextYear = now.getFullYear() + 1;
      
      // Calculate time to next year's birthday
      const nextBirthday = new Date(`${nextYear}-04-03T00:00:00`);
      nextBirthday.setTime(nextBirthday.getTime() + getTimezoneOffsetForBerlin());
      
      const difference = nextBirthday.getTime() - now.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      updateCountdownDisplay(days, hours, minutes, seconds, "until your next birthday!");
      
      // Add a small German timezone indicator
      const germanyTimeElement = document.createElement('div');
      germanyTimeElement.className = 'germany-time-indicator';
      germanyTimeElement.innerHTML = `<small>Using German Timezone (CET/CEST)</small>`;
      germanyTimeElement.style.cssText = `
        font-size: 0.8rem;
        opacity: 0.75;
        margin-top: 8px;
        font-style: italic;
      `;
      countdownElement.appendChild(germanyTimeElement);
      
      // Setup continuous confetti (just like on the actual birthday)
      const confettiInterval = setInterval(() => {
        fireConfetti(false); // Less intense for the interval
      }, 10000); // Every 10 seconds
      
      // Add note about 24-hour confetti
      const confettiNoteElement = document.createElement('div');
      confettiNoteElement.className = 'confetti-note';
      confettiNoteElement.innerHTML = `<small>On Thomas's real birthday, confetti will continue for 24 hours with a new burst every 10 seconds!</small>`;
      confettiNoteElement.style.cssText = `
        font-size: 0.8rem;
        opacity: 0.75;
        margin-top: 4px;
        font-style: italic;
        color: var(--secondary);
      `;
      countdownElement.appendChild(confettiNoteElement);
      
      // Show birthday surprise overlay with animations, gift, etc.
      setTimeout(() => {
        activateBirthdaySurprise();
        
        // Fire more confetti after a delay
        setTimeout(() => {
          fireConfetti(true);
        }, 2000);
      }, 1500);
      
      // Create a return to normal button in the surprise overlay
      const returnToNormalInterval = setInterval(() => {
        const surpriseOverlay = document.querySelector('.surprise-overlay');
        if (surpriseOverlay && !document.getElementById('return-normal-button')) {
          // Create buttons container
          const buttonsContainer = document.createElement('div');
          buttonsContainer.className = 'preview-buttons';
          buttonsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
            width: 100%;
          `;
          
          // Create end preview button
          const returnButton = document.createElement('button');
          returnButton.id = 'return-normal-button';
          returnButton.className = 'return-normal-button';
          returnButton.textContent = 'End Preview';
          returnButton.style.cssText = `
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 2rem;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
            z-index: 10006;
          `;
          
          // Create reset seen status button
          const resetSeenButton = document.createElement('button');
          resetSeenButton.id = 'reset-seen-button';
          resetSeenButton.className = 'reset-seen-button';
          resetSeenButton.textContent = 'Reset "Seen" Status';
          resetSeenButton.style.cssText = `
            padding: 0.75rem 1.5rem;
            background: rgba(252, 209, 22, 0.3);
            color: white;
            border: 1px solid rgba(252, 209, 22, 0.6);
            border-radius: 2rem;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
            z-index: 10006;
          `;
          
          // Add event listener to end preview button
          returnButton.addEventListener('click', function() {
            // Close the surprise overlay
            surpriseOverlay.classList.add('surprise-exit');
            
            // Stop the confetti interval
            clearInterval(confettiInterval);
            
            // Stop the music
            const audio = document.getElementById('birthday-song');
            if (audio) {
              audio.pause();
              audio.currentTime = 0;
            }
            
            // Remove the audio controls if they exist
            const audioControls = document.querySelector('.audio-controls');
            if (audioControls) {
              document.body.removeChild(audioControls);
            }
            
            // Remove any play button if it exists
            const playButton = document.querySelector('.audio-play-button');
            if (playButton) {
              document.body.removeChild(playButton);
            }
            
            // Remove the overlay after animation
            setTimeout(() => {
              if (surpriseOverlay.parentNode) {
                document.body.removeChild(surpriseOverlay);
              }
              
              // Restore original header and countdown
              header.innerHTML = originalHeaderText;
              countdownElement.innerHTML = originalCountdownHTML;
              updateCountdown();
            }, 1000);
          });
          
          // Add event listener to reset seen status button
          resetSeenButton.addEventListener('click', function() {
            // Get current date in Germany's timezone
            const options = { timeZone: 'Europe/Berlin' };
            const germanyTime = new Date().toLocaleString('en-US', options);
            const today = new Date(germanyTime);
            const birthdayDate = `${today.getFullYear()}-04-03`;
            
            // Remove the "seen surprise" flag
            localStorage.removeItem(`surprise-shown-${birthdayDate}`);
            
            // Show confirmation
            const confirmation = document.createElement('div');
            confirmation.textContent = 'Seen status reset! Surprise will show on next visit.';
            confirmation.style.cssText = `
              position: absolute;
              bottom: 80px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0, 155, 58, 0.8);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              z-index: 10007;
            `;
            surpriseOverlay.appendChild(confirmation);
            
            // Remove confirmation after 3 seconds
            setTimeout(() => {
              if (confirmation.parentNode) {
                confirmation.parentNode.removeChild(confirmation);
              }
            }, 3000);
          });
          
          // Add buttons to container
          buttonsContainer.appendChild(returnButton);
          buttonsContainer.appendChild(resetSeenButton);
          
          // Add container to overlay
          surpriseOverlay.appendChild(buttonsContainer);
          clearInterval(returnToNormalInterval);
        }
      }, 500);
    }
    
    // Add song help functionality
    const songHelp = document.getElementById('song-help');
    if (songHelp) {
      songHelp.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create modal for instructions
        const modal = document.createElement('div');
        modal.className = 'song-help-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'song-help-content';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'song-help-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
          document.body.removeChild(modal);
        });
        
        const title = document.createElement('h3');
        title.textContent = 'How to Add Your Custom Birthday Song';
        
        const instructions = document.createElement('div');
        instructions.className = 'song-instructions';
        instructions.innerHTML = `
          <p>To add your own custom birthday song to the celebration:</p>
          <ol>
            <li>Find a song you want to use (MP3 format works best)</li>
            <li>Upload it to a cloud storage service (Google Drive, Dropbox, etc.)</li>
            <li>Make sure to set the file to be publicly accessible</li>
            <li>Copy the direct link to the file (public URL)</li>
            <li>Click the "Preview Birthday Celebration" button at the bottom of this page</li>
            <li>When the celebration appears, look for the sound controls at the bottom-left corner</li>
            <li>Click the "🎵" button (next to the volume control)</li>
            <li>Paste your song URL in the popup dialog</li>
          </ol>
          <p>Your custom song will be saved and used for future celebrations!</p>
          
          <div class="song-controls-info">
            <h4>Audio Control Buttons:</h4>
            <div class="button-explanations">
              <div class="button-explanation">
                <span class="btn-icon">🔊</span>
                <span class="btn-desc">Mute/Unmute the music</span>
              </div>
              <div class="button-explanation">
                <span class="btn-icon">🎵</span>
                <span class="btn-desc">Enter a custom song URL</span>
              </div>
              <div class="button-explanation">
                <span class="btn-icon">🏠</span>
                <span class="btn-desc">Reset to the default local music (happy-birthday-314197.mp3)</span>
              </div>
            </div>
          </div>
          
          <p><strong>Note:</strong> The website now comes with a local music file in the "music" folder. You can always return to this file by clicking the 🏠 button during the celebration.</p>
          <p><strong>Tip:</strong> When entering a custom URL, you can type "default" to reset to the local music file.</p>
        `;
        
        // Add elements to modal
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(instructions);
        modal.appendChild(modalContent);
        
        // Add modal to document
        document.body.appendChild(modal);
        
        // Add modal styles if they don't exist
        if (!document.querySelector('style[data-id="song-help-styles"]')) {
          const modalStyles = document.createElement('style');
          modalStyles.dataset.id = "song-help-styles";
          modalStyles.textContent = `
            .song-help-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.7);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 10010;
              backdrop-filter: blur(5px);
              animation: fadeIn 0.3s;
            }
            
            .song-help-content {
              background: linear-gradient(135deg, #1a1a1a, #333);
              border-radius: 1rem;
              padding: 2rem;
              max-width: 600px;
              width: 90%;
              max-height: 80vh;
              overflow-y: auto;
              position: relative;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .song-help-close {
              position: absolute;
              top: 10px;
              right: 15px;
              background: none;
              border: none;
              color: white;
              font-size: 24px;
              cursor: pointer;
              transition: transform 0.3s;
            }
            
            .song-help-close:hover {
              transform: scale(1.2);
            }
            
            .song-help-content h3 {
              color: var(--secondary);
              margin-bottom: 1.5rem;
              font-size: 1.5rem;
              text-align: center;
            }
            
            .song-instructions p {
              margin-bottom: 1rem;
              color: rgba(255, 255, 255, 0.9);
            }
            
            .song-instructions ol {
              margin: 1rem 0 1.5rem 1.5rem;
              color: rgba(255, 255, 255, 0.9);
            }
            
            .song-instructions li {
              margin-bottom: 0.5rem;
              padding-left: 0.5rem;
            }
            
            .song-controls-info {
              margin-top: 1.5rem;
              padding: 1rem;
              background: rgba(0, 0, 0, 0.2);
              border-radius: 0.5rem;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .song-controls-info h4 {
              color: var(--secondary);
              margin-bottom: 1rem;
              text-align: center;
              font-size: 1.1rem;
            }
            
            .button-explanations {
              display: flex;
              flex-direction: column;
              gap: 0.8rem;
            }
            
            .button-explanation {
              display: flex;
              align-items: center;
              gap: 1rem;
            }
            
            .btn-icon {
              width: 35px;
              height: 35px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              font-size: 1.2rem;
            }
            
            .btn-desc {
              flex: 1;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @media (max-width: 600px) {
              .song-help-content {
                padding: 1.5rem;
              }
              
              .song-help-content h3 {
                font-size: 1.3rem;
              }
            }
          `;
          document.head.appendChild(modalStyles);
        }
      });
    }
    
    // Function to check if we need to resume confetti on page load
    function resumeConfettiIfNeeded() {
      // Get current time info
      const currentTime = Date.now();
      const storedStartTime = parseInt(localStorage.getItem('confetti-start-time') || '0');
      const storedBirthdayDate = localStorage.getItem('confetti-birthday-date');
      
      // Get current date in Germany's timezone
      const options = { timeZone: 'Europe/Berlin' };
      const germanyTime = new Date().toLocaleString('en-US', options);
      const today = new Date(germanyTime);
      const currentBirthdayDate = `${today.getFullYear()}-04-03`;
      
      // Check if we're still within 24 hours of stored birthday start time
      if (storedStartTime > 0 && currentTime - storedStartTime < 24 * 60 * 60 * 1000) {
        // If it's still the same birthday date, resume confetti
        if (storedBirthdayDate === currentBirthdayDate || (today.getMonth() === 3 && today.getDate() === 3)) {
          console.log('Resuming confetti from previous session');
          
          // Launch initial confetti
          fireConfetti(false);
          
          // Set interval for periodic confetti
          const confettiInterval = setInterval(() => {
            fireConfetti(false); // Less intense for the interval
          }, 10000); // Every 10 seconds
          
          // Check duration every 5 minutes
          const durationCheckInterval = setInterval(() => {
            const checkTime = Date.now();
            // If 24 hours have passed since start time, stop confetti
            if (checkTime - storedStartTime > 24 * 60 * 60 * 1000) {
              clearInterval(confettiInterval);
              clearInterval(durationCheckInterval);
              localStorage.removeItem('confetti-start-time');
              localStorage.removeItem('confetti-birthday-date');
              console.log('Resumed confetti stopped after 24 hour total period');
            }
          }, 5 * 60 * 1000);
        }
      }
    }
  });
  