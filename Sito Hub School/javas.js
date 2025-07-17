// Global Variables
let productsPerPage; // La rendo dinamica invece di fissarla a 20
let currentPage = 1;
let filteredProducts = [];
const activeCategories = new Set();
// NUOVA VARIABILE: Set per memorizzare gli ID dei prodotti preferiti
let favoriteProductsIds = new Set();
// NUOVA VARIABILE: Set per memorizzare gli ID dei prodotti "Nuovi" che sono stati visti
let viewedNewProductsIds = new Set();

const searchInput = document.getElementById('search-input');
const productsContainer = document.getElementById('products-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageIndicator = document.getElementById('page-indicator');
const themeToggle = document.getElementById('theme-toggle');
// Aggiorna la selezione dei bottoni di categoria per includere il nuovo
const categoryButtons = document.querySelectorAll('.category-btn');

// Elementi del modale di consenso cookie
const cookieConsentOverlay = document.getElementById('cookie-consent-overlay');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const rejectCookiesBtn = document.getElementById('reject-cookies');

// Funzioni per la gestione dei cookie
/**
 * Imposta un cookie con il nome, il valore e la durata specificati.
 * @param {string} name Il nome del cookie.
 * @param {string} value Il valore da salvare nel cookie.
 * @param {number} days I giorni di validità del cookie.
 */
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * Ottiene il valore di un cookie dato il suo nome.
 * @param {string} name Il nome del cookie da cercare.
 * @returns {string} Il valore del cookie, o una stringa vuota se non trovato.
 */
function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

/**
 * Mostra il modale di consenso cookie.
 * Lo scrolling del body non viene più bloccato.
 */
function showCookieConsent() {
    if (cookieConsentOverlay) {
        cookieConsentOverlay.classList.add('show');
        // document.body.classList.add('no-scroll'); // Rimosso: lo scrolling rimane attivo
    }
}

/**
 * Nasconde il modale di consenso cookie.
 * Lo scrolling del body non viene più riabilitato perché non era mai stato disabilitato.
 */
function hideCookieConsent() {
    if (cookieConsentOverlay) {
        cookieConsentOverlay.classList.remove('show');
        // document.body.classList.remove('no-scroll'); // Rimosso: lo scrolling rimane attivo
    }
}

/**
 * Gestisce l'accettazione dei cookie.
 */
function handleAcceptCookies() {
    setCookie("cookie_consent", "accepted", 365); // Consenso valido per 365 giorni
    hideCookieConsent();
    // Inizializza le funzionalità che dipendono dai cookie qui, inclusi i preferiti e i prodotti visti
    loadFavoritesFromCookie();
    loadViewedNewProductsFromCookie(); // Carica i prodotti visti
    // Ricarica i prodotti per assicurarsi che i pulsanti preferiti e i badge "Nuovo" siano aggiornati
    filterProducts();
}

/**
 * Gestisce il rifiuto dei cookie.
 */
function handleRejectCookies() {
    setCookie("cookie_consent", "rejected", 365); // Rifiuto valido per 365 giorni
    hideCookieConsent();
    // Se i cookie sono rifiutati, svuota i preferiti e i prodotti visti e non salvare
    favoriteProductsIds.clear();
    viewedNewProductsIds.clear(); // Svuota i prodotti visti
    // Ricarica i prodotti per assicurarsi che i pulsanti preferiti siano aggiornati (non rossi) e i badge "Nuovo" riappaiano
    filterProducts();
}

// NUOVE FUNZIONI PER I PREFERITI
/**
 * Carica gli ID dei prodotti preferiti dal cookie.
 */
function loadFavoritesFromCookie() {
    const favoritesCookie = getCookie("favorite_products");
    if (favoritesCookie) {
        try {
            const parsedFavorites = JSON.parse(favoritesCookie);
            // Assicurati che parsedFavorites sia un array prima di usarlo
            if (Array.isArray(parsedFavorites)) {
                favoriteProductsIds = new Set(parsedFavorites);
            } else {
                favoriteProductsIds = new Set(); // Se non è un array valido, inizia con un set vuoto
            }
        } catch (e) {
            console.error("Errore nel parsing del cookie dei preferiti:", e);
            favoriteProductsIds = new Set(); // In caso di errore, inizia con un set vuoto
        }
    } else {
        favoriteProductsIds = new Set();
    }
    console.log("Preferiti caricati:", Array.from(favoriteProductsIds));
}

/**
 * Salva gli ID dei prodotti preferiti nel cookie.
 */
function saveFavoritesToCookie() {
    // Salva solo se i cookie sono stati accettati
    if (getCookie("cookie_consent") === "accepted") {
        const favoritesArray = Array.from(favoriteProductsIds);
        setCookie("favorite_products", JSON.stringify(favoritesArray), 365);
        console.log("Preferiti salvati:", favoritesArray);
    } else {
        console.log("Cookie non accettati, preferiti non salvati.");
    }
}

/**
 * Toggle lo stato preferito di un prodotto e aggiorna i cookie.
 * @param {number} productId L'ID del prodotto.
 * @param {HTMLElement} buttonElement L'elemento del pulsante preferito.
 */
function toggleFavorite(productId, buttonElement) {
    if (getCookie("cookie_consent") !== "accepted") {
        // Se i cookie non sono accettati, non permettere di aggiungere ai preferiti
        showCookieConsent(); // Mostra il modale per chiedere il consenso
        return;
    }

    if (favoriteProductsIds.has(productId)) {
        favoriteProductsIds.delete(productId);
        buttonElement.classList.remove('is-favorite');
    } else {
        favoriteProductsIds.add(productId);
        buttonElement.classList.add('is-favorite');
    }
    saveFavoritesToCookie();
    // Se la categoria "Preferiti" è attiva, ricarica i prodotti per riflettere il cambiamento
    if (activeCategories.has('preferiti')) {
        filterProducts();
    }
}

// NUOVE FUNZIONI PER I PRODOTTI "NUOVI" VISTI
/**
 * Carica gli ID dei prodotti "nuovi" visti dal cookie.
 */
function loadViewedNewProductsFromCookie() {
    const viewedCookie = getCookie("viewed_new_products");
    if (viewedCookie) {
        try {
            const parsedViewed = JSON.parse(viewedCookie);
            if (Array.isArray(parsedViewed)) {
                viewedNewProductsIds = new Set(parsedViewed);
            } else {
                viewedNewProductsIds = new Set();
            }
        } catch (e) {
            console.error("Errore nel parsing del cookie dei prodotti visti:", e);
            viewedNewProductsIds = new Set();
        }
    } else {
        viewedNewProductsIds = new Set();
    }
    console.log("Prodotti 'Nuovi' visti caricati:", Array.from(viewedNewProductsIds));
}

/**
 * Salva gli ID dei prodotti "nuovi" visti nel cookie.
 */
function saveViewedNewProductsToCookie() {
    if (getCookie("cookie_consent") === "accepted") {
        const viewedArray = Array.from(viewedNewProductsIds);
        setCookie("viewed_new_products", JSON.stringify(viewedArray), 365);
        console.log("Prodotti 'Nuovi' visti salvati:", viewedArray);
    } else {
        console.log("Cookie non accettati, prodotti 'Nuovi' visti non salvati.");
    }
}

/**
 * Marca un prodotto come "visto" (rimuove il badge "Nuovo" e l'animazione).
 * @param {number} productId L'ID del prodotto da marcare come visto.
 */
function markProductAsViewed(productId) {
    if (getCookie("cookie_consent") !== "accepted") {
        showCookieConsent(); // Mostra il modale per chiedere il consenso
        return;
    }

    // Aggiungi l'ID del prodotto al set dei prodotti visti solo se non è già presente
    if (!viewedNewProductsIds.has(productId)) {
        viewedNewProductsIds.add(productId);
        saveViewedNewProductsToCookie();
        // Ricarica i prodotti per aggiornare la visualizzazione della card
        filterProducts();
    }
}


// Funzione per calcolare il numero ottimale di prodotti per pagina
function calculateProductsPerPage() {
    const windowWidth = window.innerWidth;
    let columns;

    // Determina il numero di colonne in base alla larghezza della finestra
    if (windowWidth <= 350) { // Da 350px in giù, 1 colonna
        columns = 1;
    } else if (windowWidth <= 540) { // Da 540px a 400px, 2 colonne (quindi tra 351px e 540px)
        columns = 2;
    } else if (windowWidth <= 700) { // Da 700px a 600px, 3 colonne (quindi tra 541px e 700px)
        columns = 3;
    } else if (windowWidth <= 800) { // Da 800px a 768px, 4 colonne (quindi tra 701px e 800px)
        columns = 4;
    } else if (windowWidth < 2560) { // Per risoluzioni tra 801px e 2559px, manteniamo 4 colonne
        columns = 4;
    } else { // Per risoluzioni 2K e superiori (2560px e oltre), 5 colonne
        columns = 5;
    }

    // Calcola un numero di prodotti per pagina che sia multiplo del numero di colonne
    const rows = 4; // Manteniamo 4 righe come base
    return columns * rows;
}

// Format date for display and comparison
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Check if a product is new (added in the last 7 days)
// Modificata per considerare anche se il prodotto è stato marcato come visto
function isNewProduct(dateString, productId) {
    if (!dateString || !productId) return false; // Aggiunto controllo per evitare errori
    const productDate = new Date(dateString);
    const today = new Date();
    const differenceInTime = today - productDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    // È nuovo se la data è recente E non è stato marcato come visto
    return differenceInDays <= 7 && !viewedNewProductsIds.has(productId);
}

// Filter products based on search query and active categories
function filterProducts() {
    const searchQuery = searchInput.value.toLowerCase();
    let tempFilteredProducts = [];

    // Se la barra di ricerca è in uso E ci sono categorie attive (inclusi i preferiti),
    // disattiva tutte le categorie per cercare nell'intero catalogo.
    if (searchQuery.length > 0 && activeCategories.size > 0) {
        activeCategories.clear(); // Rimuove tutte le categorie attive
        // Rimuovi la classe 'active' da tutti i bottoni di categoria per resettare la visualizzazione
        categoryButtons.forEach(button => {
            button.classList.remove('active');
        });
    }

    // Logica di filtraggio originale
    if (activeCategories.has('preferiti')) {
        tempFilteredProducts = window.productsData.filter(product =>
            favoriteProductsIds.has(product.id) && product.title.toLowerCase().includes(searchQuery)
        );
    } else if (activeCategories.size === 0) {
        // Se nessuna categoria specifica (tranne preferiti) è attiva, filtra solo per ricerca
        tempFilteredProducts = window.productsData.filter(product =>
            product.title.toLowerCase().includes(searchQuery)
        );
    } else {
        // Altrimenti, filtra per categorie attive E per ricerca
        tempFilteredProducts = window.productsData.filter(product =>
            activeCategories.has(product.category) &&
            product.title.toLowerCase().includes(searchQuery)
        );
    }

    filteredProducts = tempFilteredProducts;

    // Sort by date (newest first)
    filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Reset to first page when filter changes
    currentPage = 1;
    updateProducts();
    updatePagination();
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    // Applica la classe highlight solo se è un nuovo prodotto E non è stato ancora visto
    if (isNewProduct(product.date, product.id)) {
        card.classList.add('highlight');
    }

    card.setAttribute('data-date', product.date);

    // Crea il pulsante preferiti
    const favoriteButton = document.createElement('div');
    favoriteButton.className = 'favorite-btn';
    // Controlla se il prodotto è già tra i preferiti e aggiungi la classe
    if (favoriteProductsIds.has(product.id)) {
        favoriteButton.classList.add('is-favorite');
    }
    // Aggiungi l'icona SVG del cuore
    favoriteButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    `;
    // Aggiungi l'event listener al pulsante preferiti
    favoriteButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita che il click si propaghi alla card intera
        event.preventDefault(); // Previene il comportamento di default del link se presente
        toggleFavorite(product.id, favoriteButton);
    });
    card.appendChild(favoriteButton);


    // Crea un elemento <a> che avvolge tutto il contenuto della card
    const productLink = document.createElement('a');
    productLink.href = product.externalLink || `#`; // Usa il link specifico del prodotto o # se non definito
    productLink.target = "_blank"; // Apre in una nuova scheda
    productLink.rel = "noopener noreferrer"; // Per sicurezza
    productLink.style.textDecoration = "none"; // Rimuove la sottolineatura del link
    productLink.style.color = "inherit"; // Mantiene il colore del testo originale

    // Aggiungi event listener per marcare il prodotto come visto quando la card viene cliccata
    productLink.addEventListener('click', (event) => {
        // Solo se il link non è un # (cioè ha un externalLink valido), allora marca come visto
        // Se il tuo intento è che *ogni* click sulla card la marchi come vista, rimuovi la condizione if (product.externalLink).
        if (product.externalLink) {
            markProductAsViewed(product.id);
        }
    });

    // Crea l'elemento h3 per il titolo
    const productTitle = document.createElement('h3');
    productTitle.className = 'product-title';
    productTitle.textContent = product.title;
    productTitle.title = product.title; // Imposta l'attributo title con il testo completo del titolo

    productLink.innerHTML += `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        ${isNewProduct(product.date, product.id) ? '<span class="new-badge">Nuovo</span>' : ''}
        <span class="product-date">${formatDate(product.date)}</span>
    `;
    productLink.appendChild(productTitle); // Aggiunge il titolo all'interno del link

    card.appendChild(productLink);

    return card;
}

// Display products for current page
function updateProducts() {
    // Ricalcola il numero ottimale di prodotti per pagina
    productsPerPage = calculateProductsPerPage();

    productsContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);

    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    if (currentProducts.length === 0) {
        const noProducts = document.createElement('p');
        noProducts.textContent = 'Nessun prodotto trovato.';
        noProducts.style.textAlign = 'center';
        noProducts.style.width = '100%';
        noProducts.style.padding = '2rem';
        productsContainer.appendChild(noProducts);
        return;
    }

    currentProducts.forEach(product => {
        const card = createProductCard(product);
        productsContainer.appendChild(card);
    });
}

