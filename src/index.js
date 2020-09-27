import './style.css';
import { getPageContent, intersectionObserver } from './getPageContent';

const grid = document.querySelector('.grid');
const loadMore = document.querySelector('.load-more');

const main = () => {
  const addImageStubsToPage = (numberOfImages = 50) => {
    const images = getPageContent(numberOfImages);

    const pageContent = document.createDocumentFragment();
    images.forEach((image) => {
      pageContent.appendChild(image);
    });

    grid.appendChild(pageContent);

    intersectionObserver();
  };

  addImageStubsToPage();

  loadMore.addEventListener('click', () => {
    addImageStubsToPage(5);
  });
};

main();
