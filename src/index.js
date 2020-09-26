import './style.css';
import { getPageContent, intersectionObserver } from './getPageContent';

const grid = document.querySelector('.grid');
const loadMore = document.querySelector('.load-more');

const main = () => {
  const addImageStubsToPage = (numberOfImages = 50) => {
    const pageContent = getPageContent(numberOfImages);

    grid.innerHTML += pageContent;

    intersectionObserver();
  };

  addImageStubsToPage();

  loadMore.addEventListener('click', () => {
    addImageStubsToPage(5);
  });
};

main();
