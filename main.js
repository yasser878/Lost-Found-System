import './styles.css';

// --- DATA: The Categories List ---
const CATEGORIES = [
    "Mobiles", 
    "Wallets", 
    "Keys", 
    "Accessories", 
    "Bags", 
    "Makeup", 
    "Notebooks/Books",
    "Other"
];

// --- Components ---

// 1. Search Bar with Category Filter
const SearchBar = () => `
  <div class="card" style="padding: 20px; display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
    <input type="text" id="search-input" placeholder="Search..." style="margin:0; flex:2; min-width:200px;" />
    
    <select id="filter-category" style="margin:0; flex:1; min-width:140px;">
        <option value="">All Categories</option>
        ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
    </select>

    <select id="filter-status" style="margin:0; flex:1; min-width:140px;">
        <option value="">All Status</option>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
    </select>
    
    <button id="btn-search" style="width:auto; padding:12px 24px;">Search</button>
  </div>
`;

// 2. Add/Edit Form with Category Dropdown
const FormComponent = () => `
    <div class="card">
      <h3>Add Lost/Found Item</h3>
      
      <input type="text" id="title" placeholder="Title (e.g. iPhone 14 Pro)" />
      
      <label style="font-size:0.9rem; color:var(--text-muted);">Category</label>
      <select id="category">
        <option value="" disabled selected>Select Category</option>
        ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>

      <textarea id="description" placeholder="Description (Color, location, distinctive marks...)"></textarea>
      
      <input type="text" id="phone" placeholder="Contact Phone Number" />
      
      <label style="font-size:0.9rem; color:var(--text-muted);">Status</label>
      <select id="status">
        <option value="lost">I Lost this</option>
        <option value="found">I Found this</option>
      </select>

      <label style="font-size:0.9rem; color:var(--text-muted); display:block; margin-top:10px;">Upload Image</label>
      <input type="file" id="image-file" accept="image/*" />

      <button id="submit-btn" style="margin-top:20px;">Submit Post</button>
    </div>
`;

// 3. Auth Forms
const LoginForm = () => `<div class="card" style="max-width:400px; margin:80px auto;"><h2 style="text-align:center">Login</h2><input type="text" id="idf" placeholder="Username/Email"><input type="password" id="pass" placeholder="Password"><button id="btn-login">Sign In</button><div class="auth-link"><span id="go-signup">Sign Up</span></div></div>`;
const SignupForm = () => `<div class="card" style="max-width:400px; margin:80px auto;"><h2 style="text-align:center">Sign Up</h2><input type="text" id="u" placeholder="Username"><input type="text" id="e" placeholder="Email"><input type="password" id="p" placeholder="Password"><button id="btn-signup">Register</button><div class="auth-link"><span id="go-login">Login</span></div></div>`;

// 4. About Page (CS Students Version)
const AboutPage = () => `
  <div class="card" style="padding: 30px; line-height: 1.6;">
    <h2 style="text-align:center; margin-bottom: 20px; color: var(--primary);">About Us</h2>
    
    <p style="font-size: 1.1rem; margin-bottom: 15px;">
       We are a team of <strong>Computer Science students</strong> passionate about building practical software solutions.
    </p>
    
    <h3 style="margin-top: 20px; font-size: 1.2rem;">What is this Project?</h3>
    <p style="color: var(--text-muted);">
       This <strong>Lost & Found</strong> application is designed to help the community reunite with their belongings. 
       Whether you have lost a valuable item or found something that doesn't belong to you, you can post it here.
    </p>
    
    <ul style="margin-top: 10px; color: var(--text-muted); list-style-position: inside;">
       <li>📸 <strong>Upload Images:</strong> Add photos to identify items easily.</li>
       <li>🔍 <strong>Smart Search:</strong> Filter by category (Mobiles, Wallets, etc.) and status.</li>
       <li>📞 <strong>Connect:</strong> Get direct contact info to return items.</li>
    </ul>
  </div>
`;

// --- State ---
const container = document.querySelector('.container');
const nav = document.querySelector('.nav');
let currentPage = 1;
let currentSearch = "";
let currentFilterStatus = "";
let currentFilterCategory = "";

