import { 
    createBunny, 
    getFamilies, 
    checkAuth, 
    logout 
} from '../fetch-utils.js';

const form = document.querySelector('.bunny-form');
const logoutButton = document.getElementById('logout');

form.addEventListener('submit', async e => {
    // prevent default
    e.preventDefault();
    // get the name and family id from the form
    const data = new FormData(form);

    const bunnyName = data.get('bunny-name');
    const familyId = data.get('family-id');
    // use createBunny to create a bunny with this name and family id
    await createBunny({ name: bunnyName, family_id: familyId });
    
    form.reset();

    window.location.href = '../families';
});

window.addEventListener('load', async () => {
    // let's dynamically fill in the families dropdown from supabase
    // grab the select HTML element from the DOM
    const familySelect = document.querySelector('select');
    // go get the families from supabase
    const families = await getFamilies();
    // for each family
    // create an option tag
    // set the option's value and text content
    // and append the option to the select
    for (let family of families) {
        const optionEl = document.createElement('option');
        optionEl.value = family.id;
        optionEl.textContent = family.name;
        familySelect.append(optionEl);
    }
});


checkAuth();

logoutButton.addEventListener('click', () => {
    logout();
});
