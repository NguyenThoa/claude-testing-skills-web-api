/**
 * Utility Xray Server Client — Tích hợp chuẩn REST API Jira Server & Xray Plugin Raven
 */
try {
  process.loadEnvFile();
} catch {
  // Không có .env thì dùng biến môi trường sẵn có
}

class XrayServerClient {
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || process.env.JIRA_BASE_URL || 'https://jira.cybertech.vn').replace(/\/+$/, '');
    this.token = options.token || process.env.JIRA_TOKEN;
    if (!this.token) {
      throw new Error('Không tìm thấy JIRA_TOKEN trong cấu hình môi trường (.env)!');
    }
  }

  get headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async fetchJson(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: { ...this.headers, ...(options.headers || {}) }
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { ok: res.ok, status: res.status, data };
  }

  /** Tạo issue bất kỳ trên Jira Core API */
  async createIssue(fields) {
    return await this.fetchJson(`${this.baseUrl}/rest/api/2/issue`, {
      method: 'POST',
      body: JSON.stringify({ fields })
    });
  }

  /** Cập nhật fields của một issue */
  async updateIssue(key, fields) {
    return await this.fetchJson(`${this.baseUrl}/rest/api/2/issue/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ fields })
    });
  }

  /** Tạo liên kết giữa 2 issues */
  async createIssueLink(typeName, inwardKey, outwardKey) {
    return await this.fetchJson(`${this.baseUrl}/rest/api/2/issueLink`, {
      method: 'POST',
      body: JSON.stringify({
        type: { name: typeName },
        inwardIssue: { key: inwardKey },
        outwardIssue: { key: outwardKey }
      })
    });
  }

  /** Thêm một manual step vào Test Issue (bắt buộc dùng PUT đơn lẻ) */
  async addTestStep(testKey, { step, data = '', result }) {
    return await this.fetchJson(`${this.baseUrl}/rest/raven/1.0/api/test/${testKey}/step`, {
      method: 'PUT',
      body: JSON.stringify({
        step: step || '',
        data: data || '',
        result: result || ''
      })
    });
  }

  /** Sửa nội dung một manual step đã có */
  async updateTestStep(testKey, stepId, { step, data = '', result }) {
    return await this.fetchJson(`${this.baseUrl}/rest/raven/1.0/api/test/${testKey}/step/${stepId}`, {
      method: 'POST',
      body: JSON.stringify({ step: step || '', data: data || '', result: result || '' })
    });
  }

  /** Xoá một manual step thừa */
  async deleteTestStep(testKey, stepId) {
    return await this.fetchJson(`${this.baseUrl}/rest/raven/1.0/api/test/${testKey}/step/${stepId}`, {
      method: 'DELETE'
    });
  }

  /** Gỡ tests khỏi Test Set, không xoá issue Test */
  async removeTestsFromTestSet(setKey, testKeys) {
    return await this.fetchJson(`${this.baseUrl}/rest/raven/1.0/api/testset/${setKey}/test`, {
      method: 'POST',
      body: JSON.stringify({ remove: testKeys })
    });
  }

  /** Gỡ tests khỏi Test Plan, không xoá issue Test */
  async removeTestsFromTestPlan(planKey, testKeys) {
    return await this.fetchJson(`${this.baseUrl}/rest/raven/1.0/api/testplan/${planKey}/test`, {
      method: 'POST',
      body: JSON.stringify({ remove: testKeys })
    });
  }

  /** Gán danh sách tests vào Test Set */
  async addTestsToTestSet(setKey, testKeys) {
    return await this.fetchJson(`${this.baseUrl}/rest/raven/1.0/api/testset/${setKey}/test`, {
      method: 'POST',
      body: JSON.stringify({ add: testKeys })
    });
  }

  /** Gán danh sách tests vào Test Plan */
  async addTestsToTestPlan(planKey, testKeys) {
    return await this.fetchJson(`${this.baseUrl}/rest/raven/1.0/api/testplan/${planKey}/test`, {
      method: 'POST',
      body: JSON.stringify({ add: testKeys })
    });
  }

  /** Import kết quả dạng Xray JSON, tạo Test Execution */
  async importExecutionJson(payload) {
    return await this.fetchJson(`${this.baseUrl}/rest/raven/1.0/import/execution`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /** Import kết quả JUnit XML. Gửi multipart nên không dùng header JSON mặc định */
  async importJunit(xml, fileName, { projectKey, testPlanKey }) {
    const query = new URLSearchParams({ projectKey });
    if (testPlanKey) query.set('testPlanKey', testPlanKey);
    const form = new FormData();
    form.append('file', new Blob([xml], { type: 'application/xml' }), fileName);

    const res = await fetch(`${this.baseUrl}/rest/raven/1.0/import/execution/junit?${query}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/json' },
      body: form
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { ok: res.ok, status: res.status, data };
  }

  /** Tìm issue theo JQL */
  async searchJql(jql, maxResults = 50) {
    const url = `${this.baseUrl}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`;
    return await this.fetchJson(url);
  }
}

module.exports = { XrayServerClient };
