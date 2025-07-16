// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const form = document.querySelector('.form');

const onFormSubmit = event => {
    event.preventDefault();
    const delayInput = form.elements["delay"];
    const delay = Number(delayInput.value);

    const stateRadios = form.elements["state"];
    let state = null;
    for (const radio of stateRadios) {
        if (radio.checked) {
            state = radio.value;
        }
    }
  
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
    promise.then(delay => {
        iziToast.success({
            title: 'Success',
            message: `✅ Fulfilled promise in ${delay}ms`,
        });
    })
        .catch(delay => {
            iziToast.error({
                title: 'Error',
                message: `❌ Rejected promise in ${delay}ms`,
            });
        });

};

form.addEventListener('submit', onFormSubmit);