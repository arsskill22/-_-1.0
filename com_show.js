$('#comment-form').submit(function(event) {
    event.preventDefault();

    var username = $('#username').val();
    var comment = $('#comment').val();
    
    // Отправка POST запроса с комментариями
    $.ajax({
        url: 'https://d733-188-128-34-110.ngrok-free.app/',  /// путь 4
        method: 'POST',
        data: {
            username: username,
            comment: comment
        },
        headers: {
            'ngrok-skip-browser-warning': 'true'  
        },
        success: function(response) {
            console.log('Ответ от сервера (POST):', response);
            loadComments();  
            $('#comment-form')[0].reset();
        },
        error: function(xhr, status, error) {
            console.log('Ошибка при отправке комментария:', status, error);
        }
    });
});

function loadComments() {
    $.ajax({
        url: 'https://d733-188-128-34-110.ngrok-free.app/',  // путь 3
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'true'  
        },
        success: function(data) {
            console.log('Полученные данные от сервера (GET):', data);
            
            $('#comments-container').empty();  // Очищаем контейнер для комментариев

            // Проверяем, есть ли комментарии и выводим их
            if (data.comments && data.comments.length > 0) {
                data.comments.forEach(function(comment) {
                    var commentHTML = `
                        <div class="comment">
                            <strong>${comment.username}:</strong> <p>${comment.content}</p>
                        </div>
                    `;
                    $('#comments-container').append(commentHTML);
                });
            } else {
                $('#comments-container').append('<p>Комментариев нет.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.log('Ошибка при загрузке комментариев:', status, error);
            $('#comments-container').append('<p>Ошибка загрузки комментариев. Попробуйте позже.</p>');
        }
    });
}

$(document).ready(function() {
    loadComments();  // Загружаем комментарии при загрузке страницы



    document.querySelectorAll('.elem').forEach(function(item) {
        let count = 1;  // Переменная для количества каждого товара
        const counterElement = item.querySelector('.counter'); 
        const increaseButton = item.querySelector('.increase'); 
        const decreaseButton = item.querySelector('.decrease'); 
        const orderButton = item.querySelector('.orderButton'); 
        const productPriceElement = item.querySelector('.new-price');
        const productName = item.querySelector('h3'); // Получаем название товара
        const totalMessage = document.getElementById('totalMessage');
        
        // Обновление счётчика
        function updateCounter() {
            counterElement.textContent = count;
            updateTotalPrice();
        }
    
        // Обновление итоговой цены
        function updateTotalPrice() {
            const productPrice = parseFloat(productPriceElement.textContent.replace('р', '').trim());
            const totalPrice = productPrice * count;
            totalMessage.innerHTML = `Вы точно хотите заказать "${productName.textContent}" в количестве ${counterElement.textContent} ? <br> Итоговая сумма: ${totalPrice.toFixed(2)} рублей.`;
        }
    
        // Обработчики кнопок увеличения/уменьшения
        increaseButton.addEventListener('click', function() {
            count++;
            updateCounter();
        });
    
        decreaseButton.addEventListener('click', function() {
            if (count > 1) {
                count--;
                updateCounter();
            }
        });
    
        // Показать модальное окно при заказе
        orderButton.addEventListener('click', function() {
            updateTotalPrice();
            document.getElementById('modal').style.display = 'block';
            document.getElementById('modal').setAttribute('data-product', productName.textContent);
            document.getElementById('modal').setAttribute('data-count', count);  // Сохраняем количество товара в модальном окне
            document.getElementById('modal').setAttribute('data-total', (parseFloat(productPriceElement.textContent.replace('р', '').trim()) * count).toFixed(2));

        });
    });
    
    // Закрытие модального окна
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'none';
    });
    
    // Обработчик формы для телефона
    document.getElementById('phoneForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = document.getElementById('phone').value;
        const productName = document.getElementById('modal').getAttribute('data-product'); // Получаем название товара из модального окна
        const count = document.getElementById('modal').getAttribute('data-count'); // Получаем количество товара из модального окна
        const total = document.getElementById('modal').getAttribute('data-total');
        
    
        if (phone) {
            const orderData = {
                phone: phone,
                productName: productName,
                quantity: count,  // Передаем правильное количество товара
                totalPrice: total
            };
    
            // Отправка данных через fetch
            fetch('https://d733-188-128-34-110.ngrok-free.app/submit_order', { ///Путь 2
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Заказ оформлен успешно!');
                    document.getElementById('modal').style.display = 'none';
                } else {
                    alert('Произошла ошибка при оформлении заказа.');
                }
            })
            .catch(error => {
                alert('Ошибка: ' + error);
            });
        } else {
            alert('Пожалуйста, введите вашу почту.');
        }
    });
});

