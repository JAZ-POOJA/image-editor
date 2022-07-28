const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),

filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img");
saveImgBtn = document.querySelector(".save-img");

let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const loadImage = () =>{
    let file = fileInput.files[0]; 
    // getting using selected files;
    if(!file) return; // return if user hasnt selected files.

    previewImg.src = URL.createObjectURL(file); // passing file url as preview img src.
    previewImg.addEventListener("load",() =>{
        document.querySelector(".container").classList.remove("disable");
    });
    
}

const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;

    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}
filterOptions.forEach(option =>{
    option.addEventListener("click", () =>{
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});


const updateFilter = () =>{
    filterValue.innerText = `${filterSlider.value}%`;

    const selectedFilter = document.querySelector(".filter .active"); // getting selected filter button.

    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }

    applyFilter();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => { // adding click event listener to all roatet/flip buttons
        if(option.id === "left") {
            rotate -= 90;    // if clicked btn is left rotate , decrement roatte value by -90.
        } else if(option.id === "right") {
            rotate += 90;   // if right increment roatte value by +90.
        } else if(option.id === "horizontal") {
            // if flipHorizontal value is 1 , set this value to -1 else set 1.
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {
    //resetting all variables value to its default value
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click(); // clicking brightness btn , so the brightness seleceted by default.
    applyFilter();
}

const saveImage = () =>{
    const canvas = document.createElement("canvas"); // creating canvas element;
    const ctx = canvas.getContext("2d"); // canvas.getcontxt return a drawing context on the canvas.
    canvas.width = previewImg.naturalWidth; // setting canvas width to actual image width
    canvas.height = previewImg.naturalHeight; // setting canvas height to actual image height.
      
    // applying user selected filters to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
    ctx.translate(canvas.width / 2 , canvas.height/2);// translate cnvas from center
    if(rotate != 0) {  // if roatate val is not zero , rotate the canavs .
        ctx.rotate(rotate * Math.PI /180);
    }

    ctx.scale(flipHorizontal , flipVertical); // flip canvas , horizontally / vertically.
    ctx.drawImage(previewImg, -canvas.width/2 , -canvas.height/2 , canvas.width, canvas.height);
    
    const link = document.createElement("a"); // creating <a > element.
    link.download= "editedimage.jpg"; // passing <a>tag download to editedimage.jpg

    link.href = canvas.toDataURL(); // passing <a> tag href value to canvas data url; 
    link.click(); //clicking <a> tag so that the image dowmload;

}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input" , updateFilter);
resetFilterBtn.addEventListener("click" , resetFilter);
chooseImgBtn.addEventListener("click" , ()=> fileInput.click());
saveImgBtn.addEventListener("click" , saveImage);
