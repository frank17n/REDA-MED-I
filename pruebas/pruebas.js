const cards = document.querySelectorAll('.card-flip');

cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('active');
    });
});
