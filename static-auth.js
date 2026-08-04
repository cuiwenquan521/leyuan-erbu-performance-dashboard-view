(() => {
  const nativeFetch = window.fetch.bind(window);
  const CLOUD_TARGETS_KEY = "leyuan-cloud-targets-v1";
  const CLOUD_SESSION_KEY = "leyuan-cloud-session-v1";
  const LOCAL_DASHBOARD_ORIGIN = "http://127.0.0.1:8765";

  function saveGroupAssignmentsThroughBridge(assignments) {
    return new Promise((resolve, reject) => {
      const popup = window.open(`${LOCAL_DASHBOARD_ORIGIN}/?group-config=1&bridge=1`, "leyuan-group-config-bridge", "width=720,height=520");
      if (!popup) {
        reject(new Error("浏览器阻止了本机保存窗口，请允许此网站打开弹窗后重试"));
        return;
      }
      const timeout = window.setTimeout(() => finish(new Error("本机同步服务响应超时，请确认同步服务正在运行")), 30000);
      const finish = (error, result) => {
        window.clearTimeout(timeout);
        window.removeEventListener("message", onMessage);
        if (error) reject(error);
        else resolve(result);
      };
      const onMessage = event => {
        if (event.origin !== LOCAL_DASHBOARD_ORIGIN || event.source !== popup) return;
        if (event.data?.type === "leyuan-group-config-ready") {
          popup.postMessage({ type: "leyuan-group-config-save", assignments }, LOCAL_DASHBOARD_ORIGIN);
          return;
        }
        if (event.data?.type === "leyuan-group-config-saved") finish(null, event.data.result);
        if (event.data?.type === "leyuan-group-config-error") finish(new Error(event.data.message || "本机群配置保存失败"));
      };
      window.addEventListener("message", onMessage);
    });
  }

  function readCloudSession() {
    try {
      const session = JSON.parse(sessionStorage.getItem(CLOUD_SESSION_KEY) || "null");
      return session?.username && session?.password ? session : null;
    } catch {
      return null;
    }
  }

  function saveCloudSession(session) {
    sessionStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify(session));
  }

  function clearCloudSession() {
    sessionStorage.removeItem(CLOUD_SESSION_KEY);
  }

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

  async function decompressPayload(value, compression) {
    if (!compression) return value;
    if (compression !== "gzip" || typeof DecompressionStream === "undefined") {
      throw new Error("当前浏览器不支持新版加密存档，请升级浏览器后重试");
    }
    const stream = new Blob([value]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function readEncryptedPayload(manifest, envelope) {
    if (envelope.data) return decodeBase64(envelope.data);
    if (!envelope.dataFile) throw new Error("加密存档文件无效");
    const response = await nativeFetch(`./${encodeURIComponent(envelope.dataFile)}?v=${encodeURIComponent(manifest.generatedAt)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("账号加密数据读取失败");
    return decodeBase64((await response.text()).trim());
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
    const decrypted = await crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: decodeBase64(envelope.iv),
    }, key, await readEncryptedPayload(manifest, envelope));
    const plain = await decompressPayload(new Uint8Array(decrypted), manifest.compression);
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
      if (url.pathname === "/api/group-assignments" && method === "POST") {
        if (role !== "admin") return jsonResponse({ message: "查看账号不能修改群维护配置" }, 403);
        try {
          const request = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
          const result = await saveGroupAssignmentsThroughBridge(request?.assignments || []);
          payload.groupAssignments = result;
          return jsonResponse(result);
        } catch (error) {
          return jsonResponse({ message: error.message || "无法连接本机同步服务" }, 503);
        }
      }
      if (method !== "GET") return jsonResponse({ message: "云端存档仅允许查看" }, 403);
      if (url.pathname === "/api/status") {
        return jsonResponse({ ...payload.status, publicViewOnly: true, publicRole: role });
      }
      if (url.pathname === "/api/report-settings") return jsonResponse(payload.reportSettings);
      if (url.pathname === "/api/group-assignments") return jsonResponse(payload.groupAssignments || { assignments: [] });
      if (url.pathname === "/api/group-orders") {
        const month = url.searchParams.get("month") || "";
        return jsonResponse(payload.groupOrders?.[month] || { month, source: "尚未同步", updatedAt: "", count: 0, orders: [] });
      }
      if (url.pathname === "/api/annual-performance") {
        const year = url.searchParams.get("year") || "";
        return jsonResponse(payload.annualPerformance?.[year] || { year: Number(year), source: "尚未同步", updatedAt: "", activeEmployees: [], months: {} });
      }
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
      .public-view-only .toolbar-actions>.button:not(.cloud-refresh-button):not(.local-erp-button){display:none}
    `;
    document.head.appendChild(style);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button primary cloud-refresh-button";
    button.title = "载入最近一次后台 ERP 同步后发布的云端数据";
    button.innerHTML = '<span class="refresh-icon" aria-hidden="true">↻</span> 获取最新数据';

    function updateCheckTime() {
      const label = document.querySelector("#lastUpdated");
      if (!label) return;
      const erpTime = label.textContent.split(" · 页面检查：")[0];
      const checkedAt = new Date().toLocaleString("zh-CN", { hour12: false });
      label.textContent = `${erpTime} · 页面检查：${checkedAt}`;
    }

    async function loadLatest(notify = true) {
      const response = await nativeFetch(`./encrypted-data.json?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("云端数据读取失败");
      const nextManifest = await response.json();
      updateCheckTime();
      if (nextManifest.generatedAt === session.generatedAt) {
        if (notify && typeof window.showToast === "function") window.showToast("已检查：当前已是最新云端数据；ERP 数据时间未变化");
        return false;
      }
      const envelope = nextManifest.envelopes.find(item => item.username === session.username);
      if (!envelope) throw new Error("账号已失效，请重新登录");
      const payload = await decryptEnvelope(nextManifest, envelope, session.password);
      installStaticApi(payload, envelope.role);
      session.generatedAt = nextManifest.generatedAt;
      saveCloudSession(session);
      if (typeof window.initialize === "function") await window.initialize();
      updateCheckTime();
      if (notify && typeof window.showToast === "function") window.showToast("最新云端数据已载入");
      return true;
    }

    button.addEventListener("click", async () => {
      button.disabled = true;
      button.classList.add("is-refreshing");
      try {
        await loadLatest(true);
      } catch (refreshError) {
        if (typeof window.showToast === "function") window.showToast(refreshError.message || "刷新失败，请稍后重试");
      } finally {
        button.disabled = false;
        button.classList.remove("is-refreshing");
      }
    });
    if (session.role === "admin") {
      const connect = document.createElement("a");
      connect.className = "button local-erp-button";
      connect.href = "http://127.0.0.1:8765/?connect=1&bridge=1";
      connect.target = "_blank";
      connect.title = "在办公电脑打开本机页面并连接 ERP";
      connect.textContent = "▣ 连接 ERP";
      const sync = document.createElement("a");
      sync.className = "button primary local-erp-button";
      sync.href = "http://127.0.0.1:8765/?sync=1&bridge=1";
      sync.target = "_blank";
      sync.title = "在办公电脑立即读取 ERP 个人业绩流水";
      sync.textContent = "↻ 立即同步 ERP";
      actions.append(connect, sync);
    }
    actions.appendChild(button);

    if (!window.__LEYUAN_ERP_BRIDGE_LISTENER__) {
      window.__LEYUAN_ERP_BRIDGE_LISTENER__ = true;
      window.addEventListener("message", async event => {
        if (event.origin !== "http://127.0.0.1:8765" || !event.data?.type?.startsWith("leyuan-erp-")) return;
        if (event.data.type === "leyuan-erp-connect-complete") {
          if (typeof window.showToast === "function") window.showToast(event.data.connected ? "ERP 已连接" : "ERP 登录窗口已打开，请完成登录后再同步");
          return;
        }
        if (event.data.type === "leyuan-erp-sync-error") {
          if (typeof window.showToast === "function") window.showToast(event.data.message || "ERP 同步失败");
          return;
        }
        button.disabled = true;
        button.classList.add("is-refreshing");
        try {
          const deadline = Date.now() + 90_000;
          while (Date.now() < deadline) {
            if (await loadLatest(false)) {
              if (typeof window.showToast === "function") window.showToast("ERP 已同步，最新数据已载入");
              return;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          throw new Error("ERP 已同步，但云端页面尚未更新，请稍后点击“获取最新数据”");
        } catch (error) {
          if (typeof window.showToast === "function") window.showToast(error.message || "最新数据载入失败");
        } finally {
          button.disabled = false;
          button.classList.remove("is-refreshing");
        }
      });
    }
    setInterval(() => {
      if (button.disabled) return;
      loadLatest(false).catch(() => {});
    }, 60_000);
  }

  async function completeLogin(manifest, envelope, password, overlay) {
    const payload = await decryptEnvelope(manifest, envelope, password);
    installStaticApi(payload, envelope.role);
    const session = { username: envelope.username, password, role: envelope.role, generatedAt: manifest.generatedAt };
    saveCloudSession(session);
    overlay.remove();
    const script = document.createElement("script");
    script.src = `./app.js?v=${encodeURIComponent(manifest.generatedAt)}`;
    script.addEventListener("load", () => installCloudRefresh(session));
    document.body.appendChild(script);
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
        await completeLogin(manifest, envelope, form.elements.password.value, overlay);
      } catch {
        clearCloudSession();
        error.textContent = "账号或密码不正确";
        button.disabled = false;
        form.elements.password.select();
      }
    });

    try {
      const response = await nativeFetch("./encrypted-data.json", { cache: "no-store" });
      manifest = await response.json();
      const savedSession = readCloudSession();
      if (savedSession) {
        const envelope = manifest.envelopes.find(item => item.username === savedSession.username);
        try {
          if (!envelope) throw new Error("invalid");
          await completeLogin(manifest, envelope, savedSession.password, overlay);
          return;
        } catch {
          clearCloudSession();
          error.textContent = "登录信息已更新，请重新输入账号密码";
        }
      }
      button.disabled = false;
    } catch {
      error.textContent = "云端数据暂时无法读取";
    }
  }

  start();
})();
