from flask import Flask, send_file
import requests
from chart import create_chart

app = Flask(__name__)

SPRING_API = "http://localhost:8080/api"

@app.route("/poll/chart/<int:poll_id>")
def poll_chart(poll_id):
    res = requests.get(f"{SPRING_API}/poll/{poll_id}/options")
    options = res.json()

    img_bytes = create_chart(options)   # ✅ 이제 file_path가 아니라 BytesIO 반환
    return send_file(img_bytes, mimetype="image/png")


if __name__ == "__main__":
    app.run(port=5000, debug=True)