// products-data.js - Database dei prodotti per FlexyShop
// Questo file contiene solo i dati dei prodotti

// Esportiamo i prodotti come una variabile globale
window.productsData = [
    {
        id: 1,
        title: "Smartphone XYZ",
        price: "299,99€",
        image: "Products Cover/Img28.jpg",
        category: "elettronica",
        date: "2025-04-15"
    },
    {
        id: 2,
        title: "Laptop Pro",
        price: "899,99€",
        image: "/api/placeholder/400/300",
        category: "elettronica",
        date: "2025-04-10"
    },
    {
        id: 3,
        title: "Cuffie Wireless",
        price: "79,99€",
        image: "/api/placeholder/400/300",
        category: "elettronica",
        date: "2025-04-18"
    },
    {
        id: 4,
        title: "T-Shirt Basic",
        price: "19,99€",
        image: "/api/placeholder/400/300",
        category: "abbigliamento",
        date: "2025-03-25"
    },
    {
        id: 5,
        title: "Jeans Slim Fit",
        price: "49,99€",
        image: "/api/placeholder/400/300",
        category: "abbigliamento",
        date: "2025-04-05"
    },
    {
        id: 6,
        title: "Scarpe Sportive",
        price: "89,99€",
        image: "/api/placeholder/400/300",
        category: "abbigliamento",
        date: "2025-04-12"
    },
    {
        id: 7,
        title: "Divano 3 Posti",
        price: "499,99€",
        image: "/api/placeholder/400/300",
        category: "casa",
        date: "2025-03-15"
    },
    {
        id: 8,
        title: "Lampada da Tavolo",
        price: "39,99€",
        image: "/api/placeholder/400/300",
        category: "casa",
        date: "2025-04-02"
    },
    {
        id: 9,
        title: "Set Piatti",
        price: "59,99€",
        image: "/api/placeholder/400/300",
        category: "casa",
        date: "2025-04-20"
    },
    {
        id: 10,
        title: "Pallone da Calcio",
        price: "24,99€",
        image: "/api/placeholder/400/300",
        category: "sport",
        date: "2025-03-10"
    },
    {
        id: 11,
        title: "Racchetta da Tennis",
        price: "119,99€",
        image: "/api/placeholder/400/300",
        category: "sport",
        date: "2025-04-05"
    },
    {
        id: 12,
        title: "Tappetino Yoga",
        price: "29,99€",
        image: "/api/placeholder/400/300",
        category: "sport",
        date: "2025-04-08"
    },
    {
        id: 13,
        title: "Il Nome del Vento",
        price: "18,50€",
        image: "/api/placeholder/400/300",
        category: "libri",
        date: "2025-03-22"
    },
    {
        id: 14,
        title: "Dune",
        price: "15,99€",
        image: "/api/placeholder/400/300",
        category: "libri",
        date: "2025-04-01"
    },
    {
        id: 15,
        title: "Fondazione",
        price: "14,50€",
        image: "/api/placeholder/400/300",
        category: "libri",
        date: "2025-04-11"
    },
    {
        id: 16,
        title: "Console GameStation 5",
        price: "499,99€",
        image: "/api/placeholder/400/300",
        category: "giochi",
        date: "2025-03-18"
    },
    {
        id: 17,
        title: "Gioco da Tavolo Strategico",
        price: "39,99€",
        image: "/api/placeholder/400/300",
        category: "giochi",
        date: "2025-04-03"
    },
    {
        id: 18,
        title: "Puzzle 1000 Pezzi",
        price: "19,99€",
        image: "/api/placeholder/400/300",
        category: "giochi",
        date: "2025-04-14"
    },
    {
        id: 10,
        title: "Pallone da Calcio",
        price: "24,99€",
        image: "/api/placeholder/400/300",
        category: "sport",
        date: "2025-03-10"
    },
    {
        id: 11,
        title: "Racchetta da Tennis",
        price: "119,99€",
        image: "/api/placeholder/400/300",
        category: "sport",
        date: "2025-04-05"
    },
    {
        id: 12,
        title: "Tappetino Yoga",
        price: "29,99€",
        image: "/api/placeholder/400/300",
        category: "sport",
        date: "2025-04-08"
    },
    {
        id: 13,
        title: "Il Nome del Vento",
        price: "18,50€",
        image: "/api/placeholder/400/300",
        category: "libri",
        date: "2025-03-22"
    },
    {
        id: 14,
        title: "Dune",
        price: "15,99€",
        image: "/api/placeholder/400/300",
        category: "libri",
        date: "2025-04-01"
    },
    {
        id: 15,
        title: "Fondazione",
        price: "14,50€",
        image: "/api/placeholder/400/300",
        category: "libri",
        date: "2025-04-11"
    },
    {
        id: 16,
        title: "Console GameStation 5",
        price: "499,99€",
        image: "/api/placeholder/400/300",
        category: "giochi",
        date: "2025-03-18"
    },
    {
        id: 17,
        title: "Gioco da Tavolo Strategico",
        price: "39,99€",
        image: "/api/placeholder/400/300",
        category: "giochi",
        date: "2025-04-03"
    },
    {
        id: 18,
        title: "Puzzle 1000 Pezzi",
        price: "19,99€",
        image: "/api/placeholder/400/300",
        category: "giochi",
        date: "2025-04-14"
    },
    {
        id: 19,
        title: "Smartphone XYZ",
        price: "299,99€",
        image: "/api/placeholder/400/300",
        category: "elettronica",
        date: "2025-04-15",
        externalLink: "https://www.youtube.com/"
    }
];

// Funzione che consente di aggiungere un nuovo prodotto
window.addNewProductToData = function(productData) {
    // Trova l'ID più alto attualmente presente
    const maxId = Math.max(...window.productsData.map(product => product.id));
    
    // Crea il nuovo prodotto con ID incrementale
    const newProduct = {
        id: maxId + 1,
        title: productData.title,
        price: productData.price,
        image: productData.image || "/api/placeholder/400/300",
        category: productData.category,
        date: productData.date || new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    
    // Aggiungi il nuovo prodotto all'inizio dell'array (così appare come più recente)
    window.productsData.unshift(newProduct);
    
    return newProduct;
};