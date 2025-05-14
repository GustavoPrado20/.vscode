from flask import Flask, render_template, request, redirect
from templates.apimercadopago import gerar_link_pagamento

app = Flask(__name__)

@app.route("/")
def homepage():
    return render_template("homepage.html")  # Não precisa passar link_pagamento aqui

@app.route("/compracerta")
def compra_certa():
    return render_template("compracerta.html")

@app.route("/compraerrada")
def compra_errada():
    return render_template("compraerrada.html")

@app.route("/comprar/ameixa", methods=["POST"])
def comprar_ameixa():
    quantidade = int(request.form["quantidade"])
    produto = {
        "id": "1",
        "title": "Ameixa Roxa",
        "quantity": quantidade,
        "currency_id": "BRL",
        "unit_price": 15.99
    }
    link = gerar_link_pagamento(produto)
    return redirect(link)

if __name__ == "__main__":
    app.run(debug=True)