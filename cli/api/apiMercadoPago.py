import mercadopago
import uuid

sdk = mercadopago.SDK("APP_USR-3971247467048677-051512-7cd596e5c27ef1f04aa5b76869ef8e26-2439276265")

def gerar_link_pagamento(title, quantity, unit_price, shipping):
    request_options = mercadopago.config.RequestOptions()
    request_options.custom_headers = {
        'x-idempotency-key': str(uuid.uuid4())
    }

    quantity = int(quantity)
    unit_price = float(unit_price)
    shipping = float(shipping)

    payment_data = {
        "items": [
            {
                "id": 1,
                "title": title,
                "quantity": quantity,
                "unit_price": unit_price
            }
        ],
        "shipments": {
            "cost": shipping,
            "mode": "not_specified"
        },
        "payer": {
            "email": "test_user_2084923723@testuser.com"
        },
        "back_urls":{
            "success": "https://samuelburkner.github.io/compracerta/",
            "failure": "https://samuelburkner.github.io/compraerrada/",
            "pending": "https://samuelburkner.github.io/compraerrada/",
        },
        "auto_return": "all"
    }
    try:

        result = sdk.preference().create(payment_data, request_options)
        payment = result["response"]
        print("🔍 Resposta completa da API Mercado Pago:")
        print(result)
        link_iniciar_pagamento = payment["sandbox_init_point"]
        return link_iniciar_pagamento
    
    except Exception as e:

        import traceback
        print(f"Erro ao gerar link de pagamento: {e}")
        traceback.print_exc()
        return None