import mercadopago

def gerar_link_pagamento(produto):
    sdk = mercadopago.SDK("APP_USR-3082946021537058-050113-29893463f891ad514fee248d1d161f94-2419093784")

    payment_data = {
        "items": [produto],
        "back_urls": {
            "success": "http://127.0.0.1:5000/compracerta",
            "failure": "http://127.0.0.1:5000/compraerrada",
            "pending": "http://127.0.0.1:5000/compraerrada",
        },
        "auto_return": "all"
    }
    result = sdk.preference().create(payment_data)
    payment = result["response"]
    link_iniciar_pagamento = payment["init_point"]
    return link_iniciar_pagamento
