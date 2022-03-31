import { checkAuth, deleteBunny, getFamilies, logout, updateBunnyFamily } from '../fetch-utils.js';

checkAuth();

const familiesEl = document.querySelector('.families-container');
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    logout();
});

async function displayFamilies() {
    // fetch families from supabase
    const families = await getFamilies();

    // clear out the familiesEl
    familiesEl.innerHTML = '';

    for (let family of families) {
        const familyDiv = document.createElement('div');
        const familyNameEl = document.createElement('h3');
        const bunnyContainer = document.createElement('div');

        familyDiv.classList.add('family');
        familyDiv.id = family.id;
        familyNameEl.textContent = family.name;
        bunnyContainer.classList.add('bunnies');
        familyDiv.addEventListener('dragenter', dragEnter);
        familyDiv.addEventListener('dragover', dragOver);
        familyDiv.addEventListener('dragleave', dragLeave);
        familyDiv.addEventListener('drop', drop);

        for (let bunny of family.fuzzy_bunnies) {
            const bunnyDiv = document.createElement('div');
            bunnyDiv.classList.add('bunny');
            bunnyDiv.textContent = bunny.name;
            bunnyDiv.id = bunny.id;
            bunnyDiv.draggable = true;

            bunnyDiv.addEventListener('click', async () => {
                const bunnyId = bunnyDiv.id;

                await deleteBunny(bunnyId);

                displayFamilies();
            });

            bunnyDiv.addEventListener('dragstart', (e) => {
                dragStart(e);
            });

            bunnyContainer.append(bunnyDiv);
        }

        familyDiv.append(familyNameEl, bunnyContainer);

        familiesEl.append(familyDiv);
        // create three elements for each family, one for the whole family, one to hold the name, and one to hold the bunnies
        // your HTML Element should look like this:
        // <div class="family">
        //    <h3>the Garcia family</h3>
        //    <div class="bunnies">
        //        <div class="bunny">Fluffy</div>
        //        <div class="bunny">Bob</div>
        //    </div>
        // </div>
        // add the bunnies css class to the bunnies el, and family css class to the family el
        // put the family name in the name element
        // for each of this family's bunnies
        //    make an element with the css class 'bunny', and put the bunny's name in the text content
        //    add an event listener to the bunny el. On click, delete the bunny, then refetch and redisplay all families.
        // append this bunnyEl to the bunniesEl

        // append the bunniesEl and nameEl to the familyEl

        // append the familyEl to the familiesEl
    }
}

function dragStart(e) {
    // console.log(e);
    e.dataTransfer.setData('text', e.target.id);
}

function dragEnter(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragOver');
}

function dragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragOver');
}

function dragLeave(e) {
    e.currentTarget.classList.remove('dragOver');
}

async function drop(e) {
    e.currentTarget.classList.remove('dragOver');

    const bunnyId = e.dataTransfer.getData('text');

    const bunnyElId = document.getElementById(bunnyId);

    const elementPlace = e.path.length - 7;

    e.path[elementPlace].childNodes[1].append(bunnyElId);

    const familyId = e.path[elementPlace].id;

    await updateBunnyFamily(bunnyId, familyId);
}

window.addEventListener('load', displayFamilies);
