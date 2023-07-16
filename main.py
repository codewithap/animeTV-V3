from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("main.html")

@app.route("/anime/<id>")
def anime(id):
    return render_template("main.html", mal_id = id)

@app.route("/play")
def play():
    m3u8 = request.args.get("m3u8")
    m3u8_2 = request.args.get("m3u8_2")
    poster = request.args.get("poster")
    return render_template("player.html", m3u8 = m3u8, m3u8_2 = m3u8_2, poster = poster)

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")