//Переворот карточки 
function flipсard(card, event) {
    if (event.target.tagName.toLowerCase() === 'button') {
        return 0; 
    }
    else {
    card.classList.toggle("flipped"); 
    }
}

//Прокрутка экрана в нужную область 
function scrolltoelement(element) {
    const section = document.getElementById(element);
    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth"  
    });
  }




let check; // Переменная 'check' без начального значения


function searchOrders() {
    let check;
    check = document.getElementById('phone').value;  // Инициализация переменной внутри функции

    if (!check) {
        alert("Пожалуйста, введите адрес почты.");
        return;
    }

    // Отправка POST запроса для получения кода подтверждения
    fetch('https://d733-188-128-34-110.ngrok-free.app/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: check })  // Используем check вместо phone
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            // Скрыть поле ввода почты и показать форму для ввода кода
            document.getElementById('phone').disabled = true;
            document.querySelector('button[onclick="searchOrders()"]').disabled = true;
            document.getElementById('codeVerification').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при поиске.');
    });
}

function verifyCode() {
    const code = document.getElementById('verificationCode').value;
    const phone = document.getElementById('phone').value;  // Получаем номер телефона

    if (!code || !phone) {
        alert("Пожалуйста, введите код подтверждения и номер телефона.");
        return;
    }

    console.log("Отправляем код на сервер: " + code + ", Телефон: " + phone);  // Логирование

    // Отправка POST запроса для проверки кода
    fetch('https://d733-188-128-34-110.ngrok-free.app/verify_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            phone: phone
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert("Код подтверждения верный!");
            // Далее выполняете действия, например, показываете заказы
            displayOrders(data);
        }
    })
    
}
function displayOrders(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";  // Очищаем контейнер перед добавлением новых данных

    // Логируем тип и содержимое объекта data
    console.log("Тип данных (data):", typeof data);  // Проверим, что это за тип данных
    console.log("Данные, полученные от сервера:", data);  // Логируем весь объект

    if (data.error) {
        // Если сервер вернул ошибку, выводим сообщение
        resultsDiv.innerHTML = `<p>${data.error}</p>`;
        console.error("Ошибка от сервера:", data.error);
        return;
    }

    // Проверяем, что 'orders' существует и является массивом
    if (Array.isArray(data.orders)) {
        console.log("Полученные заказы (orders):", data.orders);  // Логируем массив заказов
    } else {
        console.error("Ошибка: Ожидался массив 'orders', но получен:", typeof data.orders);
        resultsDiv.innerHTML = "<p>Ошибка при получении заказов. Пожалуйста, попробуйте снова.</p>";
        return;
    }

    if (data.orders.length === 0) {
        resultsDiv.innerHTML = "<p>Заказы с таким адресом почты не найдены.</p>";
        console.log("Заказы не найдены.");
    } else {
        // Перебираем полученные данные и создаем карточки
        data.orders.forEach(order => {
            console.log("Обрабатываем заказ:", order);  // Логируем каждый заказ

            const card = document.createElement('div');
            card.classList.add('order-card');

            // Добавляем контент в карточку
            card.innerHTML = `
                <h3>Позиция: ${order["Позиция"]}</h3>
                <p>Количество: ${order["Количество"]}</p>
                <p class="total">Итоговая сумма: ${order["Итоговая сумма"]} ₽</p>
            `;

            // Добавляем карточку в контейнер
            resultsDiv.appendChild(card);
            console.log("Карточка добавлена в DOM:", card);
        });
    }
}