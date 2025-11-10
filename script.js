// DOM Elements
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const orientationSelect = document.getElementById('orientationSelect');
        const colorSelect = document.getElementById('colorSelect');
        const sortSelect = document.getElementById('sortSelect');
        const imageGrid = document.getElementById('imageGrid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const resultsHeader = document.getElementById('resultsHeader');
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsCount = document.getElementById('resultsCount');
        const emptyState = document.getElementById('emptyState');
        const loading = document.getElementById('loading');
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalInfo = document.getElementById('modalInfo');
        const modalClose = document.getElementById('modalClose');
        const toast = document.getElementById('toast');
        const sortButtons = document.querySelectorAll('.sort-btn');
        const trendingTags = document.querySelectorAll('.trending-tag');

        // API Configuration
        const accessKey = 'Pbh1B2iN-Np8bXsoy84IST4lMcx5olIzJ4DEADy_718';
        let currentPage = 1;
        let currentQuery = '';
        let currentOrientation = '';
        let currentColor = '';
        let currentSort = 'relevant';
        let currentView = 'grid';

        // Event Listeners
        searchForm.addEventListener('submit', handleSearch);
        loadMoreBtn.addEventListener('click', loadMoreImages);
        modalClose.addEventListener('click', closeModal);
        
        // Add event listeners to sort buttons
        sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                sortButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                if (button.dataset.sort === 'grid' || button.dataset.sort === 'masonry') {
                    currentView = button.dataset.sort;
                    updateGridView();
                }
            });
        });
        
        // Add event listeners to trending tags
        trendingTags.forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.dataset.search;
                handleSearch(new Event('submit'));
            });
        });

        // Functions
        function handleSearch(e) {
            e.preventDefault();
            
            const query = searchInput.value.trim();
            if (!query) return;
            
            currentQuery = query;
            currentPage = 1;
            currentOrientation = orientationSelect.value;
            currentColor = colorSelect.value;
            currentSort = sortSelect.value;
            
            // Show loading state
            loading.style.display = 'block';
            emptyState.style.display = 'none';
            imageGrid.innerHTML = '';
            
            // Hide load more button until we know if there are more results
            loadMoreBtn.style.display = 'none';
            
            fetchImages();
        }

        function fetchImages() {
            let apiUrl = `https://api.unsplash.com/search/photos?page=${currentPage}&query=${currentQuery}&client_id=${accessKey}&per_page=20`;
            
            // Add filters if selected
            if (currentOrientation) {
                apiUrl += `&orientation=${currentOrientation}`;
            }
            
            if (currentColor) {
                apiUrl += `&color=${currentColor}`;
            }
            
            if (currentSort) {
                apiUrl += `&order_by=${currentSort}`;
            }
            
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    loading.style.display = 'none';
                    
                    if (currentPage === 1) {
                        imageGrid.innerHTML = '';
                        
                        if (data.results.length === 0) {
                            emptyState.style.display = 'block';
                            resultsHeader.style.display = 'none';
                            return;
                        } else {
                            emptyState.style.display = 'none';
                            resultsHeader.style.display = 'flex';
                            resultsTitle.textContent = `Results for "${currentQuery}"`;
                            resultsCount.textContent = `${data.total} images found`;
                        }
                    }
                    
                    displayImages(data.results);
                    
                    // Show load more button if there are more results
                    if (currentPage < data.total_pages) {
                        loadMoreBtn.style.display = 'inline-flex';
                    } else {
                        loadMoreBtn.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error fetching images:', error);
                    loading.style.display = 'none';
                    showToast('Error loading images. Please try again.');
                });
        }

        function displayImages(images) {
            images.forEach(image => {
                const imageCard = document.createElement('div');
                imageCard.className = 'image-card';
                
                imageCard.innerHTML = `
                    <img src="${image.urls.small}" alt="${image.alt_description || 'Unsplash image'}" data-full="${image.urls.regular}">
                    <div class="image-info">
                        <div class="image-user">
                            <img class="user-avatar" src="${image.user.profile_image.small}" alt="${image.user.name}">
                            <span class="user-name">${image.user.name}</span>
                        </div>
                        <p class="image-desc">${image.description || 'No description available'}</p>
                        <div class="image-actions">
                            <button class="action-btn like-btn">
                                <i class="far fa-heart"></i> ${image.likes}
                            </button>
                            <button class="action-btn download-btn" data-url="${image.links.download}">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                `;
                
                // Add event listener to open modal on image click
                const imgElement = imageCard.querySelector('img');
                imgElement.addEventListener('click', () => openModal(image));
                
                // Add event listener to download button
                const downloadBtn = imageCard.querySelector('.download-btn');
                downloadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    downloadImage(image.links.download);
                });
                
                imageGrid.appendChild(imageCard);
            });
            
            updateGridView();
        }

        function updateGridView() {
            if (currentView === 'masonry') {
                imageGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
                // In a real implementation, you would use a masonry library
                // or implement custom CSS for masonry layout
            } else {
                imageGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
            }
        }

        function loadMoreImages() {
            currentPage++;
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            fetchImages().then(() => {
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More';
            });
        }

        function openModal(image) {
            modalImage.src = image.urls.regular;
            modalImage.alt = image.alt_description || 'Unsplash image';
            
            modalInfo.innerHTML = `
                <div class="image-user">
                    <img class="user-avatar" src="${image.user.profile_image.medium}" alt="${image.user.name}">
                    <span class="user-name">${image.user.name}</span>
                </div>
                <p>${image.description || 'No description available'}</p>
                <div class="image-actions" style="margin-top: 15px;">
                    <button class="action-btn like-btn">
                        <i class="far fa-heart"></i> ${image.likes} likes
                    </button>
                    <button class="action-btn download-btn" data-url="${image.links.download}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
            
            // Add event listener to download button in modal
            const modalDownloadBtn = modalInfo.querySelector('.download-btn');
            modalDownloadBtn.addEventListener('click', () => {
                downloadImage(image.links.download);
            });
            
            imageModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            imageModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function downloadImage(downloadUrl) {
            // In a real implementation, you would handle the download
            // For demo purposes, we'll just show a toast notification
            showToast('Download started!');
            
            // This is a simplified version - in production you'd need to handle
            // the actual download with proper attribution as per Unsplash API terms
            // window.open(downloadUrl + '&force=true'); // This would trigger download
        }

        function showToast(message) {
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Close modal when clicking outside the image
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeModal();
            }
        });

        // Initialize with some popular images
        window.addEventListener('DOMContentLoaded', () => {
            searchInput.value = 'nature';
            handleSearch(new Event('submit'));
        });