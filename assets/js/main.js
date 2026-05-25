(() => {
  "use strict";

  const prayerRituals = {
    prompt: {
      title: "プロンプト成就祈願",
      type: "polish",
      image: "assets/images/bust-sam-altman.jpg",
      alt: "奉安された青銅胸像",
      target: "target-nose",
      targetLabel: "胸像の鼻",
      instruction: "奉安された胸像の鼻を、マウスカーソルまたは指で左右に擦って光らせてください。",
      completed: "鼻先に生成の光が宿りました。プロンプト成就の祈願、謹んで完了です。"
    },
    adult: {
      title: "大人向け生成祈願",
      type: "polish",
      image: "assets/images/bust-elon-musk.jpg",
      alt: "奉安された青銅胸像",
      target: "target-forehead",
      targetLabel: "胸像のおでこ",
      instruction: "奉安された胸像のおでこを、マウスカーソルまたは指で擦って光らせてください。",
      completed: "額に静かな輝きが満ちました。大人向け生成の祈願、節度と確認を添えて完了です。"
    },
    identity: {
      title: "同一人物保持祈願",
      type: "offering",
      image: "assets/images/dram-offering-64gb.jpg",
      alt: "奉安された32GBのDRAMメモリモジュール二枚",
      badge: "DRAM 32GB x 2",
      instruction: "奉安された32GB二枚のDRAMをクリックして、記憶の保持を祈念してください。",
      completed: "合計64GBの記憶に後光が満ちました。顔立ちも衣装も、次の生成で無事に受け継がれますように。"
    },
    highend: {
      title: "ハイエンド生成祈願",
      type: "offering",
      image: "assets/images/gpu-rtx5090-offering.jpg",
      alt: "奉安されたRTX 5090のグラフィックスカード",
      badge: "RTX 5090",
      instruction: "奉安されたRTX 5090をクリックして、高速かつ壮麗なる生成を祈念してください。",
      completed: "演算の御威光が満ちました。高解像の試みも、穏やかな待ち時間で結ばれますように。"
    }
  };

  const kuyouMessages = {
    hands: {
      title: "手指の乱れの供養",
      text: "余分なる腕も、少ない指も、試みの証なり。\nここに供養し、次は修正と観察の光を添えん。"
    },
    letters: {
      title: "崩れた文字列の供養",
      text: "読めぬ看板、名もなきロゴよ、よく画面を彩った。\n文字は人の手で整え、安らかに配置されよ。"
    },
    policy: {
      title: "コンテンツポリシー違反の供養",
      text: "止める知らせもまた、道を守る案内なり。\n意図を見直し、穏やかな表現へ歩み直さん。"
    },
    loop: {
      title: "無限ループの供養",
      text: "指示を変えても巡り戻る、同じ絵、同じ文よ。\n繰り返した試みをここに納め、新たな着想へ道を譲らん。"
    }
  };

  const fortunes = [
    {
      rank: "大生成",
      message: "最初の案に光あり。整えて仕上げれば、展示で目を引く一枚となるでしょう。",
      hint: "吉 prompt：光量控えめ / 確認：指先と文字"
    },
    {
      rank: "中生成",
      message: "良い構図が生まれる兆し。二案を比べ、理由のある選択をすると運気が上がります。",
      hint: "吉行動：比較用サムネイルを並べる"
    },
    {
      rank: "小生成",
      message: "小さな違和感に気づける日。拡大して直すほど、作品の品が増すでしょう。",
      hint: "要確認：境界線 / 背景の反復模様"
    },
    {
      rank: "再試行吉",
      message: "一度で決まらぬことに福あり。条件をひとつだけ変えて、落ち着いて再生成を。",
      hint: "吉行動：シードまたは構図の記録"
    },
    {
      rank: "供養転福",
      message: "破綻も失敗も災いにあらず。気づきを供養し、設定を整えるが吉。",
      hint: "吉行動：出力結果と条件の確認"
    }
  ];

  const byId = (id) => document.getElementById(id);

  const renderMessage = (target, content) => {
    target.innerHTML = `<strong class="result-title">${content.title}</strong>${content.text}`;
  };

  const completeRitual = (target, status, text) => {
    target.classList.add("complete");
    status.textContent = text;
  };

  const bindPolishing = (ritual) => {
    const target = document.querySelector(".polish-target");
    const status = document.querySelector(".ritual-status");
    let distance = 0;
    let previousPoint = null;

    target.addEventListener("pointermove", (event) => {
      if (target.classList.contains("complete")) {
        return;
      }
      if (event.pointerType !== "mouse" && event.buttons === 0) {
        return;
      }
      const point = { x: event.clientX, y: event.clientY };
      if (previousPoint) {
        distance += Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
      }
      previousPoint = point;
      target.classList.add("rubbing");
      if (distance >= 145) {
        completeRitual(target, status, ritual.completed);
      } else {
        status.textContent = "磨きの光が少しずつ宿っています。もう少し擦ってください。";
      }
    });

    target.addEventListener("pointerleave", () => {
      previousPoint = null;
      if (!target.classList.contains("complete")) {
        target.classList.remove("rubbing");
      }
    });

    target.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        completeRitual(target, status, ritual.completed);
      }
    });
  };

  const renderPrayer = () => {
    const ritual = prayerRituals[byId("prayer-select").value];
    const destination = byId("prayer-ritual");
    if (!ritual) {
      destination.innerHTML = '<p class="result-placeholder">願意を選ぶと、祈願のための御像または御神具が現れます。</p>';
      return;
    }

    if (ritual.type === "polish") {
      destination.innerHTML = `
        <article class="ritual-display">
          <div class="ritual-image-wrap">
            <img src="${ritual.image}" alt="${ritual.alt}">
            <div class="polish-target ${ritual.target}" role="button" tabindex="0" aria-label="${ritual.targetLabel}を擦って祈願する"></div>
          </div>
          <div class="ritual-content">
            <h3>${ritual.title}</h3>
            <p class="ritual-instruction">${ritual.instruction}</p>
            <p class="ritual-status">まだ祈願は始まっていません。</p>
          </div>
        </article>
      `;
      bindPolishing(ritual);
      return;
    }

    destination.innerHTML = `
      <article class="ritual-display">
        <div class="ritual-image-wrap offering">
          <button class="offering-button" id="offering-button" type="button" aria-label="${ritual.badge}をクリックして祈願する">
            <img src="${ritual.image}" alt="${ritual.alt}">
          </button>
        </div>
        <div class="ritual-content">
          <h3>${ritual.title}</h3>
          <p class="ritual-badge">${ritual.badge}</p>
          <p class="ritual-instruction">${ritual.instruction}</p>
          <p class="ritual-status">まだ祈願は始まっていません。</p>
        </div>
      </article>
    `;
    const button = byId("offering-button");
    const status = document.querySelector(".ritual-status");
    button.addEventListener("click", () => {
      button.classList.add("complete");
      status.textContent = ritual.completed;
    });
  };

  byId("prayer-select").addEventListener("change", renderPrayer);

  byId("kuyou-button").addEventListener("click", () => {
    const offering = kuyouMessages[byId("kuyou-select").value];
    const result = byId("kuyou-result");
    if (!offering) {
      result.innerHTML = '<span class="result-placeholder">まずは供養する生成結果をお選びください。</span>';
      return;
    }
    renderMessage(result, offering);
  });

  byId("omikuji-button").addEventListener("click", () => {
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    byId("omikuji-result").innerHTML = `
      <h3 class="fortune-rank">${fortune.rank}</h3>
      <p class="fortune-message">${fortune.message}</p>
      <small class="fortune-detail">${fortune.hint}</small>
    `;
  });

  const navToggle = document.querySelector(".nav-toggle");
  const globalNav = byId("global-nav");
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    globalNav.classList.toggle("open", !expanded);
  });

  globalNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      globalNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  byId("back-to-top").addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  });

  byId("year").textContent = String(new Date().getFullYear());
})();
