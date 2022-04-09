let dogBar = document.querySelector('#dog-bar')
let dogInfo = document.querySelector('#dog-info')
let dogFilter = document.querySelector('#good-dog-filter')
let filterStatus = false

fetch(`http://localhost:3000/pups`)
.then(r => r.json())
.then(data => data.forEach(dog => renderDogBar(dog)))

function renderDogBar(dog){
    let goodDog = dog.isGoodDog
    let dogSpan = document.createElement('span')
    dogSpan.innerText = dog.name
    dogBar.append(dogSpan)

    dogSpan.addEventListener('click', () => {
        dogInfo.innerHTML = ''
        let image = document.createElement('img')
        let dogName = document.createElement('h2')
        let dogButton = document.createElement('button')
        
        image.src = dog.image
        dogName.innerText = dog.name
        dogButton.innerText = goodDog ? "Good Dog!" : "Bad Dog!"
        dogInfo.append(image, dogName, dogButton)

        dogButton.addEventListener('click', (e) => {
            goodDog = !goodDog
            fetch(`http://localhost:3000/pups/${dog.id}`,{
                method: 'PATCH',
                headers:{'Content-type': 'application/json'},
                body: JSON.stringify({
                    isGoodDog: goodDog
                })
            })
            .then(r => r.json())
            .then(updatedDog => {
                console.log(updatedDog)
                dogButton.innerText = updatedDog.isGoodDog ? "Good Dog!" : "Bad Dog!"
                goodDog = updatedDog.isGoodDog
            })
        })
    })

}

dogFilter.addEventListener('click', () => {
    filterStatus = !filterStatus
    dogFilter.innerText = filterStatus ? "Filter good dogs: ON" : "Filter good dogs: OFF"
    dogBar.innerHTML = ''
    fetch(`http://localhost:3000/pups`)
    .then(r => r.json())
    .then(data => {
        if(filterStatus){
            data.filter(dog => dog.isGoodDog === true).forEach(dog => renderDogBar(dog))
        }else{
            data.forEach(dog => renderDogBar(dog))
        }
    })
})
