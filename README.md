# Animals Ahoy

This is a simple listing of animal images fetched from a random image generator API.
By default `500` image elements are rendered with `data-api` pointing to random image URL generator API and only image data for elements within viewport are fetched.
It all starts at `main()` in `index.js`

A working demo is available at: <https://glorious-spiders.surge.sh/>

## High Level Strategy

1. Generate `n` img elements with data-src and fill it will dog / cat / fox fetcher API route
2. Add intersection observer to observe all generated image elements
3. On intersection, make API call for intersected element, fill `src` with image / video URL
4. Add a `Load More` button at the bottom and on click of it, perform #1 & #2

## Running Locally

The project is bundled using `parcel`

1. `yarn install`
2. `yarn dev` [this will start project in dev mode on `http://localhost:1234/`]

## Generating Production Build

1. `yarn build` [this will generate a production build of the project and copy built files to `/dist`]

[optional] 2. The static build can be deployed to `surge.sh`, `netlify.com`, `S3 + Cloudfront` etc.
