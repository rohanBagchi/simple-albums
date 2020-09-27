import { typesOfImages } from './typesOfImages';

const getCurrentImageType = (currentIndex) => {
  let indexOfImageType = 0;
  if (currentIndex % 2 === 0 && currentIndex % 3 === 0) {
    indexOfImageType = 1;
  } else if (currentIndex % 2 === 0) {
    indexOfImageType = 2;
  } else if (currentIndex % 3 === 0) {
    indexOfImageType = 0;
  }

  const currentImageType = typesOfImages[indexOfImageType];

  return currentImageType;
};

export const getPageContent = (numberOfImages) => {
  const images = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numberOfImages; i++) {
    const { url, name, key } = getCurrentImageType(i);

    const div = document.createElement('div');
    div.classList.add('grid-item');
    const img = document.createElement('img');
    img.classList.add('lazy');
    img.setAttribute('data-api', url);
    img.setAttribute('data-name', name);
    img.setAttribute('data-key', key);
    div.appendChild(img);

    images.push(div);
  }

  return images;
};

const getImageURL = async (sourceAPIURL) => {
  const response = await fetch(sourceAPIURL);
  const imageData = response.json();

  return imageData;
};

const removeImage = (imageElement, observer) => {
  if (!imageElement || !observer) return;

  observer.unobserve(imageElement);
  const imageWrapper = imageElement.parentElement;
  imageElement.remove();
  imageWrapper.remove();
};

const allowedExtensions = ['jpg', 'jpeg', 'svg', 'png', 'webp'];

const renderedImages = {};
const isDuplicate = (src) => !!renderedImages[src];
const isNotAllowedImageType = (src) => {
  const fileExtension = src.split('.').pop();
  return !allowedExtensions.includes(fileExtension.toLowerCase());
};

const handleImageAppearInView = (imageElements, observer) => {
  imageElements.forEach(async (imageElementWrapper) => {
    if (imageElementWrapper.isIntersecting) {
      const imageElement = imageElementWrapper.target;

      const { api: src, name, key } = imageElement.dataset;
      try {
        const imageData = await getImageURL(src);
        if (!imageData) {
          removeImage(imageElement, observer);
          return;
        }
        const imageSrc = imageData[key];

        if (!imageSrc) return;

        if (isDuplicate(imageSrc) || isNotAllowedImageType(imageSrc)) {
          removeImage(imageElement, observer);
          return;
        }

        imageElement.src = imageSrc;
        imageElement.alt = name;

        // recording image source for unique check
        renderedImages[imageSrc] = 1;

        imageElement.classList.remove('lazy');

        imageElement.onload = () => {
          imageElement.removeAttribute('data-api');
        };

        imageElement.removeAttribute('data-key');
        imageElement.removeAttribute('data-name');

        observer.unobserve(imageElement);
      } catch (e) {
        console.error(e);
        removeImage(imageElement, observer);
      }
    }
  });
};

export const intersectionObserver = () => {
  if ('IntersectionObserver' in window) {
    const lazyloadImages = document.querySelectorAll('.lazy');
    const imageObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      handleImageAppearInView(entries, observer);
    });

    lazyloadImages.forEach(function (image) {
      imageObserver.observe(image);
    });
  }
};
