
function Sound(source, volume, loop)
{
    this.source = source;
    this.volume = volume;
    this.loop = loop;
    var son;
    this.son = son;
    this.finish = false;
    this.stop = function()
    {
        document.body.removeChild(this.son);
    }
    this.start = function()
    {
        if (this.finish) return false;
        this.son = document.createElement("embed");
        this.son.setAttribute("src", this.source);
        this.son.setAttribute("hidden", "true");
        this.son.setAttribute("volume", this.volume);
        this.son.setAttribute("autostart", "true");
        this.son.setAttribute("loop", this.loop);
        document.body.appendChild(this.son);
    }
    this.remove = function()
    {
        document.body.removeChild(this.son);
        this.finish = true;
    }
    this.init = function(volume, loop)
    {
        this.finish = false;
        this.volume = volume;
        this.loop = loop;
    }
    this.new_sound = function(sound)
    {
        this.source = sound;
    }
}

function random_num(max)
{
    return Math.floor(Math.random()*(max))

}
function select_sound()
{
    const sounds = 2
    var rnd_snd = "./res/snd/" + random_num(sounds) + ".mp3";
    return rnd_snd;
}

function SoundController()
{
    this.snd = new Sound("./res/snd/0.mp3",100,false)
    this.play = function()
    {
        // choose a new sound
        var new_snd = select_sound();
        this.snd.new_sound(new_snd);

        // play new sound
        this.snd.start();
    }
    this.stop = function()
    {
        this.snd.stop();
    }
    this.remove = function()
    {
        this.snd.remove();
    }
}

var SOUND_CONTOLLER = new SoundController();



function getJSONP(url,callback,img_num) 
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.onreadystatechange = function() 
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200) 
            {
                // Need to try to parse the object, sometimes the API returns a null value.
                try
                {
                    var obj = JSON.parse(xmlhttp.responseText);
                }
                catch(err)
                {
                    // If it fails to get a valid JSON, log error and try again.
                    console.log("Error reading JSON Object, fetching a new card.")
                    getJSONP(url,callback,img_num);
                    return
                }
                callback(obj,img_num)
            }
        }
    }.bind(img_num);
    xmlhttp.send(null);
}

function display_image(img,img_num)
{
    var id = "crd_back_" + img_num;
    var  holder = document.getElementById(id);
    if (holder.childElementCount < 1)
    {
        console.log(img_num);
        var elem = document.createElement("img");
        elem.src = img;   
        holder.appendChild(elem);
    }

}

function display_back(img_num)
{
    var id = "crd_front_" + img_num;
    var  holder = document.getElementById(id);
    if (holder.childElementCount < 1)
    {
        var elem = document.createElement("img");
        elem.src = "./res/img/crd_back.png";   
        holder.appendChild(elem);
    }   
}

function process_card(card,img_num)
{
    var img = card.card_images[0]["image_url"];
    display_image(img,img_num);
    setTimeout(function()
    {
        console.log(img_num) 
        rotate_card(img_num,true);
        if(img_num == 2)
        {
            document.getElementById("crd_back").addEventListener("click",flip_back);
        }
    }.bind(img_num), 750);  
}

function remove_cards()
{
    // Clean up card 1
    document.getElementById("crd_front_1").innerHTML = '';
    document.getElementById("crd_back_1").innerHTML = '';
    rotate_card(1,false);

    // Clean up card 2
    document.getElementById("crd_front_2").innerHTML = '';
    document.getElementById("crd_back_2").innerHTML = '';
    rotate_card(2,false);
}

function rotate_card(img_num,face)
{
    var selector = ".card_" + img_num;
    document.querySelector(selector).classList.toggle('is-flipped',face);
}

function draw()
{
    // Play the starting sound
    SOUND_CONTOLLER.play();
    
    // Disable the card from being clicked again.
    document.getElementById("crd_back").removeEventListener("click",flip_back);

    // Flip the card to the front side
    document.querySelector('.card').classList.toggle('is-flipped',true);
    
    var url = "https://db.ygoprodeck.com/api/v6/randomcard.php";
    var callback = process_card;

    // get the cards
    getJSONP(url,callback,1); // card 1 
    getJSONP(url,callback,2); // card 2
    
    // Display the card backs
    display_back(1);
    display_back(2);    
}

function flip_back()
{
    remove_cards();
    document.querySelector('.card').classList.toggle('is-flipped',false);
    SOUND_CONTOLLER.stop();
}

function setup()
{
    document.getElementById("crd_front").addEventListener("click",draw);
    document.getElementById("crd_back").addEventListener("click",flip_back);
}

// ""Entry Point""
setup();

