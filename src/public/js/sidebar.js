// Gestione della sidebar mobile
document.addEventListener('DOMContentLoaded', function() {
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const openButton = document.getElementById('open-sidebar-button');
    const closeButton = document.getElementById('close-sidebar-button');
    
    // Verifica che gli elementi esistano prima di aggiungere gli event listener
    if (!mobileSidebar || !openButton || !closeButton) {
        console.error('Elementi della sidebar non trovati');
        return;
    }
    
    // Funzione per aprire la sidebar
    function openSidebar() {
        mobileSidebar.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    // Funzione per chiudere la sidebar
    function closeSidebar() {
        mobileSidebar.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    openButton.addEventListener('click', openSidebar);
    closeButton.addEventListener('click', closeSidebar);
    
    // Chiudi la sidebar quando si clicca fuori
    mobileSidebar.addEventListener('click', function(e) {
        if (e.target === mobileSidebar) {
            closeSidebar();
        }
    });
}); 