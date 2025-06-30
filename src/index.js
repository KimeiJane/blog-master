let posts = [];
let currentPostId = null;

function main() {
  loadPosts();
  addNewPostListener();
  addEditFormListener();
}

function loadPosts() {
  fetch('./db.json')
    .then(res => res.json())
    .then(data => {
      posts = data.posts;
      displayPosts();
    })
    .catch(err => {
      console.error("Error loading posts:", err);
      posts = [];
      displayPosts();
    });
}

function displayPosts() {
  const list = document.getElementById("post-list");
  list.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.textContent = post.title;
    div.classList.add("post-title");
    div.addEventListener("click", () => handlePostClick(post.id));
    list.appendChild(div);
  });

  if (posts.length > 0 && !currentPostId) {
    handlePostClick(posts[0].id);
  }

  if (posts.length === 0) {
    document.getElementById("post-detail").innerHTML = "<h2>No posts available</h2>";
  }
}

function handlePostClick(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  
  currentPostId = post.id;
  const detail = document.getElementById("post-detail");
  detail.innerHTML = `
    <h2>${post.title}</h2>
    <p><strong>Author:</strong> ${post.author}</p>
    <img 
      src="${post.image || 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=80'}"
      alt="${post.title}" 
      style="max-width:100%; border-radius:10px; margin:10px 0;"
      onerror="this.src='https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=80';"
    >
    <p>${post.content}</p>
    <button id="edit-btn">Edit</button>
    <button id="delete-btn">Delete</button>
  `;
  document.getElementById("edit-btn").addEventListener("click", () => showEditForm(post));
  document.getElementById("delete-btn").addEventListener("click", handleDelete);
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const newPost = {
      id: Date.now().toString(),
      title: form.title.value.trim(),
      content: form.content.value.trim(),
      author: form.author.value.trim(),
      image: form.image.value.trim()
    };

    posts.push(newPost);
    form.reset();
    displayPosts();
    alert("Post added successfully!");
  });
}

function showEditForm(post) {
  const form = document.getElementById("edit-post-form");
  form.classList.remove("hidden");
  form["edit-title"].value = post.title;
  form["edit-content"].value = post.content;
  form["edit-author"].value = post.author;
  form["edit-image"].value = post.image || "";
}

function addEditFormListener() {
  const form = document.getElementById("edit-post-form");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const postIndex = posts.findIndex(p => p.id === currentPostId);
    if (postIndex !== -1) {
      posts[postIndex] = {
        ...posts[postIndex],
        title: form["edit-title"].value.trim(),
        content: form["edit-content"].value.trim(),
        author: form["edit-author"].value.trim(),
        image: form["edit-image"].value.trim()
      };
    }

    form.classList.add("hidden");
    displayPosts();
    handlePostClick(currentPostId);
  });

  document.getElementById("cancel-edit").addEventListener("click", () => {
    form.classList.add("hidden");
  });
}

function handleDelete() {
  if (!currentPostId) return;
  
  if (confirm("Are you sure you want to delete this post?")) {
    posts = posts.filter(p => p.id !== currentPostId);
    currentPostId = null;
    document.getElementById("post-detail").innerHTML = "<h2>Select a post</h2>";
    displayPosts();
  }
}

document.addEventListener("DOMContentLoaded", main);
