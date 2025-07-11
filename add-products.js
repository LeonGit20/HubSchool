// add-products.js - Gestione aggiunta nuovi prodotti per FlexyShop
// Da includere dopo javas.js

// Funzione per aggiungere un nuovo prodotto
function addNewProduct(productData) {
    // Verifica che tutti i campi richiesti siano presenti
    if (!productData.title || !productData.price || !productData.category) {
        console.error('Dati prodotto incompleti');
        return false;
    }

    // Assegna un ID univoco (usa l'ultimo ID + 1)
    const lastId = Math.max(...products.map(product => product.id));
    const newId = lastId + 1;
    
    // Imposta la data odierna se non specificata
    if (!productData.date) {
        const today = new Date();
        productData.date = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }
    
    // Imposta un'immagine placeholder se non specificata
    if (!productData.image) {
        productData.image = "/api/placeholder/400/300";
    }
    
    // Crea il nuovo oggetto prodotto
    const newProduct = {
        id: newId,
        title: productData.title,
        price: productData.price,
        image: productData.image,
        category: productData.category,
        date: productData.date
    };
    
    // Aggiungi il prodotto all'array dei prodotti
    products.unshift(newProduct); // Aggiungi all'inizio per mostrarlo come "più recente"
    
    // Aggiorna la visualizzazione
    filterProducts();
    
    return newId; // Restituisce l'ID del nuovo prodotto
}

// Funzione per creare un form di inserimento prodotto
function createProductForm() {
    // Crea un contenitore modale per il form
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    modalContent.innerHTML = `
        <h2>Aggiungi Nuovo Prodotto</h2>
        <form id="new-product-form">
            <div class="form-group">
                <label for="product-title">Nome Prodotto *</label>
                <input type="text" id="product-title" required>
            </div>
            <div class="form-group">
                <label for="product-price">Prezzo *</label>
                <input type="text" id="product-price" placeholder="Es. 99,99€" required>
            </div>
            <div class="form-group">
                <label for="product-category">Categoria *</label>
                <select id="product-category" required>
                    <option value="">Seleziona una categoria</option>
                    <option value="elettronica">Elettronica</option>
                    <option value="abbigliamento">Abbigliamento</option>
                    <option value="casa">Casa</option>
                    <option value="sport">Sport</option>
                    <option value="libri">Libri</option>
                    <option value="giochi">Giochi</option>
                </select>
            </div>
            <div class="form-group">
                <label for="product-image">URL Immagine (opzionale)</label>
                <input type="text" id="product-image" placeholder="Lascia vuoto per immagine predefinita">
            </div>
            <div class="form-buttons">
                <button type="button" id="cancel-product">Annulla</button>
                <button type="submit" id="submit-product">Aggiungi Prodotto</button>
            </div>
        </form>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Gestione evento di chiusura del form
    document.getElementById('cancel-product').addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
    
    // Gestione evento di invio del form
    document.getElementById('new-product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Raccogli i dati dal form
        const newProduct = {
            title: document.getElementById('product-title').value,
            price: document.getElementById('product-price').value,
            category: document.getElementById('product-category').value,
            image: document.getElementById('product-image').value || null
        };
        
        // Aggiungi il prodotto
        const newId = addNewProduct(newProduct);
        
        if (newId) {
            // Mostra un messaggio di conferma
            alert(`Prodotto "${newProduct.title}" aggiunto con successo!`);
            
            // Chiudi il form
            document.body.removeChild(modalOverlay);
        }
    });
}

// Funzione per aggiungere il pulsante "Aggiungi Prodotto" nell'interfaccia
function addNewProductButton() {
    // Crea il pulsante
    const addButton = document.createElement('button');
    addButton.className = 'add-product-btn';
    addButton.textContent = '+ Aggiungi Prodotto';
    
    // Aggiungi il pulsante sopra i prodotti
    const productsContainer = document.getElementById('products-container');
    productsContainer.parentNode.insertBefore(addButton, productsContainer);
    
    // Aggiungi l'event listener
    addButton.addEventListener('click', createProductForm);
}

// Aggiungi stili CSS per il form modale e il pulsante
function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .add-product-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            cursor: pointer;
            margin-bottom: 1.5rem;
            transition: background-color 0.3s;
        }
        
        .add-product-btn:hover {
            background-color: #2980b9;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-content {
            background-color: var(--card-bg);
            border-radius: 8px;
            padding: 2rem;
            width: 90%;
            max-width: 500px;
            box-shadow: var(--shadow);
            color: var(--text-color);
        }
        
        .modal-content h2 {
            margin-bottom: 1.5rem;
            color: var(--primary-color);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group input, .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: var(--bg-color);
            color: var(--text-color);
        }
        
        .form-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
        }
        
        .form-buttons button {
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
        }
        
        #cancel-product {
            background-color: transparent;
            border: 1px solid var(--text-color);
            color: var(--text-color);
        }
        
        #submit-product {
            background-color: var(--primary-color);
            color: white;
            border: none;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Inizializza le funzionalità per l'aggiunta di prodotti
function initAddProducts() {
    // Aggiungi gli stili necessari
    addStyles();
    
    // Aggiungi il pulsante per creare nuovi prodotti
    addNewProductButton();
    
    console.log('Sistema di aggiunta prodotti inizializzato');
}

// Inizializza quando il documento è pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aspetta che il file principale abbia terminato di inizializzare
    setTimeout(initAddProducts, 100);
});