// Update pagination controls
function updatePagination() {
    // Ricalcola il numero ottimale di prodotti per pagina
    productsPerPage = calculateProductsPerPage();

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

    // Aggiorniamo l'indicatore di pagina con un input per la navigazione diretta
    pageIndicator.innerHTML = `Pagina <input type="number" id="page-number-input" min="1" max="${totalPages}" value="${currentPage}"> di ${totalPages}`;

    // Aggiungiamo l'event listener all'input
    const pageNumberInput = document.getElementById('page-number-input');
    pageNumberInput.addEventListener('change', handlePageInputChange);
    pageNumberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handlePageInputChange();
        }
    });

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

// Funzione per gestire il cambio di pagina tramite input
function handlePageInputChange() {
    const pageNumberInput = document.getElementById('page-number-input');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

    // Ottieni il valore inserito come numero
    let newPage = parseInt(pageNumberInput.value, 10);

    // Verifica che sia un numero valido e nel range corretto
    if (isNaN(newPage) || newPage < 1) {
        newPage = 1;
    } else if (newPage > totalPages) {
        newPage = totalPages;
    }

    // Aggiorna il valore nell'input (per correggere eventuali valori fuori range)
    pageNumberInput.value = newPage;

    // Se la pagina è cambiata, aggiorna la visualizzazione
    if (newPage !== currentPage) {
        currentPage = newPage;
        updateProducts();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Initialize the page
function init() {
    // Verifica che i dati dei prodotti siano disponibili
    if (!window.productsData || !Array.isArray(window.productsData)) {
        console.error('Errore: l\'array dei prodotti non è disponibile!');
        return;
    }

    // Calcola inizialmente il numero di prodotti per pagina
    productsPerPage = calculateProductsPerPage();

    // Imposta i prodotti filtrati iniziali
    filteredProducts = [...window.productsData];

    // Set event listeners
    searchInput.addEventListener('input', filterProducts);

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateProducts();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateProducts();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        // Toggle la classe 'dark-theme' sull'elemento <html>
        document.documentElement.classList.toggle('dark-theme');
        const isDarkTheme = document.documentElement.classList.contains('dark-theme');
        // Aggiorna l'icona del toggle
        themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
        // Salva la preferenza del tema nel cookie SOLO SE I COOKIE SONO ACCETTATI
        if (getCookie("cookie_consent") === "accepted") {
            setCookie("theme", isDarkTheme ? "dark" : "light", 365);
        }
    });

    // Imposta l'icona del tema all'avvio in base allo stato attuale del tema
    // Questo viene eseguito dopo che lo script inline nella <head> ha già applicato la classe.
    const isDarkThemeOnLoad = document.documentElement.classList.contains('dark-theme');
    themeToggle.textContent = isDarkThemeOnLoad ? '☀️' : '🌙';

    // Category buttons functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');

            // Gestione esclusiva per la categoria "preferiti"
            if (category === 'preferiti') {
                // Se "preferiti" è già attiva, disattivala. Altrimenti, attivala e disattiva le altre.
                if (activeCategories.has('preferiti')) {
                    activeCategories.clear(); // Svuota tutte le categorie
                    button.classList.remove('active');
                } else {
                    activeCategories.clear(); // Svuota tutte le altre categorie
                    activeCategories.add('preferiti');
                    // Rimuovi la classe 'active' da tutti gli altri bottoni
                    categoryButtons.forEach(btn => {
                        if (btn !== button) {
                            btn.classList.remove('active');
                        }
                    });
                    button.classList.add('active');
                }
            } else {
                // Se un'altra categoria è cliccata, disattiva "preferiti" se attivo
                if (activeCategories.has('preferiti')) {
                    activeCategories.delete('preferiti');
                    document.querySelector('.category-btn[data-category="preferiti"]').classList.remove('active');
                }

                if (button.classList.contains('active')) {
                    // Deactivate category
                    button.classList.remove('active');
                    activeCategories.delete(category);
                } else {
                    // Activate category
                    button.classList.add('active');
                    activeCategories.add(category);
                }
            }

            filterProducts();
        });
    });

    // Aggiungi event listener per ridimensionamento della finestra
    window.addEventListener('resize', function() {
        // Ricalcola il numero di prodotti per pagina
        const newProductsPerPage = calculateProductsPerPage();

        // Se è cambiato, aggiorna la visualizzazione
        if (newProductsPerPage !== productsPerPage) {
            productsPerPage = newProductsPerPage;
            updateProducts();
            updatePagination();
        }
    });

    // Initial load of products and pagination
    filterProducts();
}

