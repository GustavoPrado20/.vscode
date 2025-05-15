// Caminho do banco de dados no localStorage
const DATABASE_KEY = 'sqlite_db';

// Função para salvar o banco no localStorage
function saveDatabase(db) {
    const binaryArray = db.export();
    const base64String = btoa(String.fromCharCode(...new Uint8Array(binaryArray)));
    localStorage.setItem(DATABASE_KEY, base64String);
}

// Função para carregar o banco do localStorage
async function loadDatabase(SQL) {
    const base64String = localStorage.getItem(DATABASE_KEY);
    if (base64String) {
        const binaryArray = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
        return new SQL.Database(binaryArray);
    } else {
        return new SQL.Database();
    }
}

// Função para inicializar o banco de dados
async function initDatabase() {
    const SQL = await initSqlJs({ locateFile: file => '/database/sql-wasm.wasm' });
    const db = await loadDatabase(SQL);

    // Cria a tabela de usuários se não existir
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            user_type TEXT NOT NULL
        );
    `);

     // Verifica se o usuário 'admin' já existe
    const stmt = db.prepare("SELECT COUNT(*) AS count FROM users WHERE email = ?");
    stmt.bind(['admin@admin.com']);
    stmt.step();
    const { count } = stmt.getAsObject();
    stmt.free();

    // Se o usuário admin não existir, cria o usuário padrão
    if (count === 0) {
        try {
            db.run(
                "INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)",
                ['admin', 'admin@admin.com', '123456', 'admin']
            );
            console.log('Usuário admin criado com sucesso.');
        } catch (err) {
            console.error('Erro ao criar usuário admin:', err.message);
        }
    }

    saveDatabase(db);
    return db;
}

// Função para registrar um usuário
async function registerUser(username, email, password, user_type) {
    const db = await initDatabase();

    try {
        db.run("INSERT INTO users (username, email ,password, user_type) VALUES (?, ?, ?, ?)", [username, email, password, user_type]);
        saveDatabase(db);
        localStorage.setItem('loggedInUser', email);
        alert('Usuário registrado com sucesso!');
        window.location.href = 'index.html';
    } catch (err) {
        alert('Erro ao registrar: ' + err.message);
    }
}

// Função para realizar login
async function loginUser(email, password) {
    const db = await initDatabase();
    const stmt = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?");
    stmt.bind([email, password]);   

    if (stmt.step()) {
        const user = stmt.getAsObject();
        localStorage.setItem('loggedInUser', user.email)
        localStorage.setItem('userType', user.user_type);;
        alert('Login bem-sucedido!');
        window.location.href = 'index.html';
    } else {
        alert('Usuário ou senha incorretos.');
    }

    stmt.free();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const user_type = document.getElementById('user_type').value.trim();
            registerUser(username, email, password, user_type);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            loginUser(email, password);
        });
    }
});