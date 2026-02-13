/* TAB SWITCHING */
function openTab(tabId, clickedBtn) {
    document.querySelectorAll(".tabContent").forEach(tab =>
        tab.classList.remove("show")
    );

    document.querySelectorAll(".tabBtn").forEach(btn =>
        btn.classList.remove("active")
    );

    document.getElementById(tabId).classList.add("show");
    clickedBtn.classList.add("active");
}


/* IMAGE SLIDER */
const images = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4"
];

let index = 0;

setInterval(() => {
    index = (index + 1) % images.length;
    document.getElementById("slideImg").src = images[index];
}, 3000);


/* ROOM CALCULATOR */
function calculateRooms() {
    const house = parseFloat(document.getElementById("houseArea").value);
    const length = parseFloat(document.getElementById("roomLength").value);
    const width = parseFloat(document.getElementById("roomWidth").value);

    if (!house || !length || !width) {
        alert("Please fill all fields");
        return;
    }

    const roomArea = length * width;
    const rooms = Math.floor(house / roomArea);

    document.getElementById("result").innerText =
        `You can fit approximately ${rooms} rooms.`;
}


/* CHATBOT */
function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    let reply = getBotReply(text.toLowerCase());

    setTimeout(() => addMessage(reply, "bot"), 400);

    input.value = "";
}

function addMessage(msg, type) {
    const div = document.createElement("div");
    div.className = `message ${type}`;
    div.innerText = msg;

    document.getElementById("chatBox").appendChild(div);
}


function getBotReply(text) {

    if (text.includes("direction") || text.includes("north")) {
        return "Place living rooms facing north or east for natural light.";
    }

    if (text.includes("kitchen")) {
        return "Kitchen works best in south-east or near ventilation.";
    }

    if (text.includes("bedroom")) {
        return "Bedrooms should be quiet areas, preferably west or south side.";
    }

    if (text.includes("bathroom")) {
        return "Bathrooms should be near plumbing lines to reduce cost.";
    }

    return "Ask me about room placement, kitchen, bedroom, or directions!";
}
