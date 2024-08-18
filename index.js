const $ = (selector) => document.querySelector(selector)

let toJsonFlag = false

const form = $('#form')
const urlInput = $('#url')
const fileInput = $('#file')
const nameInput = $('#name')
const tagsInput = $('#tags')
const descriptionInput = $('#description')

document.addEventListener('DOMContentLoaded', () => {
    urlInput.value = JSON.parse(localStorage.getItem(urlInput.name))
})

urlInput.oninput = (e) => {
    localStorage.setItem(urlInput.name, JSON.stringify(e.target.value))
}


function submit(e) {
    e.preventDefault()
    const formData = new FormData(form)

    formData.set(tagsInput.name, transformTagsInput(tagsInput.value))
    formData.set('fileOptions', JSON.stringify({
        "aspectRatio": "9/16",
        "objectPosition": "center"}))
    logSendData(formData)

    sendData(urlInput.value, formData)
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

function transformTagsInput(input){
    const tagsArray = input
    .split(',')
    .map((tag, i) => ({tagId: i, label: tag.trim()}))
    .filter(tag => tag.label.trim())

    return JSON.stringify(tagsArray)
}

function logSendData(formData){
    let a = []
    
    for(let k of formData){
        a.push(k)
    }

    console.table(a)
}