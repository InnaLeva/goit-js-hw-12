import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";

import searchImagesByQuery from './js/pixabay-api.js';
import { showError, createGallary, cleanGallery } from './js/render-function.js';

const form = document.querySelector('.gallery-form');
const input = document.querySelector('.input-gallery');
const loader = document.querySelector('.loading');
const loadMoreBtn = document.querySelector('.load-btn');
// const card = document.querySelector('.gallery-item');
let currentPage = 1;
const resultsPerPage = 15;
let currentQuery = '';



form.addEventListener('submit', async (event) => {
    event.preventDefault();
    currentPage = 1;
    currentQuery = input.value.trim();

    cleanGallery(); //  чистимо галерею
    loadMoreBtn.classList.add('hidden');
    await performSearch()
});


loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    performSearch();
    });


async function performSearch() {
  loader.classList.remove('hidden'); // показуємо індикатор завантаження

    if (currentQuery === '') {
    showError('Please enter a search query.');
    loader.classList.add("hidden");
    return;
    }

    try {
    const data = await searchImagesByQuery(currentQuery, currentPage, resultsPerPage);
    if (data.total === 0) {
        showError('Sorry, there are no images matching your search query. Please try again!');
    } else {
        // console.log(data);
        if (currentPage > 1) {
        const galleryHeightB = document.querySelector('.gallery-list').getBoundingClientRect().height;
        createGallary(data);
        const galleryHeightA = document.querySelector('.gallery-list').getBoundingClientRect().height;
        console.log(document.querySelector('.gallery-list').getBoundingClientRect())
        window.scrollBy({
            top: (galleryHeightA - galleryHeightB)*0.6,
            behavior: 'smooth'
        });
        } else {
            createGallary(data);
        }
        if (data.hits.length < resultsPerPage) { //const images = data.hits дожина галереї
            loadMoreBtn.classList.add('hidden'); // якщо менше результатів, ховаємо кнопку
            return iziToast.info({
                    position: "topRight",
                    message: "We're sorry, but you've reached the end of search results."
                });
        } else {
            if (data.totalHits > ( currentPage * resultsPerPage)) {
                loadMoreBtn.classList.remove('hidden'); // показуємо кнопку "Load more"
                // console.log(currentPage)
            } else {
                // console.log(1)
                    loadMoreBtn.classList.add('hidden'); // показуємо кнопку "Load more"
                    return iziToast.info({
                    position: "topRight",
                    message: "We're sorry, but you've reached the end of search results."
                });
            }
        }
    }
    } catch (error) {
    showError(error.message);
    } finally {
    loader.classList.add("hidden"); // ховаємо індикатор завантаження
        input.value = '';
    }
}