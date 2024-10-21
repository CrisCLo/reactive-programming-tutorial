import { fromEvent, map, tap, shareReplay } from "rxjs";
import { sendMessage } from "./connection";

const form = document.getElementById("form") as HTMLFormElement;
const messagesList = document.getElementById("messages") as HTMLUListElement;

const userMessages$ = fromEvent<FormDataEvent>(form, 'submit').pipe(
    tap(event => event.preventDefault()),
    map(event => {
        const messageInput = (event.currentTarget as HTMLFormElement).querySelector('input[name="message"]') as HTMLInputElement;
        const message = messageInput.value;
        messageInput.value = "";
        return { data: message, action: "sent", timestamp: new Date() };
    }),
    shareReplay()
);

userMessages$.subscribe(message => {
    displayMessage(message);
    sendMessage(message);
});

function displayMessage(message: { data: string, action: string, timestamp: Date }) {
    const newMessage = document.createElement("li");
    newMessage.innerHTML = `
        <div>
            <p class="message-text">${message.data}</p>
            <p class="message-date">${message.action} ${new Date(message.timestamp).toLocaleString()}</p>
        </div>
    `;
    newMessage.classList.add(message.action);
    messagesList.appendChild(newMessage);
}
