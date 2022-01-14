const menu = document.querySelector(".header__nav-menu")
const menuBtn = document.querySelector(".header__nav-hamburger")
const icons = document.querySelectorAll(".footer__social-icon")
const shortenerUrls = document.querySelector(".shortener__urls")
const shortenBtn = document.querySelector(".shortener__form-send")
const url = document.querySelector(".shortener__form-url")
const form = document.querySelector(".shortener__form")

icons.forEach(icon => {
  icon.addEventListener("mouseover", changeColor)
  icon.addEventListener("mouseout", removeColor)
})

menuBtn.addEventListener("click", toggleMenu)
shortenBtn.addEventListener("click", sendURL)
shortenerUrls.addEventListener("click", copyLink)

function toggleMenu() {
  if (menu.classList.contains("hidden")) {
    menu.classList.replace("hidden", "active")
  } else {
    menu.classList.replace("active", "hidden")
  }
}

function changeColor(e) {
  const doc = e.target.getSVGDocument()
  doc.querySelector("path").setAttribute("fill", "hsl(180, 66%, 49%)")
}

function removeColor(e) {
  const doc = e.target.getSVGDocument()
  doc.querySelector("path").setAttribute("fill", "#fff")
}

async function sendURL(e) {
  url.value !== "" ? addLink(await shortenURL(url.value)) : errMsg()
}


async function shortenURL(url) {
  const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
  const data = await res.json()

  return {
    original_link: url,
    short_link: data.result.full_short_link
  }
}

function errMsg() {
  form.classList.add("err")

  setTimeout(() => form.classList.remove("err"), 2500)
}

function addLink(data) {
  const { original_link, short_link } = data

  const linkCard = `
    <div class="shortener__card">
      <p class="shortener__card-original">${original_link}</p>
      <div class="shortener__link">
        <p class="shortener__card-short">${short_link}</p>
        <button class="shortener__card-btn">Copy</button>
      </div>
      
    </div>
  `

  shortenerUrls.innerHTML += linkCard
}

function copyLink(e) {
  if (e.target.classList.contains("shortener__card-btn")) {
    console.log(e.target.previousElementSibling.lastElementChild)
    const link = e.target.previousElementSibling.textContent

    navigator.clipboard.writeText(link)
      .then(() => {
        e.target.style.backgroundColor = "hsl(257, 27%, 26%)"
        e.target.textContent = "Copied!"

        setTimeout(() => {
          e.target.style.backgroundColor = "hsl(180, 66%, 49%)"
          e.target.textContent = "Copy"
        }, 1500)
      })
  }
}