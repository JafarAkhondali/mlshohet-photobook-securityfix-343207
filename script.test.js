const { arrayChunk, getImages } = require('./script');

// testing array chunking helper method

const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];

it('should create arrays of chunks of specified items', () => {
	const chunkedArray = arrayChunk(testArray, 4);
	expect(chunkedArray.length).toEqual(3);
});

// test to see if array of images from API contains 20 items

it('should get 20 images from API', () => {
	getImages()
		.then(images => images.json())
		.then(data => {
			expect(images.hits.length).toEqual(20);
		})
});