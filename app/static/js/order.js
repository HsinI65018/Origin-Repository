TPDirect.setupSDK(123961, 'app_K436NeRBL2gkVP0zFxrHUTcDxCwUB970TsscoOHHnY7xdDVC2uThOLZHFpmW', 'sandbox');
let fields = {
    number: {
        element: '.card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        element: '.card-expiration-date',
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '.card-ccv',
        placeholder: 'CVV'
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        'input': {
            'color': '#757575',
            'font-size': '16px'
        },
        ':focus': {
            'border-color': 'red',
            'color': '#757575'
        }
    }
})

const paymentForm = document.querySelector('main>form');
const submitButton = document.querySelector('.submit-button');
const num = document.querySelector('.card-number');
const exp = document.querySelector('.card-expiration-date');
const ccv = document.querySelector('.card-ccv');

TPDirect.card.onUpdate(function (update) {
    // console.log(update)
    // if prime is true, send the payment form
    update.canGetPrime? submitButton.removeAttribute('disabled'): submitButton.setAttribute('disabled', true);

    // number is wrong or not
    if (update.status.number === 2) {
        num.classList.add('invalid')
    } else if (update.status.number === 0) {
        num.classList.add('valid')
    }
    // expiry is wrong or not
    if (update.status.expiry === 2) {
        exp.classList.add('invalid')
    } else if (update.status.expiry === 0) {
        exp.classList.add('valid')
    }
    // ccv is wrong or not
    if (update.status.ccv === 2) {
        ccv.classList.add('invalid')
    } else if (update.status.ccv === 0) {
        ccv.classList.add('valid')
    }
})