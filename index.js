const $ = (selector) => document.querySelector(selector)

let toJsonFlag = false

const form = $('#form')
const urlInput = $('#url')
const fileInput = $('#file')
const nameInput = $('#name')
const tagsInput = $('#tags')
const descriptionInput = $('#description')
const toJson = $('#tojson')

toJson.onchange = (e) => {
    toJsonFlag = e.target.checked
}

document.addEventListener('DOMContentLoaded', () => {
    urlInput.value = JSON.parse(localStorage.getItem(urlInput.name))
})

urlInput.oninput = (e) => {
    localStorage.setItem(urlInput.name, JSON.stringify(e.target.value))
}


function submit(e) {
    e.preventDefault()
    const formData = new FormData()
    const reader = new FileReader()
    const file = fileInput.files[0]

    reader.addEventListener('load', (e) => {
        const arrayBuffer = e.target.result
        const blob = new Blob([arrayBuffer], {type: file.type})

        formData.set('file', blob, file.name)
        formData.set(nameInput.name, nameInput.value)
        formData.set(descriptionInput.name, descriptionInput.value)
        formData.set(tagsInput.name, transformTagsInput(tagsInput.value, toJsonFlag))
        
        logSendData(formData)

        sendData(urlInput.value, formData)
    })

    reader.readAsArrayBuffer(file)
}

form.onsubmit = submit

function sendData(url, body) {
    fetch(url, {
        method:'POST',
        body,
    })
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(d => console.log(d))
        .catch(err => {
            console.log('Ошибка: ')
            console.error(err)
        })
}

function transformTagsInput(input, toJson){
    const tagsArray = input
    .split(',')
    .map((tag, i) => ({tagId: i, label: tag.trim()}))
    .filter(tag => tag.label.trim())
    
    if(toJson) {
        return JSON.stringify(tagsArray) 
    }
    
    return tagsArray
}

function logSendData(formData){
    let a = []
    
    for(let k of formData){
        a.push(k)
    }

    console.table(a)
}