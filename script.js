console.log(":wave:\nSay hi, @ronnoche!")

// Global state
let currentPage = 1;
const postsPerPage = 20;
let allPosts = [];
let filteredPosts = [];
let selectedTags = new Set();

// Function to render posts for the current page
function renderPosts() {
    const postList = document.getElementById("post-list");
    if (!postList) return;

    // Clear existing posts
    postList.innerHTML = '';

    // Calculate pagination
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    // Render posts
    postsToShow.forEach(post => {
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

    // Update pagination info
    updatePaginationInfo();
}

// Function to update pagination controls
function updatePaginationInfo() {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;

    // Enable/disable pagination buttons
    document.getElementById('prev-page').style.display = currentPage === 1 ? 'none' : 'inline-block';
    document.getElementById('next-page').style.display = currentPage === totalPages ? 'none' : 'inline-block';
}

// Function to render tag filters
function renderTagFilters(posts) {
    const tagFiltersContainer = document.getElementById('tag-filters');
    if (!tagFiltersContainer) return;

    // Get unique tags
    const uniqueTags = new Set();
    posts.forEach(post => post.tags.forEach(tag => uniqueTags.add(tag)));

    // Clear existing filters
    tagFiltersContainer.innerHTML = '';

    // Create "All" filter
    const allFilter = document.createElement('button');
    allFilter.textContent = 'All';
    allFilter.classList.add('tag-filter');
    allFilter.classList.add('active');
    allFilter.addEventListener('click', () => {
        selectedTags.clear();
        updateActiveFilters();
        filterPosts();
    });
    tagFiltersContainer.appendChild(allFilter);

    // Create filter for each tag
    uniqueTags.forEach(tag => {
        const button = document.createElement('button');
        button.textContent = tag;
        button.classList.add('tag-filter');
        button.addEventListener('click', () => {
            selectedTags.clear();
            selectedTags.add(tag);
            updateActiveFilters();
            filterPosts();
        });
        tagFiltersContainer.appendChild(button);
    });
}

// Function to update active filter styles
function updateActiveFilters() {
    const filters = document.querySelectorAll('.tag-filter');
    filters.forEach(filter => {
        if (filter.textContent === 'All') {
            filter.classList.toggle('active', selectedTags.size === 0);
        } else {
            filter.classList.toggle('active', selectedTags.has(filter.textContent));
        }
    });
}

// Function to filter posts based on selected tags
function filterPosts() {
    if (selectedTags.size === 0) {
        filteredPosts = [...allPosts];
    } else {
        filteredPosts = allPosts.filter(post =>
            post.tags.some(tag => selectedTags.has(tag))
        );
    }
    
    currentPage = 1; // Reset to first page when filtering
    renderPosts();
}

// Initialize
fetch('/posts.json')
    .then(response => response.json())
    .then(posts => {
        // Sort posts by date (latest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        allPosts = posts;
        filteredPosts = [...posts];

        // Render initial state
        renderTagFilters(posts);
        renderPosts();

        // Add pagination event listeners
        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPosts();
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderPosts();
            }
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
