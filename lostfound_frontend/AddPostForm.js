export function AddPostForm() {
  return `
    <div class="card">
      <h3>Add Lost/Found Item</h3>
      
      <input type="text" id="title" placeholder="Title (e.g. Lost Keys)" required />
      
      <textarea id="description" placeholder="Description (Color, location, etc.)"></textarea>
      
      <input type="text" id="phone" placeholder="Phone Number (Required)" required />
      
      <select id="status" style="width:100%; padding:8px; margin-top:6px; border:1px solid #ddd; border-radius:6px;">
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>

      <div style="margin-top:10px;">
        <label class="small-muted">Upload Image (Optional):</label>
        <input type="file" id="image-file" accept="image/*" />
      </div>

      <button id="submit-btn">Submit Post</button>
    </div>
  `;
}