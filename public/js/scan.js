const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const finalResult = document.getElementById("finalResult");
const logs = document.getElementById("logs");
const statusText = document.getElementById("statusText");

const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");

let scanning = false;
let scanInterval;

let detectedValues = [];

// START CAMERA

async function initCamera(){

    try{

        const stream =
            await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"environment",
                width:{ ideal:1280 },
                height:{ ideal:720 }
            }

        });

        video.srcObject = stream;

    }catch(error){

        alert("Cannot access camera");

        console.error(error);

    }

}

initCamera();

// START SCAN

async function startScanning(){

    if(scanning) return;

    scanning = true;

    detectedValues = [];

    logs.innerHTML = "";

    statusText.innerText = "Scanning...";

    scanInterval = setInterval(async () => {

        await scanFrame();

    }, 1000);

    setTimeout(() => {

        stopScanning();

        processResults();

    }, 10000);

}

// STOP SCAN

function stopScanning(){

    scanning = false;

    clearInterval(scanInterval);

    statusText.innerText = "Stopped";

}

// SCAN FRAME

async function scanFrame(){

    if(!scanning) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const result =
        await Tesseract.recognize(canvas, 'eng', {
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        });

    const text = result.data.text;

    console.log(text);

    addLog(text);

    const regex =
        /[A-Z0-9]{2,9}/g;

    const matches = text.match(regex);

    if(matches){

        matches.forEach(value => {

            detectedValues.push(value);

        });

    }

}

// FINAL RESULT

function processResults(){

    if(detectedValues.length === 0){

        finalResult.innerText =
            "No valid card detected";

        return;

    }

    const counts = {};

    detectedValues.forEach(value => {

        counts[value] =
            (counts[value] || 0) + 1;

    });

    let bestValue = null;
    let highest = 0;

    for(let value in counts){

        if(counts[value] > highest){

            highest = counts[value];

            bestValue = value;

        }

    }

    finalResult.innerHTML = `
        ID code:<br>
        ${bestValue}
    `;

    statusText.innerText =
        "Checking database...";

    // CHECK DATABASE
    fetch(`http://localhost:3000/api/clients/${bestValue}`)
        .then(res => res.json())
        .then(data => {

            console.log("API response:", data);

            if (data.success) {

                statusText.innerText =
                    "Patient found, redirecting...";

                // WAIT 2 SECONDS
                setTimeout(() => {

                    window.location.href =
                        `/patients/${bestValue}`;

                }, 2000);

            } else {

                statusText.innerText =
                    "No match in database";

            }

        })
        .catch(err => {

            statusText.innerText =
                "Error connecting to server";

            console.error(err);

        });

}

// LOGS

function addLog(text){

    const div = document.createElement("div");

    div.className = "log-item";

    div.innerText = text;

    logs.prepend(div);

}

// OPEN IMAGE UPLOAD

function openUpload(){

    imageUpload.click();

}

// IMAGE UPLOAD OCR

imageUpload.addEventListener(
    "change",
    async function(event){

    const file = event.target.files[0];

    if(!file) return;

    statusText.innerText =
        "Loading image...";

    const img = new Image();

    img.onload = async function(){

        previewImage.src = img.src;
        previewImage.style.display = "block";

        // AUTO ROTATE IF LANDSCAPE

        if(img.width > img.height){

            canvas.width = img.height;
            canvas.height = img.width;

            ctx.save();

            ctx.translate(
                canvas.width / 2,
                canvas.height / 2
            );

            ctx.rotate(
                90 * Math.PI / 180
            );

            ctx.drawImage(
                img,
                -img.width / 2,
                -img.height / 2
            );

            ctx.restore();

        }else{

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

        }

        statusText.innerText =
            "Scanning uploaded image...";

        // OCR

        const result =
            await Tesseract.recognize(
                canvas,
                'eng',
                {
                    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
                }
            );

        const text = result.data.text;

        console.log(text);

        addLog(text);

        const regex =
            /[A-Z0-9]{2,9}/g;

        const matches = text.match(regex);

        if (matches && matches.length > 0) {

            const bestValue = matches.sort((a, b) =>
                matches.filter(v => v === a).length -
                matches.filter(v => v === b).length
            ).pop();

            finalResult.innerHTML =
                `ID Number: ${bestValue}`;

            statusText.innerText =
                "Checking database...";

            // CHECK DATABASE
            fetch(`http://localhost:3000/api/clients/${bestValue}`)
                .then(res => res.json())
                .then(data => {

                    console.log("API response:", data);

                    if (data.success) {

                        statusText.innerText =
                            "Patient found, redirecting...";

                        // WAIT 2 SECONDS
                        setTimeout(() => {

                            window.location.href =
                                `/patients/${bestValue}`;

                        }, 2000);

                    } else {

                        statusText.innerText =
                            "No match in database";

                    }

                })
                .catch(err => {

                    statusText.innerText =
                        "Error connecting to server";

                    console.error(err);

                });

        } else {

            statusText.innerText =
                "No valid card detected";

        }

    };

    img.src = URL.createObjectURL(file);

});