// Funzione per gestire il click sulla parola evidenziata (nel modale cookie)
function toggleContent(wordId, contentId) {
    const clickableWord = document.getElementById(wordId);
    const hiddenContent = document.getElementById(contentId);

    if (hiddenContent.style.display === 'block') {
        // Se il contenuto è visibile, nascondilo
        hiddenContent.style.display = 'none';
        clickableWord.setAttribute('aria-expanded', 'false');
    } else {
        // Se il contenuto è nascosto, mostralo
        hiddenContent.style.display = 'block';
        clickableWord.setAttribute('aria-expanded', 'true');
    }
}


// Esegui l'inizializzazione principale del sito non appena il DOM è completamente caricato.
// La gestione del consenso dei cookie avverrà separatamente.
document.addEventListener('DOMContentLoaded', function() {
    // Prima di tutto, inizializza il sito per mostrare i prodotti
    init();

    const consent = getCookie("cookie_consent");

    if (consent !== "accepted" && consent !== "rejected") { // Mostra il modale solo se non c'è una scelta
        showCookieConsent(); // Mostra il modale per la prima volta
        // Aggiungi event listener per i pulsanti del modale
        if (acceptCookiesBtn) {
            acceptCookiesBtn.addEventListener('click', handleAcceptCookies);
        }
        if (rejectCookiesBtn) {
            rejectCookiesBtn.addEventListener('click', handleRejectCookies);
        }
    } else {
        // Se c'è già una scelta, carica i dati dai cookie e aggiorna la visualizzazione
        if (consent === "accepted") {
            loadFavoritesFromCookie(); // Carica i preferiti se il consenso è già dato
            loadViewedNewProductsFromCookie(); // Carica i prodotti visti se il consenso è già dato
            // Dopo aver caricato i cookie, ricarica i prodotti per applicare lo stato "visto"
            filterProducts();
        }
    }

    // Aggiungi gli event listener per la parola "biscotti" nel modale di consenso
    const cookieWord = document.getElementById('cookieWord');
    if (cookieWord) { // Verifica che l'elemento esista
        cookieWord.addEventListener('click', () => toggleContent('cookieWord', 'cookieContent'));
        // Permetti di attivare con Enter/Spazio per accessibilità
        cookieWord.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Impedisce lo scroll della pagina con Spazio
                toggleContent('cookieWord', 'cookieContent');
            }
        });
    }
});
