// modal elements, modal's backdrop and the close button defined here
const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.modal button');
const modalImage = document.querySelector('.content-container img');

// Modal functions

function showModal(imagePath) {
	backdrop.classList.add('open');
	modal.style.display = "block"
	setTimeout(function() {
		modal.classList.add('open');
	}, 300);
	modalImage.src = imagePath;
}

function hideModal() {
	backdrop.classList.remove('open');
	modal.classList.remove('open');
	setTimeout(function() {
		modal.style.display = "none"
	}, 300);
}

closeButton.addEventListener('click', hideModal);
backdrop.addEventListener('click', hideModal);

// Image fetching from Pixabay API
const url = 'https://pixabay.com/api/?key=21717078-54833fbdfe068d399e345200f&q=yellow+flowers&image_type=photo';

const getImages = async () => {
	let data;

	try {
		const response = await fetch(url);
		data = await response.json();

		if (!response.ok) {
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		throw new Error('Error getting images');
		return;
	}
	
	return data;
}

// Helper functions for creating and appending DOM elements

function append(parent, el) {
	return parent.appendChild(el);
}

function createNode(element) {
	return document.createElement(element);
}

// function takes an array of images from the API
// and creates and returns an unnumbered list of images

const createdImagePage = (imageArr) => {
	let ul = createNode('ul');
	imageArr.map(image => {
		let li = createNode('li');
		let img = createNode('img');
		img.src = image.previewURL;
		append(li, img);
		append(ul, li);
		li.addEventListener('click', () => showModal(image.largeImageURL));
	});
	return ul;
}

// Array chunking helper

const arrayChunk = (arr, chunkLen) => {
	const chunks = [];
	let i = 0;
	const n = arr.length;

	while (i < n) {
		chunks.push(arr.slice(i, i += chunkLen));
	}

	return chunks;
}

// The major function that assembles the page

async function createImagePages() {
	
	// The images are fetched from the API

	let imgData;
	try {
		imgData = await getImages();
	} catch(err) {
		throw new Error("Somethign went wrong.");
	}
	
	const imageArr = imgData.hits;

	// The image array gets chunked into segments of 10

	const imageChunks = arrayChunk(imageArr, 10);

	// Here all arrays get converted into unordered lists
	// All lists get assigned ids
	// The first page of images is not hidden
	// The paragraph link element is created and appended to the bottom of each ul

	let pageNumber = 1;
	const div = document.getElementById('images');

	imageChunks.map((imageArray, i) => {
		const ul = createdImagePage(imageArray);
		ul.id = pageNumber;
		if (ul.id !== "1") {
			ul.classList.add('hidden');
		}
		pageNumber = pageNumber + 1;
		const pageLabel = createNode('p');
		append(ul, pageLabel);
		append(div, ul);
		if (imageChunks[i+1]) {
			pageLabel.textContent = "Next Page";
			pageLabel.classList.add('page-label');
		} else {
			pageLabel.textContent = "Last Page";
			pageLabel.classList.add('page-label');
		}
	});

	// This section gets the previous and the next pages by id
	// and assigns a click event listener to the bottom link
	// then it toggles the hidden class accordingly

	const imagePages = document.querySelectorAll('ul');
	const imageArrays = Array.from(imagePages);

	imageArrays.map(imageArray => {
		const nextId = +imageArray.id + 1;
		const lastId = +imageArray.id - 1;

		imageArray.lastChild.addEventListener('click', () => {
			const nextPage = document.getElementById(nextId);
			const lastPage = document.getElementById(lastId);
			if (nextPage) {
				imageArray.classList.add('hidden');
				nextPage.classList.remove('hidden');
			} else if (lastPage) {
				imageArray.classList.add('hidden');
				lastPage.classList.remove('hidden');
			} else {
				return;
			}
		})
	})
}

createImagePages();

exports.arrayChunk = arrayChunk;
exports.getImages = getImages;




