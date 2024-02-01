document.addEventListener("DOMContentLoaded", function () {
    const pesosInput = document.getElementById("pesosInput");
    const convertToEuroBtn = document.getElementById("convertToEuroBtn");
    const clearEuroBtn = document.getElementById("clearEuroBtn");
    const convertToDollarBtn = document.getElementById("convertToDollarBtn");
    const clearDollarBtn = document.getElementById("clearDollarBtn");
    const saveEuroBtn = document.getElementById("saveEuroBtn");
    const saveDollarBtn = document.getElementById("saveDollarBtn");
    const convertedAmountElement = document.getElementById("convertedAmount");
    const convertedValueElement = document.getElementById("convertedValue");
    const euroDisplay = document.getElementById("euroDisplay");
    const euroValueElement = document.getElementById("euroValue");
    const dollarDisplay = document.getElementById("dollarDisplay");
    const dollarValueElement = document.getElementById("dollarValue");
    const storedPesosElement = document.getElementById("storedPesos");
    const storedEuroElement = document.getElementById("storedEuro");
    const storedDollarElement = document.getElementById("storedDollar");

    let pesosValue = JSON.parse(localStorage.getItem("pesos")) || 0;
    let euroValue = JSON.parse(localStorage.getItem("euro")) || 0;
    let dollarValue = JSON.parse(localStorage.getItem("dollar")) || 0;

    function updatePesosDisplay() {
        pesosInput.value = "";
    }

    function updateEuroDisplay() {
        euroValueElement.textContent = euroValue.toFixed(2);
    }

    function updateDollarDisplay() {
        dollarValueElement.textContent = dollarValue.toFixed(2);
    }

    function convertCurrency(conversionRate, targetCurrency) {
        const pesos = parseFloat(pesosInput.value);

        if (isNaN(pesos)) {
            // Agregado SweetAlert2 para notificar al usuario el ingreso obligatorio de un número
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingrese una cantidad válida de pesos.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const convertedAmount = pesos / conversionRate;

        if (targetCurrency === "euro") {
            euroValue += convertedAmount;
            updateEuroDisplay();
        } else if (targetCurrency === "dollar") {
            dollarValue += convertedAmount;
            updateDollarDisplay();
        }

        pesosValue += pesos;
        updatePesosDisplay();
        updateStoredValues();
        updateConvertedAmount(convertedAmount, targetCurrency.charAt(0).toUpperCase() + targetCurrency.slice(1));
        saveToStorage();

        // Agregado Toastify-js para notificación LocalStorage
        mostrarToast("Recordatorio: Este dato también es almacenado en el Local Storage");
    }

    function clearEuro() {
        euroValue = 0;
        updateEuroDisplay();
        updateStoredValues();
        saveToStorage();
    }

    function clearDollar() {
        dollarValue = 0;
        updateDollarDisplay();
        updateStoredValues();
        saveToStorage();
    }

    function updateConvertedAmount(amount, currency) {
        const roundedAmount = amount.toFixed(2);
        convertedValueElement.textContent = roundedAmount;
        convertedAmountElement.textContent = `Cantidad Convertida a ${currency}: `;
        // Agregado de SweetAlert2
        Swal.fire({
            title: '¡Conversión exitosa!',
            text: `¡Felicitaciones! Has convertido la cantidad de pesos ingresados a ${currency}.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    function saveToStorage() {
        localStorage.setItem("pesos", JSON.stringify(pesosValue));
        localStorage.setItem("euro", JSON.stringify(euroValue));
        localStorage.setItem("dollar", JSON.stringify(dollarValue));
        updateStoredValues();
    }

    function updateStoredValues() {
        storedPesosElement.textContent = pesosValue;
        storedEuroElement.textContent = euroValue.toFixed(2);
        storedDollarElement.textContent = dollarValue.toFixed(2);
    }

    function fetchLocalData(jsonPath) {
        return fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error de red: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error al cargar datos locales:', error);
            });
    }

    const localJsonPath = 'data.json'; 

    fetchLocalData(localJsonPath)
        .then(data => {
            console.log('Datos locales:', data);

            const currencies = data.monedas;

            const euroExchangeRate = currencies.find(currency => currency.nombre === 'Euro').tasaCambio;
            const dollarExchangeRate = currencies.find(currency => currency.nombre === 'Dólar').tasaCambio;

            convertToEuroBtn.addEventListener("click", function () {
                convertCurrency(euroExchangeRate, "euro");
            });

            convertToDollarBtn.addEventListener("click", function () {
                convertCurrency(dollarExchangeRate, "dollar");
            });
        });

    clearEuroBtn.addEventListener("click", clearEuro);
    saveEuroBtn.addEventListener("click", saveToStorage);

    clearDollarBtn.addEventListener("click", clearDollar);
    saveDollarBtn.addEventListener("click", saveToStorage);

    updatePesosDisplay();
    updateEuroDisplay();
    updateDollarDisplay();
    updateStoredValues();
});

// Agregado de Toastify-js
function mostrarToast(mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "center",
    }).showToast();
}
