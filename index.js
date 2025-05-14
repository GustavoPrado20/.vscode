import { foodItem } from './fooditem.js';

let cartData = []; // Inicialize cartData aqui, se não estiver em outro lugar

function displayItems() {
    var Frutas = document.getElementById('Frutas');
    var Verduras = document.getElementById('Verduras');;
    var Legumes = document.getElementById('Legumes');
    var Grãos = document.getElementById('Grãos');
    var Temperos = document.getElementById('Temperos');
    var Artesanatos = document.getElementById('Artesanatos');
    var Derivados = document.getElementById('Derivados');

    const FrutasData = foodItem.filter((item) => item.category == 'Frutas');
    const VerdurasData = foodItem.filter((item) => item.category == 'Verduras');
    const LegumesData = foodItem.filter((item) => item.category == 'Legumes');
    const GrãosData = foodItem.filter((item) => item.category == 'Grãos');
    const TemperosData = foodItem.filter((item) => item.category == 'Temperos');
    const ArtesanatosData = foodItem.filter((item) => item.category == 'Artesanatos');
    const DerivadosData = foodItem.filter((item) => item.category == 'Derivados');

    FrutasData.forEach(item => {
        const itemCard = createItemCard(item);
        Frutas.appendChild(itemCard);
    });

    VerdurasData.forEach(item => {
        const itemCard = createItemCard(item);
        Verduras.appendChild(itemCard);
    });

    LegumesData.forEach(item => {
        const itemCard = createItemCard(item);
        Legumes.appendChild(itemCard);
    })
    GrãosData.forEach(item => {
        const itemCard = createItemCard(item);
        Grãos.appendChild(itemCard);
    });

    TemperosData.forEach(item => {
        const itemCard = createItemCard(item);
        Temperos.appendChild(itemCard);
    });

    ArtesanatosData.forEach(item => {
        const itemCard = createItemCard(item);
        Artesanatos.appendChild(itemCard);
    });

    DerivadosData.forEach(item => {
        const itemCard = createItemCard(item);
        Derivados.appendChild(itemCard);
    });
}

function createItemCard(item) {
    var itemCard = document.createElement('div');
    itemCard.setAttribute('id', 'item-card');
 
    var cardTop = document.createElement('div');
    cardTop.setAttribute('id', 'card-top');

    var star = document.createElement('i');
    star.setAttribute('class', 'fa fa-star');
    star.setAttribute('id', 'rating');
    star.innerText = ' ' + item.rating;

    cardTop.appendChild(star);
    itemCard.appendChild(cardTop);

    var img = document.createElement('img');
    img.src = item.img;
    img.style.cursor = 'pointer';
    
    img.addEventListener('click', function(e) {
        e.stopPropagation();
        const produtoLinks = linksPagamento[item.id];
        if (produtoLinks && produtoLinks.pagseguro) {
            window.location.href = produtoLinks.pagseguro;
        }
    });
    img.addEventListener('click', function(e) {
        e.stopPropagation();
        if (item.link_mercadopago) {
            window.location.href = item.link_mercadopago;
        } else {
            alert('Link mercadopago não disponível para este produto.');
        }
    });

    

    var itemName = document.createElement('p');
    itemName.setAttribute('id', 'item-name');
    itemName.innerText = item.name;
    itemName.style.cursor = 'pointer';
    itemName.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = "";
    });

    var itemPrice = document.createElement('p');
    itemPrice.setAttribute('id', 'item-price');
    itemPrice.innerText = 'Preço : R$ ' + item.price;

    var itemUnit = document.createElement('p');
    itemUnit.setAttribute('id', 'item-unit');
    itemUnit.innerText = 'Por: ' + item.unit;

    itemCard.appendChild(img);
    itemCard.appendChild(itemName);
    itemCard.appendChild(itemPrice);
    itemCard.appendChild(itemUnit);

    return itemCard;
}



// Atualizando o evento de clique nos produtos
function configurarEventosDeCliqueNosProdutos() {
    const produtos = document.querySelectorAll('#item-card img, #item-card #item-name');

    produtos.forEach(produto => {
        produto.addEventListener('click', function () {
            const idProduto = parseInt(this.closest('#item-card').querySelector('#card-top').getAttribute('id'));
            const item = foodItem.find(produto => produto.id === idProduto);

            if (item) {
                adicionarProdutoAoCarrinho(item);
                alert(`${item.name} foi adicionado ao carrinho!`);
            } else {
                console.error('Produto não encontrado!');
            }
        });
    });
}

// Chamando a função após exibir os itens
displayItems();
configurarEventosDeCliqueNosProdutos();

const vegData = [...new Map(foodItem.map(item => [item['category'], item])).values()];
console.log(vegData);

function selectTaste() {
    var categoryList = document.getElementById('category-list');

    vegData.map(item => {
        console.log(item)
        var listCard = document.createElement('div');
        listCard.setAttribute('class', 'list-card');

        var listImg = document.createElement('img');
        listImg.src = item.img;

        var listName = document.createElement('a');
        listName.setAttribute('class', 'list-name');
        listName.innerText = item.category;
        listName.setAttribute('href', '#' + item.category)

        listCard.appendChild(listImg);
        listCard.appendChild(listName);

        var cloneListCard = listCard.cloneNode(true);
        categoryList.appendChild(listCard);
        document.querySelector('.category-header').appendChild(cloneListCard)
    })
}
selectTaste();

