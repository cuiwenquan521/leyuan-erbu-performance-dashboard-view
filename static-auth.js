(() => {
  const nativeFetch = window.fetch.bind(window);
  const CLOUD_TARGETS_KEY = "leyuan-cloud-targets-v1";

  function readLocalTargets() {
    try {
      const value = JSON.parse(localStorage.getItem(CLOUD_TARGETS_KEY) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch {
      return {};
    }
  }

  function normalizeTargetPayload(value) {
    const staffTargets = {};
    Object.entries(value?.staffTargets || {}).forEach(([name, target]) => {
      const amount = Math.max(0, Number(target) || 0);
      staffTargets[String(name)] = amount;
    });
    return {
      teamTarget: Math.max(0, Number(value?.teamTarget) || 0),
      staffTargets,
    };
  }

  function decodeBase64(value) {
    const binary = atob(value);
    return Uint8Array.from(binary, character => character.charCodeAt(0));
  }

  async function decryptEnvelope(manifest, envelope, password) {
    const material = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
    );
    const key = await crypto.subtle.deriveKey({
      name: "PBKDF2",
      hash: "SHA-256",
      salt: decodeBase64(envelope.salt),
      iterations: manifest.iterations,
    }, material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: decodeBase64(envelope.iv),
    }, key, decodeBase64(envelope.data));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  function installStaticApi(payload, role) {
    window.STATIC_ARCHIVE_MODE = true;
    window.STATIC_USER_ROLE = role;
    window.STATIC_DEFAULT_DATE = payload.latestDate;
    payload.targets = { ...(payload.targets || {}), ...readLocalTargets() };
    window.fetch = async (input, options = {}) => {
      const requestUrl = typeof input === "string" ? input : input.url;
      const url = new URL(requestUrl, window.location.href);
      if (!url.pathname.startsWith("/api/")) return nativeFetch(input, options);
      const method = String(options.method || "GET").toUpperCase();
      if (url.pathname === "/api/targets" && method === "POST") {
        if (role !== "admin") return jsonResponse({ message: "查看账号不能修改目标" }, 403);
        try {
          const request = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
          const month = String(request?.month || "");
          if (!/^\d{4}-\d{2}$/.test(month)) return jsonResponse({ message: "目标月份无效" }, 400);
          const target = normalizeTargetPayload(request);
          const localTargets = readLocalTargets();
          localTargets[month] = target;
          localStorage.setItem(CLOUD_TARGETS_KEY, JSON.stringify(localTargets));
          payload.targets[month] = target;
          return jsonResponse(target);
        } catch {
          return jsonResponse({ message: "目标数据无效" }, 400);
        }
      }
      if (method !== "GET") return jsonResponse({ message: "云端存档仅允许查看" }, 403);
      if (url.pathname === "/api/status") {
        return jsonResponse({ ...payload.status, publicViewOnly: true, publicRole: role });
      }
      if (url.pathname === "/api/report-settings") return jsonResponse(payload.reportSettings);
      if (url.pathname === "/api/archives") return jsonResponse({ archives: payload.archivesMeta });
      if (url.pathname === "/api/targets") {
        const month = url.searchParams.get("month") || "";
        return jsonResponse(payload.targets[month] || { teamTarget: 0, staffTargets: {} });
      }
      if (url.pathname.startsWith("/api/archive/")) {
        const date = decodeURIComponent(url.pathname.slice("/api/archive/".length));
        return payload.archives[date]
          ? jsonResponse(payload.archives[date])
          : jsonResponse({ message: "未找到该日期档案" }, 404);
      }
      return jsonResponse({ message: "接口不可用" }, 404);
    };
  }

  function installCloudRefresh(session) {
    const actions = document.querySelector(".toolbar-actions");
    if (!actions || actions.querySelector(".cloud-refresh-button")) return;
    const style = document.createElement("style");
    style.textContent = `
      .public-view-only .toolbar-actions{display:flex}
      .public-view-only .toolbar-actions>.button:not(.cloud-refresh-button){display:none}
    `;
    document.head.appendChild(style);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button primary cloud-refresh-button";
    button.title = "检查并载入最新发布的云端加密存档";
    button.innerHTML = '<span class="refresh-icon" aria-hidden="true">↻</span> 实时刷新';
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.classList.add("is-refreshing");
      try {
        const response = await nativeFetch(`./encrypted-data.json?t=${Date.now()}`, { cache: "no-store" });
        const nextManifest = await response.json();
        if (nextManifest.generatedAt === session.generatedAt) {
          if (typeof window.showToast === "function") window.showToast("当前已是最新数据");
          return;
        }
        const envelope = nextManifest.envelopes.find(item => item.username === session.username);
        if (!envelope) throw new Error("账号已失效，请重新登录");
        const payload = await decryptEnvelope(nextManifest, envelope, session.password);
        installStaticApi(payload, envelope.role);
        session.generatedAt = nextManifest.generatedAt;
        if (typeof window.initialize === "function") await window.initialize();
        if (typeof window.showToast === "function") window.showToast("最新数据已载入");
      } catch (refreshError) {
        if (typeof window.showToast === "function") window.showToast(refreshError.message || "刷新失败，请稍后重试");
      } finally {
        button.disabled = false;
        button.classList.remove("is-refreshing");
      }
    });
    actions.appendChild(button);
  }

  function createLogin() {
    const overlay = document.createElement("div");
    overlay.className = "cloud-login";
    overlay.innerHTML = `
      <form class="cloud-login-panel">
        <div class="cloud-login-mark">绩</div>
        <h1>乐源二部</h1>
        <p>订单业绩分析</p>
        <label>账号<input name="username" autocomplete="username" required /></label>
        <label>密码<input name="password" type="password" autocomplete="current-password" required /></label>
        <div class="cloud-login-error" role="alert"></div>
        <button type="submit" disabled>登录</button>
      </form>`;
    const style = document.createElement("style");
    style.textContent = `
      .cloud-login{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;background:#eef2f5;padding:20px;font-family:"Microsoft YaHei",sans-serif}
      .cloud-login-panel{width:min(360px,100%);background:#fff;border:1px solid #ccd6df;border-radius:8px;padding:30px;box-shadow:0 18px 50px rgba(25,45,60,.16)}
      .cloud-login-mark{width:46px;height:46px;display:grid;place-items:center;margin:0 auto 14px;background:#126b58;color:#fff;border-radius:6px;font-size:23px;font-weight:800}
      .cloud-login h1{margin:0;text-align:center;font-size:26px;color:#1f2d38}.cloud-login p{margin:6px 0 24px;text-align:center;color:#667786}
      .cloud-login label{display:block;margin:14px 0 6px;color:#344553;font-weight:700;font-size:14px}
      .cloud-login input{box-sizing:border-box;width:100%;height:42px;margin-top:7px;border:1px solid #b9c7d1;border-radius:5px;padding:0 11px;font:inherit;font-weight:400}
      .cloud-login input:focus{outline:2px solid #99cfc2;border-color:#126b58}
      .cloud-login button{width:100%;height:43px;margin-top:10px;border:0;border-radius:5px;background:#126b58;color:#fff;font-size:16px;font-weight:800;cursor:pointer}
      .cloud-login button:disabled{opacity:.6;cursor:wait}.cloud-login-error{min-height:22px;color:#b4232d;font-size:13px;padding-top:6px}
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    return overlay;
  }

  async function start() {
    const overlay = createLogin();
    const form = overlay.querySelector("form");
    const error = overlay.querySelector(".cloud-login-error");
    const button = overlay.querySelector("button");
    let manifest = null;

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!manifest) return;
      error.textContent = "";
      button.disabled = true;
      const username = form.elements.username.value.trim();
      const envelope = manifest.envelopes.find(item => item.username === username);
      try {
        if (!envelope) throw new Error("invalid");
        const payload = await decryptEnvelope(manifest, envelope, form.elements.password.value);
        installStaticApi(payload, envelope.role);
        const session = { username, password: form.elements.password.value, generatedAt: manifest.generatedAt };
        overlay.remove();
        const script = document.createElement("script");
        script.src = `./app.js?v=${encodeURIComponent(manifest.generatedAt)}`;
        script.addEventListener("load", () => installCloudRefresh(session));
        document.body.appendChild(script);
      } catch {
        error.textContent = "账号或密码不正确";
        button.disabled = false;
        form.elements.password.select();
      }
    });

    try {
      const response = await nativeFetch("./encrypted-data.json", { cache: "no-store" });
      manifest = await response.json();
      button.disabled = false;
    } catch {
      error.textContent = "云端数据暂时无法读取";
    }
  }

  start();
})();
