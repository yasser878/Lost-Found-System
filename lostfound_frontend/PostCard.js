export function PostCard(post) {
  return `
    <div class="card">
      <h3>${post.title}</h3>
      <p class="small-muted">${post.description}</p>
      ${post.image ? `<img class="post-img" src="${post.image}" />` : ''}
    </div>
  `;
}