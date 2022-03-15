import express from 'express';
import fetch from 'node-fetch';

// Express App
const app = express();

// register view engine
app.set('view engine' , 'ejs');

// Serving static files from public folder
app.use(express.static(('public')));

app.use(express.urlencoded({extended:true}));
// Listen for Requests
app.listen(5000);

// Responding to initial page loading request
app.get('/', (req,res) => {
    res.render('index', {
                city: null,
                weather_desc: null,
                icon_desc: null,
                temp: null
    });
});

// Responding to city search request
app.post('/', async (req, res) => {
    const city = req.body.city;
    const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c0fdbbe6c364f22f17ca00da69fd9fda`;

    try {
        await fetch(api_url)
            .then(res => res.json())
            .then(data => {
                if (data.message === "city not found") { 
                    // If city name is not found
                    res.render('index', {
                        city: data.message,
                        weather_desc: null,
                        icon_desc: null,
                        temp: null
                    });
                } else {    // If city data successfully found 
                            // then send data to index.ejs
                    const city = data.name;
                    const weather_desc = data.weather[0].description;
                    const icon_desc = data.weather[0].icon;
                    const temp = data.main.temp;

                    res.render('index' ,{
                        city,
                        weather_desc,
                        icon_desc,
                        temp : (temp-273.15).toFixed(2)
                    })
                }
            })
    
    // if any error occurs
    } catch (error) {
        res.render('index', {
            city: 'ops! some problem',
            weather_desc: null,
            icon_desc: null,
            temp: null
        });
    }
});