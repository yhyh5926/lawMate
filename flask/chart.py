import matplotlib
matplotlib.use("Agg")  # ✅ GUI 백엔드 방지(스레드/윈도우 에러 방지)

import matplotlib.pyplot as plt
from io import BytesIO

# ✅ 한글 폰트 설정(윈도우)
plt.rcParams["font.family"] = "Malgun Gothic"  # 맑은 고딕
plt.rcParams["axes.unicode_minus"] = False

def create_chart(options):
    labels = [o["optionText"] for o in options]
    votes = [int(o["voteCnt"]) for o in options]
    total = sum(votes)

    plt.figure(figsize=(6, 6))

    if total == 0:
        # ✅ 투표가 0이면 pie를 그리면 NaN 나올 수 있어서 텍스트로 처리
        plt.text(0.5, 0.5, "아직 투표가 없습니다", ha="center", va="center", fontsize=14)
        plt.axis("off")
    else:
        plt.pie(votes, labels=labels, autopct="%1.1f%%")

    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    plt.close()
    buf.seek(0)
    return buf