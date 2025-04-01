
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Flip card functionality
  const flipCard = document.getElementById('flip-card');
  const flipButton = document.getElementById('flip-button');
  
  // Add click event to the card and button
  flipCard.addEventListener('click', function() {
    flipCard.classList.toggle('flipped');
  });
  
  flipButton.addEventListener('click', function(e) {
    // Prevent the click from propagating to the card
    e.stopPropagation();
    flipCard.classList.toggle('flipped');
  });
  
  // Birthday countdown functionality
  updateCountdown();
  
  // Update countdown every minute
  setInterval(updateCountdown, 60000);
  
  // Function to calculate and display countdown
  function updateCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;
    
    // Create date for this year's birthday (April 3rd)
    const birthdayThisYear = new Date(currentYear, 3, 3); // Month is 0-indexed, so 3 is April
    
    let days, hours, minutes, countdownText;
    
    // If birthday has passed this year, set for next year
    if (now > birthdayThisYear) {
      // Check if next year is a leap year
      const isLeapYear = (nextYear % 4 === 0 && nextYear % 100 !== 0) || (nextYear % 400 === 0);
      const nextBirthday = new Date(nextYear, 3, 3); // April 3rd next year
      
      const difference = nextBirthday.getTime() - now.getTime();
      
      days = Math.floor(difference / (1000 * 60 * 60 * 24));
      hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    } else {
      // Birthday is still coming up this year
      const difference = birthdayThisYear.getTime() - now.getTime();
      
      days = Math.floor(difference / (1000 * 60 * 60 * 24));
      hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    }
    
    countdownText = `${days} days, ${hours} hours, ${minutes} minutes until your next birthday!`;
    countdownElement.textContent = countdownText;
  }
  
  // Apply staggered animation to elements
  const animatedElements = document.querySelectorAll('.animate-fade-in');
  animatedElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.2}s`;
  });
});
