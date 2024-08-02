let currentPage = 1;

function nextPage() {
    if (currentPage === 1) {
        document.getElementById('page1').style.transform = 'rotateY(-180deg)';
        document.getElementById('page2').style.transform = 'rotateY(0deg)';
        currentPage = 2;
    }
}

function prevPage() {
    if (currentPage === 2) {
        document.getElementById('page1').style.transform = 'rotateY(0deg)';
        document.getElementById('page2').style.transform = 'rotateY(-180deg)';
        currentPage = 1;
    }
}
