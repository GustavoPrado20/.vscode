import mercadopago

sdk = mercadopago.SDK("APP_USR-3971247467048677-051512-7cd596e5c27ef1f04aa5b76869ef8e26-2439276265")

def gerar_link_pagamento():
    request_options = mercadopago.config.RequestOptions()
    request_options.custom_headers = {
        'x-idempotency-key': '<SOME_UNIQUE_VALUE>'
    }

    payment_data = {
        "items": [
            {
                "id": 1,
                "title": "Ameixa Roxa",
                "quantity": 1,
                "unit_price": 15.99
            }
        ],
        "back_urls":{
            "success": "http://127.0.0.1:5000/compracerta",
            "failure": "http://127.0.0.1:5000/compraerrada",
            "pending": "http://127.0.0.1:5000/compraerrada",
        }
    }
    try:
        result = sdk.preference().create(payment_data, request_options)
        payment = result["response"]
        link_iniciar_pagamento = payment["init_point"]
        return link_iniciar_pagamento
    except Exception as e:
        print(f"Erro ao gerar link de pagamento: {e}")
        return None