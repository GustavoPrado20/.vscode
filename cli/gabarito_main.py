from flask import Flask, render_template
from api.apiMercadoPago import gerar_link_pagamento

app = Flask(__name__)

@app.route("/")
def homepage():
    link_iniciar_pagamento = gerar_link_pagamento()
    return render_template("prePagamento.html", link_pagamento=link_iniciar_pagamento)

@app.route("/prePagamento1")
def pre_pagamento1():
    link_iniciar_pagamento = gerar_link_pagamento()
    return render_template("prePagamento.html", link_pagamento=link_iniciar_pagamento)

@app.route("/create_payment", methods=["POST"])
def create_payment():
    title = request.form.get("title")
    quantity = request.form.get("quantity")
    unit_price = request.form.get("unit_price")
    shipping = request.form.get("shipping")

    if not all([title, quantity, unit_price, shipping]):
        return "<h1>Erro: Todos os campos são obrigatórios.</h1>"

    # Enviar os dados para o Mercado Pago
    link_pagamento = gerar_link_pagamento(title, quantity, unit_price, shipping)

    # Redirecionar para o link de pagamento
    return redirect(link_pagamento) if link_pagamento else "<h1>Erro ao gerar o link de pagamento.</h1>"

@app.route("/compracerta")
def compra_certa():
    return render_template("compracerta.html")

@app.route("/compraerrada")
def compra_errada():
    return render_template("compraerrada.html")

if __name__ == "__main__":
    app.run()