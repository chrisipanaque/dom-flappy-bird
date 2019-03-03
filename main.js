//https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
//https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault

// TODO:
// increase player.speed as player.score increases
// style Game Over screen
// border press start
// rename player properties to have more understandable keys
// rename functions to verbs
// html background
// add pipe ends to mimic mario pipes
// press space to start instead of click eventlistener

const score__container = document.querySelector(".score__container")
const game__start = document.querySelector(".game__start")
const game__area = document.querySelector(".game__area")
const game__end = document.querySelector(".game__end")

let keys = {}
let player = {}

game__start.addEventListener("click", start)
game__end.addEventListener("click", start)

document.addEventListener("keydown", pressOn)
document.addEventListener("keyup", pressOff)

function start() {
  // console.log("start")
  player.speed = 3

  //score
  player.score = 0

  //game start / game over control
  player.inplay = true;

  // clear moving element
  game__area.innerHTML = ""

  game__end.classList.add("hide")
  game__start.classList.add("hide")

  let bird = document.createElement("div")
  bird.setAttribute("class", "bird")

  let wing = document.createElement("span")
  wing.setAttribute("class", "wing")

  wing.pos = 15
  wing.style.top = wing.pos + "px"

  bird.appendChild(wing)
  game__area.appendChild(bird)

  player.x = bird.offsetLeft
  player.y = bird.offsetTop

  // obstacles
  player.pipe = 0
  player.pipeScore = 0
  let spacing = 500
  let howMany = Math.floor((game__area.offsetWidth) / spacing)

  // console.log(howMany)
  for (let x = 0; x < howMany; x++) {
    buildPipes(player.pipe * spacing)
  }

  window.requestAnimationFrame(playGame)
}

function buildPipes(startPos) {
  let totalHeight = game__area.offsetHeight
  let totalWidth = game__area.offsetWidth

  player.pipe++

  //pipeColor
  let pipeColor = randomColor()

  //pipeTop
  let pipeTop = document.createElement("div")
  pipeTop.start = startPos + totalWidth
  pipeTop.classList.add("pipe")
  pipeTop.innerHTML = "<br>" + player.pipe
  pipeTop.height = Math.floor(Math.random() * 450)
  pipeTop.style.height = pipeTop.height + "px"
  pipeTop.style.left = pipeTop.start + "px"
  pipeTop.style.top = "0px"
  pipeTop.style.borderTop = "none"
  pipeTop.horizontalPosition = pipeTop.start
  pipeTop.id = player.pipe
  pipeTop.style.backgroundColor = pipeColor
  game__area.appendChild(pipeTop)
  let pipeSpace = Math.floor(Math.random() * 250) + 250
  
  // pipeBottom
  let pipeBottom = document.createElement("div")
  pipeBottom.start = pipeTop.start
  pipeBottom.classList.add("pipe")
  pipeBottom.innerHTML = "<br>" + player.pipe
  // pipeBottom.height = Math.floor(Math.random() * 350)
  pipeBottom.style.height = totalHeight - pipeTop.height - pipeSpace + "px"
  pipeBottom.style.left = pipeTop.start + "px"
  pipeBottom.style.bottom = "0px"
  pipeBottom.style.borderBottom = "none"
  pipeBottom.horizontalPosition = pipeTop.start
  pipeBottom.id = player.pipe
  pipeBottom.style.backgroundColor = pipeColor
  game__area.appendChild(pipeBottom)
}

// RANDOM COLOR FUNCTION
function randomColor() {
  return `#${Math.random().toString(16).substr(-6)}`
}

function movePipes(bird, wing) {
  let pipes = document.querySelectorAll(".pipe")
  let counter = 0 // counts pipes to remove
  pipes.forEach(pipe => {
    pipe.horizontalPosition -= player.speed
    pipe.style.left = pipe.horizontalPosition + "px"

    if (pipe.horizontalPosition < 0) {
      pipe.parentElement.removeChild(pipe)
      counter++
    }

    // collide
    if (isCollide(pipe, bird)) {
      playGameOver(bird, wing)
    }

  })

  // TODO: Count pipes and display as score instead!
  counter = counter / 2
  for (let x = 0; x < counter; x++) {
    buildPipes(0)
    player.pipeScore += 1
  }
}

function isCollide(pipe, bird) {
  let pipeRectangle = pipe.getBoundingClientRect()
  let birdRectangle = bird.getBoundingClientRect()

  return !(
    (pipeRectangle.bottom < birdRectangle.top) ||
    (pipeRectangle.top > birdRectangle.bottom) ||
    (pipeRectangle.right < birdRectangle.left) ||
    (pipeRectangle.left > birdRectangle.right)
  )
}

function playGame() {
  if (player.inplay) {

    //elements to Object format *(.bird)*
    let bird = document.querySelector(".bird")
    let wing = document.querySelector(".wing")

    //scroll pipes
    movePipes(bird, wing)
    let move = false

    // moving constrains depending on viewport
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed
      move = true
    }
    if (keys.ArrowRight && player.x < (game__area.offsetWidth - 50)) {
      player.x += player.speed
      move = true
    }
    if ((keys.ArrowUp || keys.Space) && player.y > 0) {
      player.y -= player.speed * 5
      move = true
    }
    if (keys.ArrowDown && player.y < (game__area.offsetHeight - 50)) {
      player.y += player.speed
      move = true
    }

    if (move) {
      wing.pos = (wing.pos === 15) ? 25 : 15
      wing.style.top = wing.pos + "px"
    }

    //gravity
    player.y += (player.speed * 2)

    // if element is off the viewport
    // element reaches player.y then invoke playGameOver()
    // TO FIX: element is allowed to go bellow viewport
    if (player.y > game__area.offsetHeight) {
      // console.log(game__area.getBoundingClientRect().top)
      playGameOver(bird, wing)
    }

    bird.style.top = player.y + "px"
    bird.style.left = player.x + "px"

    window.requestAnimationFrame(playGame)

    //score - increment
    player.score++
    score__container.innerText = "Score:" + player.pipeScore
  }
}

function playGameOver(bird, wing) {
  player.inplay = false
  game__end.classList.remove("hide")

  bird.setAttribute("style", "background-image: url(christian-game-over.png); transform: rotate(-70deg)")
  wing.classList.add("hide")
  game__end.innerHTML = "Game Over<br>You scored " + player.pipeScore + "<br>Click here to start again"
}

function pressOn(e) {
  e.preventDefault()
  keys[e.code] = true
  // console.log(keys)
}

function pressOff(e) {
  e.preventDefault()
  keys[e.code] = false
}