// --- Helpers ---
const getToken = () => localStorage.getItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

function updateNav() {
  if (getToken()) {
    nav.innerHTML = `<div class="nav-brand">Lost & Found</div><div class="nav-links"><a id="link-home">Home</a><a id="link-add">Add Post</a><a id="link-about">About</a><a id="link-logout" style="color:#ef4444;">Logout</a></div>`;
    setTimeout(() => {
        document.getElementById('link-home').onclick = () => { resetFilters(); renderHome(); };
        document.getElementById('link-add').onclick = renderAddPost;
        document.getElementById('link-about').onclick = () => container.innerHTML = AboutPage();
        document.getElementById('link-logout').onclick = () => { localStorage.clear(); renderLogin(); };
    }, 0);
  } else { nav.innerHTML = `<div class="nav-brand">Lost & Found</div>`; }
}
function resetFilters() { currentPage = 1; currentSearch = ""; currentFilterStatus = ""; currentFilterCategory = ""; }

// --- Main Views ---
function renderLogin() {
    updateNav(); container.innerHTML = LoginForm();
    document.getElementById('btn-login').onclick = async () => {
        try {
            const res = await fetch('http://localhost:5000/auth/login', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({identifier:document.getElementById('idf').value, password:document.getElementById('pass').value})
            });
            const data = await res.json();
            if(res.ok){ localStorage.setItem('token', data.access_token); localStorage.setItem('user', JSON.stringify(data.user)); resetFilters(); renderHome(); }
            else alert(data.msg);
        } catch(e) { alert("Server Error"); }
    };
    document.getElementById('go-signup').onclick = renderSignup;
}
function renderSignup() {
    container.innerHTML = SignupForm();
    document.getElementById('btn-signup').onclick = async () => {
        const res = await fetch('http://localhost:5000/auth/signup', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({username:document.getElementById('u').value, email:document.getElementById('e').value, password:document.getElementById('p').value})
        });
        if(res.ok) { alert("Created!"); renderLogin(); } else alert("Error");
    };
    document.getElementById('go-login').onclick = renderLogin;
}