function addEvents() {
    const hearts = document.querySelectorAll('.add-to-cart');
    console.log("Dentro de addEvents: Encontrei " + hearts.length + " corações para adicionar listeners.");
    hearts.forEach(heart => {
        console.log("Adicionando listener ao coração:", heart);
        heart.addEventListener('click', addToCart);
    });

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    } else {
        console.log("Formulário de pesquisa não encontrado!");
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInputChange); // Ouça a cada mudança no input
    } else {
        console.log("Input de pesquisa não encontrado!");
    }
}
addEvents(); // Chamada inicial após a primeira renderização dos itens

// Cache de resultados para pesquisa mais rápida
let searchCache = new Map();

function handleSearchInputChange(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    // Se o termo for muito curto, limpa os resultados
    if (searchTerm.length < 1) {
        clearSearchResults();
        return;
    }

    // Verifica se já temos resultados em cache
    if (searchCache.has(searchTerm)) {
        displayResults(searchCache.get(searchTerm));
        return;
    }

    // Busca os resultados
    const results = performSearch(searchTerm);
    
    // Armazena no cache
    searchCache.set(searchTerm, results);
    
    // Exibe os resultados
    displayResults(results);
}

function performSearch(term) {
    return foodItem.filter(item => {
        // Verifica correspondência exata no início do nome
        const exactStartMatch = item.name.toLowerCase().startsWith(term);
        
        // Verifica se o termo está contido no nome
        const containsMatch = item.name.toLowerCase().includes(term);
        
        // Verifica correspondência exata no início da categoria
        const categoryStartMatch = item.category.toLowerCase().startsWith(term);
        
        // Verifica se o termo está contido na categoria
        const categoryContainsMatch = item.category.toLowerCase().includes(term);

        // Retorna true se qualquer uma das condições for atendida
        return exactStartMatch || containsMatch || categoryStartMatch || categoryContainsMatch;
    }).sort((a, b) => {
        // Ordena os resultados por relevância
        const aStartsWith = a.name.toLowerCase().startsWith(term);
        const bStartsWith = b.name.toLowerCase().startsWith(term);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Se ambos começam com o termo, ordena por tamanho do nome
        if (aStartsWith && bStartsWith) {
            return a.name.length - b.name.length;
        }
        
        // Se nenhum começa com o termo, mantém a ordem original
        return 0;
    });
}

function displayResults(results) {
    // Limpa resultados anteriores
    clearSearchResults();

    if (results.length === 0) {
        showNoResults();
        return;
    }

    // Exibe os resultados diretamente, sem agrupar por categoria
    const foodItems = document.getElementById('food-items');
    if (foodItems) {
        // Cria uma nova div para os resultados
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        
        // Adiciona um título para os resultados
        const title = document.createElement('p');
        title.className = 'search-results-title';
        title.textContent = `Resultados para "${document.getElementById('search-input').value}"`;
        resultsDiv.appendChild(title);
        
        // Adiciona os cards dos produtos
        results.forEach(item => {
            const itemCard = createItemCard(item);
            resultsDiv.appendChild(itemCard);
        });
        
        // Limpa e adiciona os resultados
        foodItems.innerHTML = '';
        foodItems.appendChild(resultsDiv);
    }

    // Adiciona eventos aos novos cards
    addEvents();
}

function clearSearchResults() {
    const foodItems = document.getElementById('food-items');
    if (foodItems) {
        foodItems.innerHTML = `
            <div id="Frutas" class="d-Frutas">
                <p id="category-name">Frutas</p>    
            </div>
            <div id="Verduras" class="d-Verduras">
                <p id="category-name">Verduras</p>    
            </div>
            <div id="Legumes" class="d-Legumes">
                <p id="category-name">Legumes</p>
            </div>
            <div id="Grãos" class="d-Grãos">
                <p id="category-name">Grãos</p> 
            </div>
            <div id="Temperos" class="d-Temperos">
                <p id="category-name">Temperos</p> 
            </div>
            <div id="Artesanatos" class="d-Artesanatos">
                <p id="category-name">Artesanatos</p>
            </div>
            <div id="Derivados" class="d-Derivados">
                <p id="category-name">Derivados</p>
            </div>
        `;
    }
}

function showNoResults() {
    const foodItems = document.getElementById('food-items');
    if (foodItems) {
        foodItems.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="font-size: 18px; color: #666;">Nenhum resultado encontrado</p>
                <p style="font-size: 14px; color: #999;">Tente usar termos diferentes</p>
            </div>
        `;
    }
}

// Limpa o cache periodicamente para evitar uso excessivo de memória
setInterval(() => {
    searchCache.clear();
}, 300000); // Limpa a cada 5 minutos

function handleSearch(event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    console.log("Termo de pesquisa:", searchTerm);
    filterAndDisplay(searchTerm);
}

function filterAndDisplay(searchTerm) {
    const filteredItems = foodItem.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );

    // Limpar a exibição atual
    document.getElementById('Frutas').innerHTML = '<p id="category-name">Frutas</p>';
    document.getElementById('Verduras').innerHTML = '<p id="category-name">Verduras</p>';
    document.getElementById('Legumes').innerHTML = '<p id="category-name">Legumes</p>';
    document.getElementById('Grãos').innerHTML = '<p id="category-name">Grãos</p>';
    document.getElementById('Temperos').innerHTML = '<p id="category-name">Temperos</p>';
    document.getElementById('Artesanatos').innerHTML = '<p id="category-name">Artesanatos</p>';
    document.getElementById('Derivados').innerHTML = '<p id="category-name">Derivados</p>';

    // Exibir os itens filtrados nas suas respectivas categorias
    filteredItems.forEach(item => {
        const itemCard = createItemCard(item);
        const categoryDivId = item.category;
        const categoryDiv = document.getElementById(categoryDivId);
        if (categoryDiv) {
            categoryDiv.appendChild(itemCard);
        }
    });
}