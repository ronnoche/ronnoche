console.log(":wave:\nHi,\nSay hi, @ronnoche!")

fetch('/posts.json')
    .then(response => response.json())
    .then(posts => {
        // Sort posts by date (latest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get the latest 10 posts
        const latestPosts = posts.slice(0, 10);

        // Render the list
        const postList = document.getElementById("post-list");

        if (postList) {
            latestPosts.forEach(post => {
                const article = document.createElement("article");
                article.classList.add("post-item");

                article.innerHTML = `
                    <div class="post-header">
                        <a href="${post.url}" class="post-title">${post.title}</a>
                        <span class="post-date">${new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div class="post-meta-info">
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join("")}
                        </div>
                    </div>
                `;

                postList.appendChild(article);
            });
        }
    })
    .catch(error => console.error('Error fetching posts:', error));
