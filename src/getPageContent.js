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
    const image = `
    <div class="grid-item">
      <img data-api="${url}" data-name="${name}" data-key="${key}" class="lazy" />
    </div>
    `;

    images.push(image);
  }

  return images.join('');
};

const getImageURL = async (sourceAPIURL) => {
  const response = await fetch(sourceAPIURL);
  const imageData = response.json();

  return imageData;
};

const allowedExtensions = ['jpg', 'jpeg', 'svg', 'png', 'webp'];

const handleImageAppearInView = (imageElements, observer) => {
  imageElements.forEach(async (imageElementWrapper) => {
    if (imageElementWrapper.isIntersecting) {
      const imageElement = imageElementWrapper.target;

      const { api: src, name, key } = imageElement.dataset;
      try {
        const imageData = await getImageURL(src);
        if (!imageData) {
          return;
        }
        const imageSrc = imageData[key];

        if (!imageSrc) return;

        const fileExtension = imageSrc.split('.').pop();
        if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
          observer.unobserve(imageElement);
          return;
        }
        imageElement.src = imageSrc;
        imageElement.alt = name;
        imageElement.style.height = 'auto';

        // renderedImage[imageSrc] = 1;
        imageElement.classList.remove('lazy');
        imageElement.removeAttribute('data-src');
        imageElement.removeAttribute('data-key');
        imageElement.removeAttribute('data-name');

        observer.unobserve(imageElement);
      } catch (e) {
        console.error(e);
        // removeImage(imageElement, observer);
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
