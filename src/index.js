//1
// form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');


// results divs
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');


//6
//call the API
import axios from '../node_modules/axios';

async function displayCarbonUsage(apiKey, region)
{
    try{
        await axios 
        .get('https://api.co2signal.com/v1/latest', {
            params: {
                countryCode:region,
            },
            headers:{
                'auth-token':apiKey,
            },
        })
        .then((response) =>
        {
            let CO2 = Math.floor(response.data.data.carbonIntensity);

            loading.style.display = 'none';
            form.style.display = 'none';
            myregion.textContent = region;
            usage.textContent = Math.round(response.data.data.carbonIntensity) + 'grams(grams CO2 emitted per kilowatt hour)';

            fossilfuel.textContent = response.data.data.fossilFuelPercentage.toFixed(2) + '% (percentage of fossil fuels used to generate electricity)';
            results.style.display = 'block';
        });
    }catch(error)
    {
        console.log(error);
        loading.style.display = 'none';
        results.style.display = 'none';
        error.textContent = 'Sorry, we have no data for the region you have requested';
    }
}

//5
//set up user's api key and region
function setUpUser(apiKey, regionName)
{
    localStorage.setItem('apiKey',apiKey);
    localStorage.setItem('regionName',regionName);
    loading.style.display = 'block'; //sets loading message to the user while the API is called
    clearBtn.style.display = 'block';

    displayCarbonUsage(apiKey,regionName);
}

//4
// handle form submission
function handleSubmit(e)
{
    e.preventDefault(); // to stop the browser from refreshing
    setUpUser(apiKey.nodeValue,region.value);
}

//3 initial checks
function init()
{
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');

    if(storedApiKey==null || storedRegion==null)
    {
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display ='none';
        errors.textContent = '';
    }
    else{
        displayCarbonUsage(storedApiKey,storedRegion);
        results.style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    }
};


//2
// set listeners and start app
form.addEventListener('submit',(e) => handleSubmit(e));
clearBtn.addEventListener('click',(e)=>reset(e));
init();


function reset(e)
{
    e.preventDefault();

    localStorage.removeItem('regionName');
    init();
}
