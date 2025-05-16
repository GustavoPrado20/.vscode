from flask import Flask, render_template, request, redirect
from api.apiMercadoPago import gerar_link_pagamento

app = Flask(__name__)

@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/prePagamento1")
def pre_pagamento1():
    return render_template("prePagamento.html")

@app.route("/prePagamento2")
def pre_pagamento2():
    return render_template("prePagamento2.html")

@app.route("/prePagamento3")
def pre_pagamento3():
    return render_template("prePagamento3.html")

@app.route("/prePagamento4")
def pre_pagamento4():
    return render_template("prePagamento4.html")

@app.route("/prePagamento5")
def pre_pagamento5():
    return render_template("prePagamento5.html")

@app.route("/prePagamento6")
def pre_pagamento6():
    return render_template("prePagamento6.html")

@app.route("/prePagamento7")
def pre_pagamento7():
    return render_template("prePagamento7.html")

@app.route("/create_payment", methods=["POST"])
def create_payment():
    title = request.form.get("title")
    quantity = request.form.get("quantity")
    unit_price = request.form.get("unit_price")
    shipping = request.form.get("shipping")

    if not all([title, quantity, unit_price, shipping]):
        return "Erro: Todos os campos são obrigatórios."

    link_pagamento = gerar_link_pagamento(title, quantity, unit_price, shipping)

    return redirect(link_pagamento) if link_pagamento else "Erro ao gerar o link de pagamento."

@app.route("/compracerta")
def compra_certa():
    return render_template("compracerta.html")

@app.route("/compraerrada")
def compra_errada():
    return render_template("compraerrada.html")

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5500)