const path = require('path')
const os = require('os')

const form = document.getElementById('image-form')
const slider = document.getElementById('slider')
const img = document.getElementById('img')
const { ipcRenderer } = require('electron')
const slash = require('slash')

document.getElementById('output-path').innerText = path.join(
    os.homedir(),
    'imageshrink'
)

//    OnSubmit
form.addEventListener('submit', e => {
    e.preventDefault()

    const imgPath = img.files[0].path;
    const quality = slider.value;

    ipcRenderer.send('image:minimize', {
        imgPath,
        quality,
    })
})

// On Done
ipcRenderer.on('image:done', () => {
    M.toast({
        html: 'Image Resized to' + slider.value + '% quality'
    })
})