function renderHome() {
  updateNav();
  const token = getToken();
  const currentUser = getUser();

  const query = `?page=${currentPage}&q=${currentSearch}&status=${currentFilterStatus}&category=${currentFilterCategory}`;
  
  fetch(`http://localhost:5000/posts/${query}`, { headers: { 'Authorization': `Bearer ${token}` } })
  .then(res => res.json())
  .then(data => {
    let html = SearchBar();
    const posts = data.posts || [];

    if(posts.length === 0) html += '<div class="card"><p style="text-align:center; color:#fff;">No posts found.</p></div>';
    else {
        html += posts.map(post => {
          const isOwner = currentUser.username === post.reporter; 
          const isAdmin = currentUser.is_admin; 
          
          // Show buttons ONLY if owner or admin
          const actionButtons = (isOwner || isAdmin) ? `
             <div style="display:flex; gap:10px;">
                <button class="btn-edit secondary" data-id="${post.id}" style="padding:4px 10px; font-size:0.8rem;">Edit</button>
                <button class="btn-delete" data-id="${post.id}" style="padding:4px 10px; font-size:0.8rem; background:rgba(239,68,68,0.2); color:#fca5a5; border:1px solid #ef4444;">Delete</button>
             </div>
          ` : '';

          return `
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <h3 style="margin-bottom:5px;">${post.title}</h3>
                    <span style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px; font-size:0.75rem; color:#cbd5e1;">
                        📂 ${post.category || 'Other'}
                    </span>
                </div>
                ${actionButtons}
              </div>
              <div style="margin:12px 0;">
                 <span style="background:${post.status === 'lost' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}; 
                              color:${post.status === 'lost' ? '#fca5a5' : '#6ee7b7'}; 
                              padding:4px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold; text-transform:uppercase;">
                    ${post.status}
                 </span>
                 <span style="color:var(--text-muted); font-size:0.85rem; margin-left:10px;">${new Date(post.date).toLocaleDateString()}</span>
              </div>
              <p style="color:var(--text-muted);">${post.description}</p>
              <p style="color:white; margin-top:8px;"><strong>📞 Contact:</strong> ${post.phone}</p>
              ${post.image ? `<img class="post-img" src="${post.image}" />` : ''}
              <div style="font-size:0.8rem; color:rgba(255,255,255,0.3); margin-top:15px; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">Posted by ${post.reporter}</div>
            </div>
          `;
        }).join('');
        
        // Pagination
        html += `<div style="display:flex; justify-content:center; gap:10px; margin:40px 0;">
            <button id="btn-prev" class="secondary" style="width:100px;" ${data.has_prev?'':'disabled'}>Previous</button>
            <span style="align-self:center; color:var(--text-muted);">Page ${data.current_page}</span>
            <button id="btn-next" class="secondary" style="width:100px;" ${data.has_next?'':'disabled'}>Next</button>
        </div>`;
    }
    
    container.innerHTML = html;

    // Attach Events
    document.getElementById('search-input').value = currentSearch;
    document.getElementById('filter-status').value = currentFilterStatus;
    document.getElementById('filter-category').value = currentFilterCategory;

    document.getElementById('btn-search').onclick = () => {
        currentSearch = document.getElementById('search-input').value;
        currentFilterStatus = document.getElementById('filter-status').value;
        currentFilterCategory = document.getElementById('filter-category').value;
        currentPage = 1; 
        renderHome();
    };

    if(document.getElementById('btn-prev')) {
        document.getElementById('btn-prev').onclick = () => { currentPage--; renderHome(); window.scrollTo(0,0); };
        document.getElementById('btn-next').onclick = () => { currentPage++; renderHome(); window.scrollTo(0,0); };
    }
    
    // Edit Click
    document.querySelectorAll('.btn-edit').forEach(btn => btn.onclick = (e) => {
        const post = posts.find(p => p.id == e.target.dataset.id); renderEditForm(post);
    });

    // Delete Click
    document.querySelectorAll('.btn-delete').forEach(btn => btn.onclick = async (e) => {
        if(!confirm("Are you sure you want to delete this item?")) return;
        const id = e.target.dataset.id;
        try {
            const res = await fetch(`http://localhost:5000/posts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if(res.ok) { alert("Item deleted."); renderHome(); }
            else { alert("Error: " + data.msg); }
        } catch(err) { alert("Could not delete item."); }
    });

  }).catch(console.error);
}

function renderAddPost() {
  container.innerHTML = FormComponent();
  document.getElementById('submit-btn').onclick = () => handlePostSubmit();
}
function renderEditForm(post) {
  container.innerHTML = FormComponent(); 
  document.querySelector('h3').innerText = "Edit Item"; 
  document.getElementById('title').value = post.title;
  document.getElementById('description').value = post.description;
  document.getElementById('phone').value = post.phone;
  document.getElementById('status').value = post.status;
  document.getElementById('category').value = post.category || ""; 
  
  document.getElementById('submit-btn').innerText = "Update Post";
  document.getElementById('submit-btn').onclick = () => handlePostSubmit(post.id);
}

function handlePostSubmit(editId = null) {
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('phone_number', document.getElementById('phone').value);
    formData.append('status', document.getElementById('status').value);
    formData.append('category', document.getElementById('category').value); 
    
    const file = document.getElementById('image-file').files[0];
    if (file) formData.append('image', file);

    const url = editId ? `http://localhost:5000/posts/${editId}` : 'http://localhost:5000/posts/';
    const method = editId ? 'PUT' : 'POST';
    const btn = document.getElementById('submit-btn'); btn.innerText = "Saving..."; btn.disabled = true;

    fetch(url, { method: method, headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData })
    .then(res => res.json()).then(data => {
      if (data.msg === 'created' || data.msg === 'updated') renderHome();
      else { alert("Error: " + data.msg); btn.disabled = false; btn.innerText = "Submit"; }
    });
}

if (getToken()) renderHome(); else renderLogin();