const socket = io()
const time = document.getElementById("time")
const root= document.getElementById("root")
const logout = document.getElementById("logout")
let timeRemaining = 600;
const timing = setInterval(()=>{
    timeRemaining--
    if(timeRemaining<0){
        root.insertAdjacentHTML("beforeend",
            `<figure id="modal">
            <h3 id="modalh3">hasta luego ${document.getElementById("userName").innerText}</h3>
             </figure>`
        )
        setInterval(async()=>{
            await fetch("http://127.0.0.1:3000/logOut",{method:"POST"})
            location.reload();
            return clearInterval(timing)
        },2000)
    }
    const hours    = (Math.floor(timeRemaining / 0xE10)).toString();
    const minutes  = (Math.floor(timeRemaining / 0x3C ) % 0x3C).toString();
    const seconds = (Math.round(timeRemaining % 0x3C)).toString();
    time.innerText = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
},1000);

logout.addEventListener("submit", (e) => {
    e.preventDefault();
    root.insertAdjacentHTML("beforeend", 
            `<figure id="modal">
            <div>
                <h3>See you later ${document.getElementById("userName").innerText}!</h3>
            </div>
        </figure>`
        )
    setTimeout(() => {
        logout.submit();
    }, 2000);
})